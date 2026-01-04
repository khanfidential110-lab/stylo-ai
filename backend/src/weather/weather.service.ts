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
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'imperial', // Fahrenheit
        },
      });

      const data = response.data;

      return {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: Math.round(data.wind.speed),
        city: data.name,
        country: data.sys.country,
      };
    } catch (error) {
      // Return mock data for development/demo
      return this.getMockWeather(city);
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'imperial',
        },
      });

      const data = response.data;

      return {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: Math.round(data.wind.speed),
        city: data.name,
        country: data.sys.country,
      };
    } catch (error) {
      return this.getMockWeather('Unknown');
    }
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
