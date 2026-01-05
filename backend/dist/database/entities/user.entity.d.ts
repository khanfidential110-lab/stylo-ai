import { WardrobeItem } from './wardrobe-item.entity';
import { Outfit } from './outfit.entity';
import { StyleProfile } from './style-profile.entity';
import { Subscription } from './subscription.entity';
import { ChatMessage } from './chat-message.entity';
export declare enum TemperatureUnit {
    FAHRENHEIT = "fahrenheit",
    CELSIUS = "celsius"
}
export declare enum SubscriptionTier {
    FREE = "free",
    PREMIUM = "premium",
    PREMIUM_PLUS = "premium_plus"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    avatarUrl: string;
    city: string;
    timezone: string;
    temperatureUnit: TemperatureUnit;
    subscriptionTier: SubscriptionTier;
    subscriptionExpiresAt: Date;
    googleId: string;
    appleId: string;
    emailVerified: boolean;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    wardrobeItems: WardrobeItem[];
    outfits: Outfit[];
    styleProfile: StyleProfile;
    subscriptions: Subscription[];
    chatMessages: ChatMessage[];
}
