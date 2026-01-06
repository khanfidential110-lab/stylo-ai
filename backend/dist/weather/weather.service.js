"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let WeatherService = class WeatherService {
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('weather.apiKey');
        this.baseUrl = this.configService.get('weather.baseUrl');
    }
    async getCurrentWeather(city) {
        try {
            const geoResponse = await axios_1.default.get('https://geocoding-api.open-meteo.com/v1/search', {
                params: { name: city, count: 1, language: 'en', format: 'json' },
            });
            if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
                return this.getMockWeather(city);
            }
            const { latitude, longitude, name, country } = geoResponse.data.results[0];
            return this.getWeatherByCoordinates(latitude, longitude, name, country);
        }
        catch (error) {
            console.error('Weather API Error:', error.message);
            return this.getMockWeather(city);
        }
    }
    async getWeatherByCoordinates(lat, lon, cityName, countryCode) {
        try {
            const response = await axios_1.default.get('https://api.open-meteo.com/v1/forecast', {
                params: {
                    latitude: lat,
                    longitude: lon,
                    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
                    temperature_unit: 'fahrenheit',
                    wind_speed_unit: 'mph',
                },
            });
            const current = response.data.current;
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
        }
        catch (error) {
            console.error('Weather API Error:', error.message);
            return this.getMockWeather(cityName || 'Unknown');
        }
    }
    getWeatherDescription(code) {
        if (code === 0)
            return { description: 'Clear sky', icon: '01d' };
        if (code <= 3)
            return { description: 'Partly cloudy', icon: '02d' };
        if (code <= 48)
            return { description: 'Foggy', icon: '50d' };
        if (code <= 67)
            return { description: 'Rain', icon: '10d' };
        if (code <= 77)
            return { description: 'Snow', icon: '13d' };
        if (code <= 82)
            return { description: 'Rain showers', icon: '09d' };
        if (code <= 86)
            return { description: 'Snow showers', icon: '13d' };
        if (code <= 99)
            return { description: 'Thunderstorm', icon: '11d' };
        return { description: 'Unknown', icon: '50d' };
    }
    async getForecast(city, days = 7) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/forecast`, {
                params: {
                    q: city,
                    appid: this.apiKey,
                    units: 'imperial',
                    cnt: days * 8,
                },
            });
            const data = response.data;
            const dailyForecasts = new Map();
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
                }
                else {
                    const existing = dailyForecasts.get(dateKey);
                    existing.temperature.min = Math.min(existing.temperature.min, item.main.temp);
                    existing.temperature.max = Math.max(existing.temperature.max, item.main.temp);
                }
            }
            return Array.from(dailyForecasts.values()).slice(0, days);
        }
        catch (error) {
            return this.getMockForecast(days);
        }
    }
    getClothingRecommendations(weather) {
        const temp = weather.feelsLike;
        const description = weather.description.toLowerCase();
        const recommendations = {
            layers: [],
            accessories: [],
            materials: [],
            avoid: [],
        };
        if (temp < 32) {
            recommendations.layers = ['heavy coat', 'sweater', 'thermal underwear', 'scarf'];
            recommendations.accessories = ['warm hat', 'gloves', 'scarf'];
            recommendations.materials = ['wool', 'fleece', 'down'];
            recommendations.avoid = ['thin fabrics', 'open shoes'];
        }
        else if (temp < 45) {
            recommendations.layers = ['winter coat', 'sweater', 'long sleeves'];
            recommendations.accessories = ['hat', 'gloves'];
            recommendations.materials = ['wool', 'fleece'];
            recommendations.avoid = ['shorts', 'sandals'];
        }
        else if (temp < 60) {
            recommendations.layers = ['light jacket', 'long sleeves'];
            recommendations.accessories = ['light scarf'];
            recommendations.materials = ['cotton', 'denim'];
            recommendations.avoid = ['heavy coats'];
        }
        else if (temp < 75) {
            recommendations.layers = ['light layers', 't-shirt'];
            recommendations.accessories = ['sunglasses'];
            recommendations.materials = ['cotton', 'linen'];
            recommendations.avoid = ['heavy layers'];
        }
        else if (temp < 85) {
            recommendations.layers = ['short sleeves', 'light fabrics'];
            recommendations.accessories = ['sunglasses', 'hat'];
            recommendations.materials = ['linen', 'cotton', 'moisture-wicking'];
            recommendations.avoid = ['dark colors', 'heavy fabrics'];
        }
        else {
            recommendations.layers = ['minimal clothing', 'breathable fabrics'];
            recommendations.accessories = ['sunglasses', 'sun hat'];
            recommendations.materials = ['linen', 'light cotton'];
            recommendations.avoid = ['dark colors', 'synthetic fabrics', 'layers'];
        }
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
    getMockWeather(city) {
        const conditions = [
            { description: 'clear sky', icon: '01d' },
            { description: 'partly cloudy', icon: '02d' },
            { description: 'overcast clouds', icon: '04d' },
            { description: 'light rain', icon: '10d' },
        ];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const temp = Math.floor(Math.random() * 50) + 40;
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
    getMockForecast(days) {
        const forecast = [];
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
};
exports.WeatherService = WeatherService;
exports.WeatherService = WeatherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WeatherService);
//# sourceMappingURL=weather.service.js.map