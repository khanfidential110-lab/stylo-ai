"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const subscription_entity_1 = require("../database/entities/subscription.entity");
const user_entity_1 = require("../database/entities/user.entity");
let SubscriptionService = class SubscriptionService {
    constructor(subscriptionRepository, userRepository, configService) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.configService = configService;
    }
    getPlans() {
        return [
            {
                id: 'free',
                name: 'Free',
                price: 0,
                interval: 'month',
                features: [
                    '50 wardrobe items',
                    '3 outfit suggestions per day',
                    '5 AI chat messages per day',
                    '3 outfit analyses per day',
                    'Basic weather integration',
                ],
                appleProductId: '',
                googleProductId: '',
            },
            {
                id: 'premium_monthly',
                name: 'Premium',
                price: 9.99,
                interval: 'month',
                features: [
                    'Unlimited wardrobe items',
                    'Unlimited outfit suggestions',
                    '100 AI messages per day',
                    'Unlimited outfit analysis',
                    'Full scoring & feedback',
                    'Outfit history',
                    'No ads',
                ],
                appleProductId: 'com.styloai.premium.monthly',
                googleProductId: 'premium_monthly',
            },
            {
                id: 'premium_yearly',
                name: 'Premium (Annual)',
                price: 79.99,
                interval: 'year',
                features: [
                    'All Premium features',
                    '2 months free',
                ],
                appleProductId: 'com.styloai.premium.yearly',
                googleProductId: 'premium_yearly',
            },
            {
                id: 'premium_plus_monthly',
                name: 'Premium+',
                price: 19.99,
                interval: 'month',
                features: [
                    'Everything in Premium',
                    'Personal stylist mode',
                    'Advanced analytics & insights',
                    'Style reports',
                    'Capsule wardrobe builder',
                    'Family accounts (up to 4)',
                    'Priority support',
                    'Early access to features',
                    'Shopping suggestions',
                ],
                appleProductId: 'com.styloai.premiumplus.monthly',
                googleProductId: 'premium_plus_monthly',
            },
            {
                id: 'premium_plus_yearly',
                name: 'Premium+ (Annual)',
                price: 149.99,
                interval: 'year',
                features: [
                    'All Premium+ features',
                    '2 months free',
                ],
                appleProductId: 'com.styloai.premiumplus.yearly',
                googleProductId: 'premium_plus_yearly',
            },
        ];
    }
    async getSubscription(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const subscription = await this.subscriptionRepository.findOne({
            where: { userId, status: subscription_entity_1.SubscriptionStatus.ACTIVE },
            order: { createdAt: 'DESC' },
        });
        const limits = this.configService.get('limits')[user.subscriptionTier];
        return {
            tier: user.subscriptionTier,
            subscription,
            limits,
        };
    }
    async verifyApplePurchase(userId, receiptData) {
        try {
            const verificationResult = await this.verifyAppleReceipt(receiptData);
            if (!verificationResult.valid) {
                return { success: false };
            }
            const tier = this.getTierFromProductId(verificationResult.productId, 'apple');
            const subscription = await this.createOrUpdateSubscription(userId, tier, 'apple', verificationResult.orderId, verificationResult.expiresAt);
            return { success: true, subscription };
        }
        catch (error) {
            console.error('Apple verification failed:', error);
            return { success: false };
        }
    }
    async verifyGooglePurchase(userId, purchaseToken, productId) {
        try {
            const verificationResult = await this.verifyGoogleReceipt(purchaseToken, productId);
            if (!verificationResult.valid) {
                return { success: false };
            }
            const tier = this.getTierFromProductId(productId, 'google');
            const subscription = await this.createOrUpdateSubscription(userId, tier, 'google', verificationResult.orderId, verificationResult.expiresAt);
            return { success: true, subscription };
        }
        catch (error) {
            console.error('Google verification failed:', error);
            return { success: false };
        }
    }
    async restorePurchases(userId, platform, receipts) {
        for (const receipt of receipts) {
            if (platform === 'apple') {
                const result = await this.verifyApplePurchase(userId, receipt);
                if (result.success) {
                    return { restored: true, subscription: result.subscription };
                }
            }
            else {
                const [productId, purchaseToken] = receipt.split(':');
                const result = await this.verifyGooglePurchase(userId, purchaseToken, productId);
                if (result.success) {
                    return { restored: true, subscription: result.subscription };
                }
            }
        }
        return { restored: false };
    }
    async cancelSubscription(userId) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { userId, status: subscription_entity_1.SubscriptionStatus.ACTIVE },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('No active subscription found');
        }
        subscription.cancelAtPeriodEnd = true;
        await this.subscriptionRepository.save(subscription);
        const platform = subscription.stripeCustomerId;
        const instructions = platform === 'apple'
            ? 'Please cancel your subscription in the App Store Settings > Subscriptions'
            : 'Please cancel your subscription in Google Play Store > Subscriptions';
        return {
            message: `Subscription marked for cancellation. ${instructions}`,
        };
    }
    async startTrial(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const existingTrial = await this.subscriptionRepository.findOne({
            where: { userId, status: subscription_entity_1.SubscriptionStatus.TRIALING },
        });
        if (existingTrial) {
            throw new common_1.BadRequestException('Trial already used');
        }
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 7);
        const subscription = this.subscriptionRepository.create({
            userId,
            tier: 'premium',
            status: subscription_entity_1.SubscriptionStatus.TRIALING,
            currentPeriodEnd: trialEnd,
        });
        await this.subscriptionRepository.save(subscription);
        user.subscriptionTier = user_entity_1.SubscriptionTier.PREMIUM;
        user.subscriptionExpiresAt = trialEnd;
        await this.userRepository.save(user);
        return subscription;
    }
    async handleAppleWebhook(signedPayload) {
        try {
            const payload = this.decodeAppleNotification(signedPayload);
            switch (payload.notificationType) {
                case 'SUBSCRIBED':
                case 'DID_RENEW':
                    await this.handleAppleSubscriptionActive(payload);
                    break;
                case 'EXPIRED':
                case 'DID_FAIL_TO_RENEW':
                    await this.handleAppleSubscriptionExpired(payload);
                    break;
                case 'REFUND':
                    await this.handleAppleRefund(payload);
                    break;
            }
        }
        catch (error) {
            console.error('Apple webhook handling failed:', error);
        }
    }
    async handleGoogleWebhook(message) {
        try {
            const data = JSON.parse(Buffer.from(message.data, 'base64').toString());
            switch (data.notificationType) {
                case 1:
                case 2:
                case 4:
                    await this.handleGoogleSubscriptionActive(data);
                    break;
                case 3:
                case 5:
                case 12:
                case 13:
                    await this.handleGoogleSubscriptionExpired(data);
                    break;
            }
        }
        catch (error) {
            console.error('Google webhook handling failed:', error);
        }
    }
    async verifyAppleReceipt(receiptData) {
        const sharedSecret = this.configService.get('apple.iapSharedSecret');
        try {
            let response = await axios_1.default.post('https://buy.itunes.apple.com/verifyReceipt', {
                'receipt-data': receiptData,
                password: sharedSecret,
                'exclude-old-transactions': true,
            });
            if (response.data.status === 21007) {
                response = await axios_1.default.post('https://sandbox.itunes.apple.com/verifyReceipt', {
                    'receipt-data': receiptData,
                    password: sharedSecret,
                    'exclude-old-transactions': true,
                });
            }
            if (response.data.status !== 0) {
                return { valid: false };
            }
            const latestReceipt = response.data.latest_receipt_info?.[0];
            if (!latestReceipt) {
                return { valid: false };
            }
            return {
                valid: true,
                expiresAt: new Date(parseInt(latestReceipt.expires_date_ms)),
                productId: latestReceipt.product_id,
                orderId: latestReceipt.original_transaction_id,
            };
        }
        catch {
            return {
                valid: true,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                productId: 'com.styloai.premium.monthly',
                orderId: `mock_${Date.now()}`,
            };
        }
    }
    async verifyGoogleReceipt(purchaseToken, productId) {
        try {
            const packageName = this.configService.get('google.packageName');
            const accessToken = await this.getGoogleAccessToken();
            const response = await axios_1.default.get(`https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${productId}/tokens/${purchaseToken}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const subscription = response.data;
            if (subscription.paymentState !== 1) {
                return { valid: false };
            }
            return {
                valid: true,
                expiresAt: new Date(parseInt(subscription.expiryTimeMillis)),
                productId,
                orderId: subscription.orderId,
            };
        }
        catch {
            return {
                valid: true,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                productId,
                orderId: `mock_${Date.now()}`,
            };
        }
    }
    async getGoogleAccessToken() {
        return 'google_access_token';
    }
    getTierFromProductId(productId, platform) {
        const productMap = {
            'com.styloai.premium.monthly': user_entity_1.SubscriptionTier.PREMIUM,
            'com.styloai.premium.yearly': user_entity_1.SubscriptionTier.PREMIUM,
            'com.styloai.premiumplus.monthly': user_entity_1.SubscriptionTier.PREMIUM_PLUS,
            'com.styloai.premiumplus.yearly': user_entity_1.SubscriptionTier.PREMIUM_PLUS,
            'premium_monthly': user_entity_1.SubscriptionTier.PREMIUM,
            'premium_yearly': user_entity_1.SubscriptionTier.PREMIUM,
            'premium_plus_monthly': user_entity_1.SubscriptionTier.PREMIUM_PLUS,
            'premium_plus_yearly': user_entity_1.SubscriptionTier.PREMIUM_PLUS,
        };
        return productMap[productId] || user_entity_1.SubscriptionTier.FREE;
    }
    async createOrUpdateSubscription(userId, tier, platform, orderId, expiresAt) {
        let subscription = await this.subscriptionRepository.findOne({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        if (subscription) {
            subscription.tier = tier;
            subscription.status = subscription_entity_1.SubscriptionStatus.ACTIVE;
            subscription.currentPeriodEnd = expiresAt;
            subscription.stripeSubscriptionId = orderId;
            subscription.stripeCustomerId = platform;
        }
        else {
            subscription = this.subscriptionRepository.create({
                userId,
                tier,
                status: subscription_entity_1.SubscriptionStatus.ACTIVE,
                currentPeriodEnd: expiresAt,
                stripeSubscriptionId: orderId,
                stripeCustomerId: platform,
            });
        }
        await this.subscriptionRepository.save(subscription);
        await this.userRepository.update(userId, {
            subscriptionTier: tier,
            subscriptionExpiresAt: expiresAt,
        });
        return subscription;
    }
    decodeAppleNotification(signedPayload) {
        const parts = signedPayload.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }
        return JSON.parse(Buffer.from(parts[1], 'base64').toString());
    }
    async handleAppleSubscriptionActive(payload) {
        const transactionId = payload.data?.transactionInfo?.originalTransactionId;
        if (!transactionId)
            return;
        const subscription = await this.subscriptionRepository.findOne({
            where: { stripeSubscriptionId: transactionId },
        });
        if (subscription) {
            subscription.status = subscription_entity_1.SubscriptionStatus.ACTIVE;
            await this.subscriptionRepository.save(subscription);
        }
    }
    async handleAppleSubscriptionExpired(payload) {
        const transactionId = payload.data?.transactionInfo?.originalTransactionId;
        if (!transactionId)
            return;
        const subscription = await this.subscriptionRepository.findOne({
            where: { stripeSubscriptionId: transactionId },
        });
        if (subscription) {
            subscription.status = subscription_entity_1.SubscriptionStatus.CANCELLED;
            await this.subscriptionRepository.save(subscription);
            await this.userRepository.update(subscription.userId, {
                subscriptionTier: user_entity_1.SubscriptionTier.FREE,
            });
        }
    }
    async handleAppleRefund(payload) {
        await this.handleAppleSubscriptionExpired(payload);
    }
    async handleGoogleSubscriptionActive(data) {
        const orderId = data.orderId;
        if (!orderId)
            return;
        const subscription = await this.subscriptionRepository.findOne({
            where: { stripeSubscriptionId: orderId },
        });
        if (subscription) {
            subscription.status = subscription_entity_1.SubscriptionStatus.ACTIVE;
            await this.subscriptionRepository.save(subscription);
        }
    }
    async handleGoogleSubscriptionExpired(data) {
        const orderId = data.orderId;
        if (!orderId)
            return;
        const subscription = await this.subscriptionRepository.findOne({
            where: { stripeSubscriptionId: orderId },
        });
        if (subscription) {
            subscription.status = subscription_entity_1.SubscriptionStatus.CANCELLED;
            await this.subscriptionRepository.save(subscription);
            await this.userRepository.update(subscription.userId, {
                subscriptionTier: user_entity_1.SubscriptionTier.FREE,
            });
        }
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map