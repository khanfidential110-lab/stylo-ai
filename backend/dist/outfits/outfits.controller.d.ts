import { OutfitsService } from './outfits.service';
import { User } from '../database/entities/user.entity';
import { CreateOutfitDto } from './dto/create-outfit.dto';
import { RecommendOutfitDto } from './dto/recommend-outfit.dto';
import { AnalyzeOutfitDto } from './dto/analyze-outfit.dto';
import { RateOutfitDto } from './dto/rate-outfit.dto';
import { PlanOutfitDto } from './dto/plan-outfit.dto';
import { CalendarQueryDto } from './dto/calendar-query.dto';
export declare class OutfitsController {
    private readonly outfitsService;
    constructor(outfitsService: OutfitsService);
    recommend(user: User, recommendDto: RecommendOutfitDto): Promise<{
        outfits: import("../database/entities").Outfit[];
        weather?: any;
    }>;
    analyze(user: User, analyzeDto: AnalyzeOutfitDto): Promise<{
        outfit: import("../database/entities").Outfit;
        detectedItems: any[];
        suggestions: string[];
    }>;
    findAll(user: User, page?: number, limit?: number): Promise<{
        outfits: import("../database/entities").Outfit[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(user: User, id: string): Promise<import("../database/entities").Outfit>;
    save(user: User, createDto: CreateOutfitDto): Promise<import("../database/entities").Outfit>;
    delete(user: User, id: string): Promise<{
        message: string;
    }>;
    markAsWorn(user: User, id: string, date?: Date): Promise<import("../database/entities").Outfit>;
    rate(user: User, id: string, rateDto: RateOutfitDto): Promise<import("../database/entities").Outfit>;
    getCalendar(user: User, query: CalendarQueryDto): Promise<import("../database/entities").OutfitCalendar[]>;
    planOutfit(user: User, planDto: PlanOutfitDto): Promise<import("../database/entities").OutfitCalendar>;
    removeFromCalendar(user: User, date: string): Promise<{
        message: string;
    }>;
}
