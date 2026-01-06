import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  uvIndex?: number;
  precipitation?: number;
  city: string;
  country: string;
}

export interface ForecastData {
  date: Date;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
  precipitation: number;
}

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get('weather.apiKey');
    this.baseUrl = this.configService.get('weather.baseUrl');
  }

  async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      // 1. Geocoding to get lat/lon
      const geoResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: { name: city, count: 1, language: 'en', format: 'json' },
      });

      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        return this.getMockWeather(city);
      }

      const { latitude, longitude, name, country } = geoResponse.data.results[0];

      // 2. Get Weather
      return this.getWeatherByCoordinates(latitude, longitude, name, country);
    } catch (error) {
      console.error('Weather API Error:', error.message);
      return this.getMockWeather(city);
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number, cityName?: string, countryCode?: string): Promise<WeatherData> {
    try {
      const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
          temperature_unit: 'fahrenheit',
          wind_speed_unit: 'mph',
        },
      });

      const current = response.data.current;

      // Map WMO weather code to description/icon
      const { description, icon } = this.getWeatherDescription(current.weather_code);

      return {
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        description: description,
        icon: icon,
        windSpeed: Math.round(current.wind_speed_10m),
        city: cityName || 'Unknown Location',
        country: countryCode || '',
      };
    } catch (error) {
      console.error('Weather API Error:', error.message);
      return this.getMockWeather(cityName || 'Unknown');
    }
  }

  private getWeatherDescription(code: number): { description: string; icon: string } {
    // Open-Meteo WMO codes
    // 0: Clear sky
    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    // 45, 48: Fog
    // 51, 53, 55: Drizzle
    // 61, 63, 65: Rain
    // 71, 73, 75: Snow
    // 95: Thunderstorm

    if (code === 0) return { description: 'Clear sky', icon: '01d' };
    if (code <= 3) return { description: 'Partly cloudy', icon: '02d' }; // or 04d for overcast
    if (code <= 48) return { description: 'Foggy', icon: '50d' };
    if (code <= 67) return { description: 'Rain', icon: '10d' };
    if (code <= 77) return { description: 'Snow', icon: '13d' };
    if (code <= 82) return { description: 'Rain showers', icon: '09d' };
    if (code <= 86) return { description: 'Snow showers', icon: '13d' };
    if (code <= 99) return { description: 'Thunderstorm', icon: '11d' };
    return { description: 'Unknown', icon: '50d' };
  }

  async getForecast(city: string, days = 7): Promise<ForecastData[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'imperial',
          cnt: days * 8, // 8 data points per day (3-hour intervals)
        },
      });

      const data = response.data;
      const dailyForecasts: Map<string, ForecastData> = new Map();

      for (const item of data.list) {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toISOString().split('T')[0];

        if (!dailyForecasts.has(dateKey)) {
          dailyForecasts.set(dateKey, {
            date,
            temperature: {
              min: item.main.temp,
              max: item.main.temp,
            },
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            precipitation: item.pop * 100,
          });
        } else {
          const existing = dailyForecasts.get(dateKey);
          existing.temperature.min = Math.min(existing.temperature.min, item.main.temp);
          existing.temperature.max = Math.max(existing.temperature.max, item.main.temp);
        }
      }

      return Array.from(dailyForecasts.values()).slice(0, days);
    } catch (error) {
      return this.getMockForecast(days);
    }
  }

  getClothingRecommendations(weather: WeatherData): {
    layers: string[];
    accessories: string[];
    materials: string[];
    avoid: string[];
  } {
    const temp = weather.feelsLike;
    const description = weather.description.toLowerCase();

    const recommendations = {
      layers: [] as string[],
      accessories: [] as string[],
      materials: [] as string[],
      avoid: [] as string[],
    };

    // Temperature-based recommendations
    if (temp < 32) {
      // Freezing
      recommendations.layers = ['heavy coat', 'sweater', 'thermal underwear', 'scarf'];
      recommendations.accessories = ['warm hat', 'gloves', 'scarf'];
      recommendations.materials = ['wool', 'fleece', 'down'];
      recommendations.avoid = ['thin fabrics', 'open shoes'];
    } else if (temp < 45) {
      // Cold
      recommendations.layers = ['winter coat', 'sweater', 'long sleeves'];
      recommendations.accessories = ['hat', 'gloves'];
      recommendations.materials = ['wool', 'fleece'];
      recommendations.avoid = ['shorts', 'sandals'];
    } else if (temp < 60) {
      // Cool
      recommendations.layers = ['light jacket', 'long sleeves'];
      recommendations.accessories = ['light scarf'];
      recommendations.materials = ['cotton', 'denim'];
      recommendations.avoid = ['heavy coats'];
    } else if (temp < 75) {
      // Mild
      recommendations.layers = ['light layers', 't-shirt'];
      recommendations.accessories = ['sunglasses'];
      recommendations.materials = ['cotton', 'linen'];
      recommendations.avoid = ['heavy layers'];
    } else if (temp < 85) {
      // Warm
      recommendations.layers = ['short sleeves', 'light fabrics'];
      recommendations.accessories = ['sunglasses', 'hat'];
      recommendations.materials = ['linen', 'cotton', 'moisture-wicking'];
      recommendations.avoid = ['dark colors', 'heavy fabrics'];
    } else {
      // Hot
      recommendations.layers = ['minimal clothing', 'breathable fabrics'];
      recommendations.accessories = ['sunglasses', 'sun hat'];
      recommendations.materials = ['linen', 'light cotton'];
      recommendations.avoid = ['dark colors', 'synthetic fabrics', 'layers'];
    }

    // Weather condition adjustments
    if (description.includes('rain') || description.includes('drizzle')) {
      recommendations.layers.push('waterproof jacket');
      recommendations.accessories.push('umbrella');
      recommendations.avoid.push('suede', 'open shoes');
    }

    if (description.includes('snow')) {
      recommendations.layers.push('insulated boots');
      recommendations.avoid.push('leather soles');
    }

    if (weather.windSpeed > 15) {
      recommendations.layers.push('windbreaker');
      recommendations.avoid.push('loose accessories');
    }

    return recommendations;
  }

  private getMockWeather(city: string): WeatherData {
    // Simulate weather data for development
    const conditions = [
      { description: 'clear sky', icon: '01d' },
      { description: 'partly cloudy', icon: '02d' },
      { description: 'overcast clouds', icon: '04d' },
      { description: 'light rain', icon: '10d' },
    ];

    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.floor(Math.random() * 50) + 40; // 40-90°F

    return {
      temperature: temp,
      feelsLike: temp - 3,
      humidity: Math.floor(Math.random() * 50) + 30,
      description: condition.description,
      icon: condition.icon,
      windSpeed: Math.floor(Math.random() * 20),
      city: city,
      country: 'US',
    };
  }

  private getMockForecast(days: number): ForecastData[] {
    const forecast: ForecastData[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      forecast.push({
        date,
        temperature: {
          min: Math.floor(Math.random() * 20) + 50,
          max: Math.floor(Math.random() * 20) + 70,
        },
        description: 'partly cloudy',
        icon: '02d',
        precipitation: Math.floor(Math.random() * 50),
      });
    }

    return forecast;
  }
}
