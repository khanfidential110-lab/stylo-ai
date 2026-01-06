import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { WardrobeItem } from '../database/entities/wardrobe-item.entity';
import { User } from '../database/entities/user.entity';
import { CreateWardrobeItemDto } from './dto/create-wardrobe-item.dto';
import { UpdateWardrobeItemDto } from './dto/update-wardrobe-item.dto';
import { QueryWardrobeDto } from './dto/query-wardrobe.dto';
import { AiService } from './ai.service';
export declare class WardrobeService {
    private readonly wardrobeRepository;
    private readonly userRepository;
    private readonly aiService;
    private readonly configService;
    constructor(wardrobeRepository: Repository<WardrobeItem>, userRepository: Repository<User>, aiService: AiService, configService: ConfigService);
    create(userId: string, createDto: CreateWardrobeItemDto, imageUrl: string): Promise<WardrobeItem>;
    analyzeClothing(imageUrl: string): Promise<import("./ai.service").ClothingAnalysis>;
    findAll(userId: string, query: QueryWardrobeDto): Promise<{
        items: WardrobeItem[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(userId: string, itemId: string): Promise<WardrobeItem>;
    update(userId: string, itemId: string, updateDto: UpdateWardrobeItemDto): Promise<WardrobeItem>;
    delete(userId: string, itemId: string): Promise<void>;
    toggleFavorite(userId: string, itemId: string): Promise<WardrobeItem>;
    markAsWorn(userId: string, itemId: string): Promise<WardrobeItem>;
    getStatistics(userId: string): Promise<{
        totalItems: number;
        categoryDistribution: Record<string, number>;
        colorDistribution: Record<string, number>;
        mostWorn: {
            id: string;
            name: string;
            timesWorn: number;
        }[];
        leastWorn: {
            id: string;
            name: string;
            timesWorn: number;
        }[];
        unwornStats: {
            last30Days: number;
            last60Days: number;
            last90Days: number;
        };
        totalValue: number;
        topCostPerWear: {
            id: string;
            name: string;
            costPerWear: number;
        }[];
        worstCostPerWear: {
            id: string;
            name: string;
            costPerWear: number;
        }[];
    }>;
    bulkCreate(userId: string, items: {
        imageUrl: string;
        data?: Partial<CreateWardrobeItemDto>;
    }[]): Promise<WardrobeItem[]>;
    getItemsByIds(userId: string, itemIds: string[]): Promise<WardrobeItem[]>;
    getItemsForWeather(userId: string, temperature: number, conditions: string): Promise<WardrobeItem[]>;
    private checkItemLimit;
}
