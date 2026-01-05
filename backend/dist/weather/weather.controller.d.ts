import { WeatherService } from './weather.service';
export declare class WeatherController {
    private readonly weatherService;
    constructor(weatherService: WeatherService);
    getCurrentWeather(city?: string, lat?: number, lon?: number): Promise<{
        weather: import("./weather.service").WeatherData;
        recommendations: {
            layers: string[];
            accessories: string[];
            materials: string[];
            avoid: string[];
        };
    }>;
    getForecast(city: string, days?: number): Promise<import("./weather.service").ForecastData[]>;
}
