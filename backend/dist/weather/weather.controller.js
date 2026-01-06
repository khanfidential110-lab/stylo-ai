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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const weather_service_1 = require("./weather.service");
let WeatherController = class WeatherController {
    constructor(weatherService) {
        this.weatherService = weatherService;
    }
    async getCurrentWeather(city, lat, lon) {
        if (lat && lon) {
            const weather = await this.weatherService.getWeatherByCoordinates(lat, lon);
            return {
                weather,
                recommendations: this.weatherService.getClothingRecommendations(weather),
            };
        }
        const weather = await this.weatherService.getCurrentWeather(city || 'New York');
        return {
            weather,
            recommendations: this.weatherService.getClothingRecommendations(weather),
        };
    }
    async getForecast(city, days) {
        return this.weatherService.getForecast(city, days || 7);
    }
};
exports.WeatherController = WeatherController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current weather' }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'lat', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'lon', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns current weather' }),
    __param(0, (0, common_1.Query)('city')),
    __param(1, (0, common_1.Query)('lat')),
    __param(2, (0, common_1.Query)('lon')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "getCurrentWeather", null);
__decorate([
    (0, common_1.Get)('forecast'),
    (0, swagger_1.ApiOperation)({ summary: 'Get weather forecast' }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns weather forecast' }),
    __param(0, (0, common_1.Query)('city')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "getForecast", null);
exports.WeatherController = WeatherController = __decorate([
    (0, swagger_1.ApiTags)('weather'),
    (0, common_1.Controller)('weather'),
    __metadata("design:paramtypes", [weather_service_1.WeatherService])
], WeatherController);
//# sourceMappingURL=weather.controller.js.map