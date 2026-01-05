import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Subscription } from '../database/entities/subscription.entity';
import { User, SubscriptionTier } from '../database/entities/user.entity';
export interface PlanInfo {
    id: string;
    name: string;
    price: number;
    interval: 'month' | 'year';
    features: string[];
    appleProductId: string;
    googleProductId: string;
}
export interface PurchaseVerificationResult {
    valid: boolean;
    expiresAt?: Date;
    productId?: string;
    orderId?: string;
}
export declare class SubscriptionService {
    private readonly subscriptionRepository;
    private readonly userRepository;
    private readonly configService;
    constructor(subscriptionRepository: Repository<Subscription>, userRepository: Repository<User>, configService: ConfigService);
    getPlans(): PlanInfo[];
    getSubscription(userId: string): Promise<{
        tier: SubscriptionTier;
        subscription?: Subscription;
        limits: Record<string, number>;
    }>;
    verifyApplePurchase(userId: string, receiptData: string): Promise<{
        success: boolean;
        subscription?: Subscription;
    }>;
    verifyGooglePurchase(userId: string, purchaseToken: string, productId: string): Promise<{
        success: boolean;
        subscription?: Subscription;
    }>;
    restorePurchases(userId: string, platform: 'apple' | 'google', receipts: string[]): Promise<{
        restored: boolean;
        subscription?: Subscription;
    }>;
    cancelSubscription(userId: string): Promise<{
        message: string;
    }>;
    startTrial(userId: string): Promise<Subscription>;
    handleAppleWebhook(signedPayload: string): Promise<void>;
    handleGoogleWebhook(message: any): Promise<void>;
    private verifyAppleReceipt;
    private verifyGoogleReceipt;
    private getGoogleAccessToken;
    private getTierFromProductId;
    private createOrUpdateSubscription;
    private decodeAppleNotification;
    private handleAppleSubscriptionActive;
    private handleAppleSubscriptionExpired;
    private handleAppleRefund;
    private handleGoogleSubscriptionActive;
    private handleGoogleSubscriptionExpired;
}
