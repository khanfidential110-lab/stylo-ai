import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('weather')
@Controller('weather')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiOperation({ summary: 'Get current weather' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lon', required: false })
  @ApiResponse({ status: 200, description: 'Returns current weather' })
  async getCurrentWeather(
    @Query('city') city?: string,
    @Query('lat') lat?: number,
    @Query('lon') lon?: number,
  ) {
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

  @Get('forecast')
  @ApiOperation({ summary: 'Get weather forecast' })
  @ApiQuery({ name: 'city', required: true })
  @ApiQuery({ name: 'days', required: false })
  @ApiResponse({ status: 200, description: 'Returns weather forecast' })
  async getForecast(
    @Query('city') city: string,
    @Query('days') days?: number,
  ) {
    return this.weatherService.getForecast(city, days || 7);
  }
}
