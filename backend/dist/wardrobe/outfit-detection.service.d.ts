import { ConfigService } from '@nestjs/config';
import { ClothingCategory, Pattern } from '../database/entities/wardrobe-item.entity';
export interface DetectedItem {
    category: ClothingCategory;
    subcategory: string;
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    confidence: number;
    primaryColor: string;
    primaryColorHex: string;
    pattern: Pattern;
    material?: string;
    croppedImageUrl?: string;
    suggestedName: string;
}
export interface OutfitDetectionResult {
    originalImageUrl: string;
    detectedItems: DetectedItem[];
    personDetected: boolean;
    fullBodyVisible: boolean;
}
export declare class OutfitDetectionService {
    private readonly configService;
    private readonly openrouterKey;
    private readonly groqKey;
    constructor(configService: ConfigService);
    detectItemsFromPhoto(imageUrl: string): Promise<OutfitDetectionResult>;
    private analyzeWithVisionAPI;
    private parseDetectionResponse;
    private normalizeDetectedItem;
    private getPattern;
    private getColorHex;
    private capitalize;
    private getMockDetection;
    private getMockDetectedItems;
    cropItemFromImage(originalImageUrl: string, boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): Promise<string>;
}
