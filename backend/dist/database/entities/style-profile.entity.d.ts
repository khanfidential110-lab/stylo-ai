import { User } from './user.entity';
export declare class StyleProfile {
    id: string;
    userId: string;
    user: User;
    styleTags: string[];
    preferredColors: string[];
    avoidedColors: string[];
    formalityPreference: number;
    preferredBrands: string[];
    bodyType: string;
    height: string;
    preferredFit: string;
    styleInspirations: string[];
    occasionsPriority: {
        occasion: string;
        frequency: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
