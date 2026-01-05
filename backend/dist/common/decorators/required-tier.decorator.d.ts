import { SubscriptionTier } from '../../database/entities/user.entity';
export declare const REQUIRED_TIER_KEY = "requiredTier";
export declare const RequiredTier: (tier: SubscriptionTier) => import("@nestjs/common").CustomDecorator<string>;
