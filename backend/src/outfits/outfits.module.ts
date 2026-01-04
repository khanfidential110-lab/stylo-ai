import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutfitsController } from './outfits.controller';
import { OutfitsService } from './outfits.service';
import { RecommendationService } from './recommendation.service';
import { Outfit } from '../database/entities/outfit.entity';
import { OutfitCalendar } from '../database/entities/outfit-calendar.entity';
import { WardrobeModule } from '../wardrobe/wardrobe.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Outfit, OutfitCalendar]),
    WardrobeModule,
    WeatherModule,
  ],
  controllers: [OutfitsController],
  providers: [OutfitsService, RecommendationService],
  exports: [OutfitsService, RecommendationService],
})
export class OutfitsModule {}
