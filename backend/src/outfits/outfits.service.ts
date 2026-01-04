import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Outfit, OutfitItem, OutfitFeedback } from '../database/entities/outfit.entity';
import { OutfitCalendar } from '../database/entities/outfit-calendar.entity';
import { WardrobeService } from '../wardrobe/wardrobe.service';
import { RecommendationService } from './recommendation.service';
import { WeatherService } from '../weather/weather.service';
import { CreateOutfitDto } from './dto/create-outfit.dto';
import { RecommendOutfitDto } from './dto/recommend-outfit.dto';
import { AnalyzeOutfitDto } from './dto/analyze-outfit.dto';

@Injectable()
export class OutfitsService {
  constructor(
    @InjectRepository(Outfit)
    private readonly outfitRepository: Repository<Outfit>,
    @InjectRepository(OutfitCalendar)
    private readonly calendarRepository: Repository<OutfitCalendar>,
    private readonly wardrobeService: WardrobeService,
    private readonly recommendationService: RecommendationService,
    private readonly weatherService: WeatherService,
  ) {}

  async recommend(
    userId: string,
    recommendDto: RecommendOutfitDto,
  ): Promise<{ outfits: Outfit[]; weather?: any }> {
    const { occasion, city, date } = recommendDto;

    // Get weather data
    let weather = null;
    if (city) {
      weather = await this.weatherService.getCurrentWeather(city);
    }

    // Get user's wardrobe items
    const { items: wardrobeItems } = await this.wardrobeService.findAll(userId, {
      limit: 1000,
    });

    if (wardrobeItems.length === 0) {
      return { outfits: [], weather };
    }

    // Generate recommendations
    const recommendations = await this.recommendationService.generateOutfits(
      wardrobeItems,
      {
        occasion,
        weather,
        count: 3,
      },
    );

    // Create outfit entities
    const outfits = await Promise.all(
      recommendations.map(async (rec) => {
        const outfit = this.outfitRepository.create({
          userId,
          items: rec.items,
          occasion,
          overallScore: rec.score,
          aiFeedback: rec.feedback,
          weatherData: weather
            ? {
                temperature: weather.temperature,
                feelsLike: weather.feelsLike,
                condition: weather.description,
                humidity: weather.humidity,
              }
            : null,
        });
        return outfit;
      }),
    );

    return { outfits, weather };
  }

  async analyze(
    userId: string,
    analyzeDto: AnalyzeOutfitDto,
  ): Promise<{
    outfit: Outfit;
    detectedItems: any[];
    suggestions: string[];
  }> {
    const { imageUrl, occasion, itemIds } = analyzeDto;

    // Get the items being worn (either from IDs or detect from image)
    let items: OutfitItem[] = [];
    let detectedItems = [];

    if (itemIds && itemIds.length > 0) {
      const wardrobeItems = await this.wardrobeService.getItemsByIds(userId, itemIds);
      items = wardrobeItems.map((item) => ({
        itemId: item.id,
        position: item.category,
      }));
      detectedItems = wardrobeItems;
    }

    // Score the outfit
    const analysis = await this.recommendationService.scoreOutfit(
      detectedItems,
      occasion,
    );

    const outfit = this.outfitRepository.create({
      userId,
      items,
      outfitImageUrl: imageUrl,
      occasion,
      overallScore: analysis.overallScore,
      aiFeedback: analysis.feedback,
    });

    return {
      outfit,
      detectedItems,
      suggestions: analysis.feedback.suggestions,
    };
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const [outfits, total] = await this.outfitRepository.findAndCount({
      where: { userId, isSaved: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      outfits,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: string, outfitId: string): Promise<Outfit> {
    const outfit = await this.outfitRepository.findOne({
      where: { id: outfitId, userId },
    });

    if (!outfit) {
      throw new NotFoundException('Outfit not found');
    }

    return outfit;
  }

  async save(userId: string, createDto: CreateOutfitDto): Promise<Outfit> {
    const outfit = this.outfitRepository.create({
      userId,
      ...createDto,
      isSaved: true,
    });
    return this.outfitRepository.save(outfit);
  }

  async delete(userId: string, outfitId: string): Promise<void> {
    const result = await this.outfitRepository.delete({ id: outfitId, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Outfit not found');
    }
  }

  async markAsWorn(userId: string, outfitId: string, date?: Date): Promise<Outfit> {
    const outfit = await this.findOne(userId, outfitId);
    outfit.wornDate = date || new Date();

    // Update wardrobe items wear count
    for (const item of outfit.items) {
      await this.wardrobeService.markAsWorn(userId, item.itemId);
    }

    return this.outfitRepository.save(outfit);
  }

  async rate(userId: string, outfitId: string, rating: number): Promise<Outfit> {
    const outfit = await this.findOne(userId, outfitId);
    outfit.userRating = rating;
    return this.outfitRepository.save(outfit);
  }

  // Calendar methods
  async getCalendar(userId: string, startDate: Date, endDate: Date) {
    return this.calendarRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate),
      },
      relations: ['outfit'],
      order: { date: 'ASC' },
    });
  }

  async planOutfit(
    userId: string,
    date: Date,
    outfitId: string,
    occasion?: string,
  ): Promise<OutfitCalendar> {
    // Check if already exists
    let calendar = await this.calendarRepository.findOne({
      where: { userId, date },
    });

    if (calendar) {
      calendar.outfitId = outfitId;
      calendar.occasion = occasion;
    } else {
      calendar = this.calendarRepository.create({
        userId,
        outfitId,
        date,
        occasion,
      });
    }

    return this.calendarRepository.save(calendar);
  }

  async removeFromCalendar(userId: string, date: Date): Promise<void> {
    await this.calendarRepository.delete({ userId, date });
  }
}
