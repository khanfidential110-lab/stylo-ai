import { ConfigService } from '@nestjs/config';
import { ClothingCategory, Pattern, Season } from '../database/entities/wardrobe-item.entity';
export interface ClothingAnalysis {
    processedImageUrl: string;
    thumbnailUrl: string;
    suggestedName: string;
    category: ClothingCategory;
    subcategory: string;
    primaryColor: string;
    primaryColorHex: string;
    secondaryColors: {
        name: string;
        hex: string;
    }[];
    pattern: Pattern;
    material: string;
    season: Season[];
    occasions: string[];
    formalityScore: number;
    metadata: Record<string, any>;
}
export declare class AiService {
    private readonly configService;
    constructor(configService: ConfigService);
    analyzeClothingImage(imageUrl: string): Promise<ClothingAnalysis>;
    removeBackground(imageUrl: string): Promise<string>;
    generateThumbnail(imageUrl: string): Promise<string>;
    extractColors(imageUrl: string): Promise<{
        primary: {
            name: string;
            hex: string;
        };
        secondary: {
            name: string;
            hex: string;
        }[];
    }>;
    private detectCategory;
    private detectSubcategory;
    private detectColors;
    private detectPattern;
    private detectMaterial;
    private detectSeasons;
    private calculateFormality;
    private detectOccasions;
    private generateName;
}
