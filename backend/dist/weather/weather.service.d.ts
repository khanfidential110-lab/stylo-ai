import { ConfigService } from '@nestjs/config';
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
export declare class WeatherService {
    private readonly configService;
    private readonly apiKey;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    getCurrentWeather(city: string): Promise<WeatherData>;
    getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData>;
    getForecast(city: string, days?: number): Promise<ForecastData[]>;
    getClothingRecommendations(weather: WeatherData): {
        layers: string[];
        accessories: string[];
        materials: string[];
        avoid: string[];
    };
    private getMockWeather;
    private getMockForecast;
}
