import { User } from './user.entity';
import { Outfit } from './outfit.entity';
export declare class OutfitCalendar {
    id: string;
    userId: string;
    user: User;
    outfitId: string;
    outfit: Outfit;
    date: Date;
    occasion: string;
    weatherData: {
        temperature: number;
        feelsLike: number;
        condition: string;
        humidity: number;
        forecast?: string;
    };
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
