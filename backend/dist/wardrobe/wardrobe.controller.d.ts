import { WardrobeService } from './wardrobe.service';
import { OutfitDetectionService } from './outfit-detection.service';
import { User } from '../database/entities/user.entity';
import { CreateWardrobeItemDto } from './dto/create-wardrobe-item.dto';
import { UpdateWardrobeItemDto } from './dto/update-wardrobe-item.dto';
import { QueryWardrobeDto } from './dto/query-wardrobe.dto';
import { BulkCreateDto } from './dto/bulk-create.dto';
import { DetectItemsDto, SaveDetectedItemsDto } from './dto/detect-items.dto';
export declare class WardrobeController {
    private readonly wardrobeService;
    private readonly outfitDetectionService;
    constructor(wardrobeService: WardrobeService, outfitDetectionService: OutfitDetectionService);
    findAll(user: User, query: QueryWardrobeDto): Promise<{
        items: import("../database/entities").WardrobeItem[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getStatistics(user: User): Promise<{
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
    findOne(user: User, id: string): Promise<import("../database/entities").WardrobeItem>;
    create(user: User, file: Express.Multer.File, createDto: CreateWardrobeItemDto): Promise<import("../database/entities").WardrobeItem>;
    bulkCreate(user: User, bulkDto: BulkCreateDto): Promise<import("../database/entities").WardrobeItem[]>;
    update(user: User, id: string, updateDto: UpdateWardrobeItemDto): Promise<import("../database/entities").WardrobeItem>;
    delete(user: User, id: string): Promise<{
        message: string;
    }>;
    toggleFavorite(user: User, id: string): Promise<import("../database/entities").WardrobeItem>;
    markAsWorn(user: User, id: string): Promise<import("../database/entities").WardrobeItem>;
    detectItems(user: User, detectDto: DetectItemsDto): Promise<import("./outfit-detection.service").OutfitDetectionResult | {
        savedItems: import("../database/entities").WardrobeItem[];
        originalImageUrl: string;
        detectedItems: import("./outfit-detection.service").DetectedItem[];
        personDetected: boolean;
        fullBodyVisible: boolean;
    }>;
    detectFromImage(user: User, file: Express.Multer.File, detectDto: DetectItemsDto): Promise<import("./outfit-detection.service").OutfitDetectionResult | {
        savedItems: import("../database/entities").WardrobeItem[];
        originalImageUrl: string;
        detectedItems: import("./outfit-detection.service").DetectedItem[];
        personDetected: boolean;
        fullBodyVisible: boolean;
    }>;
    saveDetectedItems(user: User, saveDto: SaveDetectedItemsDto): Promise<{
        message: string;
        items: import("../database/entities").WardrobeItem[];
    }>;
    analyzeFromImage(user: User, file: Express.Multer.File): Promise<import("./ai.service").ClothingAnalysis>;
}
