import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WardrobeController } from './wardrobe.controller';
import { WardrobeService } from './wardrobe.service';
import { AiService } from './ai.service';
import { OutfitDetectionService } from './outfit-detection.service';
import { WardrobeItem } from '../database/entities/wardrobe-item.entity';
import { User } from '../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WardrobeItem, User])],
  controllers: [WardrobeController],
  providers: [WardrobeService, AiService, OutfitDetectionService],
  exports: [WardrobeService, AiService, OutfitDetectionService],
})
export class WardrobeModule {}
