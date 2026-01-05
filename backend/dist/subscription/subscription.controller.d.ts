import { SubscriptionService } from './subscription.service';
import { User } from '../database/entities/user.entity';
import { VerifyApplePurchaseDto } from './dto/verify-apple-purchase.dto';
import { VerifyGooglePurchaseDto } from './dto/verify-google-purchase.dto';
import { RestorePurchasesDto } from './dto/restore-purchases.dto';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    getPlans(): Promise<import("./subscription.service").PlanInfo[]>;
    getSubscription(user: User): Promise<{
        tier: import("../database/entities/user.entity").SubscriptionTier;
        subscription?: import("../database/entities").Subscription;
        limits: Record<string, number>;
    }>;
    verifyApplePurchase(user: User, dto: VerifyApplePurchaseDto): Promise<{
        success: boolean;
        subscription?: import("../database/entities").Subscription;
    }>;
    verifyGooglePurchase(user: User, dto: VerifyGooglePurchaseDto): Promise<{
        success: boolean;
        subscription?: import("../database/entities").Subscription;
    }>;
    restorePurchases(user: User, dto: RestorePurchasesDto): Promise<{
        restored: boolean;
        subscription?: import("../database/entities").Subscription;
    }>;
    cancelSubscription(user: User): Promise<{
        message: string;
    }>;
    startTrial(user: User): Promise<import("../database/entities").Subscription>;
    handleAppleWebhook(body: {
        signedPayload: string;
    }): Promise<void>;
    handleGoogleWebhook(body: {
        message: any;
    }): Promise<void>;
}
