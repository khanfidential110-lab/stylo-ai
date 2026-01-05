import { WardrobeItem } from '../database/entities/wardrobe-item.entity';
import { OutfitItem, OutfitFeedback } from '../database/entities/outfit.entity';
interface RecommendationOptions {
    occasion?: string;
    weather?: {
        temperature: number;
        feelsLike: number;
        description: string;
        humidity: number;
    };
    count?: number;
}
interface OutfitRecommendation {
    items: OutfitItem[];
    score: number;
    feedback: OutfitFeedback;
}
export declare class RecommendationService {
    generateOutfits(wardrobeItems: WardrobeItem[], options: RecommendationOptions): Promise<OutfitRecommendation[]>;
    scoreOutfit(items: WardrobeItem[], occasion?: string): Promise<{
        overallScore: number;
        feedback: OutfitFeedback;
    }>;
    private groupByCategory;
    private filterByWeather;
    private filterByOccasion;
    private createOutfitCombination;
    private getItemsFromOutfit;
    private scoreOutfitItems;
    private scoreColorHarmony;
    private scoreStyleCoherence;
    private scoreOccasionFit;
    private scoreWeatherSuitability;
    private scoreCompleteness;
    private generateFeedback;
}
export {};
