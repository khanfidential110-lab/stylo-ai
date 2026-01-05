import { User } from './user.entity';
export interface OutfitItem {
    itemId: string;
    position: string;
}
export interface OutfitFeedback {
    colorHarmony: {
        score: number;
        feedback: string;
    };
    styleCoherence: {
        score: number;
        feedback: string;
    };
    occasionFit: {
        score: number;
        feedback: string;
    };
    weatherSuitability: {
        score: number;
        feedback: string;
    };
    completeness: {
        score: number;
        feedback: string;
    };
    compliments: string[];
    suggestions: string[];
    alternatives: {
        itemId: string;
        reason: string;
        alternativeId?: string;
    }[];
    warnings: string[];
}
export declare class Outfit {
    id: string;
    userId: string;
    user: User;
    name: string;
    items: OutfitItem[];
    occasion: string;
    overallScore: number;
    aiFeedback: OutfitFeedback;
    outfitImageUrl: string;
    isSaved: boolean;
    wornDate: Date;
    userRating: number;
    notes: string;
    weatherData: {
        temperature: number;
        feelsLike: number;
        condition: string;
        humidity: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
