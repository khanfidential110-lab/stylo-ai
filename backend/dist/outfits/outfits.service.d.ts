import { Repository } from 'typeorm';
import { Outfit } from '../database/entities/outfit.entity';
import { OutfitCalendar } from '../database/entities/outfit-calendar.entity';
import { WardrobeService } from '../wardrobe/wardrobe.service';
import { RecommendationService } from './recommendation.service';
import { WeatherService } from '../weather/weather.service';
import { CreateOutfitDto } from './dto/create-outfit.dto';
import { RecommendOutfitDto } from './dto/recommend-outfit.dto';
import { AnalyzeOutfitDto } from './dto/analyze-outfit.dto';
export declare class OutfitsService {
    private readonly outfitRepository;
    private readonly calendarRepository;
    private readonly wardrobeService;
    private readonly recommendationService;
    private readonly weatherService;
    constructor(outfitRepository: Repository<Outfit>, calendarRepository: Repository<OutfitCalendar>, wardrobeService: WardrobeService, recommendationService: RecommendationService, weatherService: WeatherService);
    recommend(userId: string, recommendDto: RecommendOutfitDto): Promise<{
        outfits: Outfit[];
        weather?: any;
    }>;
    analyze(userId: string, analyzeDto: AnalyzeOutfitDto): Promise<{
        outfit: Outfit;
        detectedItems: any[];
        suggestions: string[];
    }>;
    findAll(userId: string, page?: number, limit?: number): Promise<{
        outfits: Outfit[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(userId: string, outfitId: string): Promise<Outfit>;
    save(userId: string, createDto: CreateOutfitDto): Promise<Outfit>;
    delete(userId: string, outfitId: string): Promise<void>;
    markAsWorn(userId: string, outfitId: string, date?: Date): Promise<Outfit>;
    rate(userId: string, outfitId: string, rating: number): Promise<Outfit>;
    getCalendar(userId: string, startDate: Date, endDate: Date): Promise<OutfitCalendar[]>;
    planOutfit(userId: string, date: Date, outfitId: string, occasion?: string): Promise<OutfitCalendar>;
    removeFromCalendar(userId: string, date: Date): Promise<void>;
}
