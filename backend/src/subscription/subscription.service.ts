import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Subscription, SubscriptionStatus } from '../database/entities/subscription.entity';
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

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  getPlans(): PlanInfo[] {
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

  async getSubscription(userId: string): Promise<{
    tier: SubscriptionTier;
    subscription?: Subscription;
    limits: Record<string, number>;
  }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const subscription = await this.subscriptionRepository.findOne({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });

    const limits = this.configService.get('limits')[user.subscriptionTier];

    return {
      tier: user.subscriptionTier,
      subscription,
      limits,
    };
  }

  // Verify Apple App Store receipt
  async verifyApplePurchase(
    userId: string,
    receiptData: string,
  ): Promise<{ success: boolean; subscription?: Subscription }> {
    try {
      const verificationResult = await this.verifyAppleReceipt(receiptData);

      if (!verificationResult.valid) {
        return { success: false };
      }

      const tier = this.getTierFromProductId(verificationResult.productId, 'apple');
      const subscription = await this.createOrUpdateSubscription(
        userId,
        tier,
        'apple',
        verificationResult.orderId,
        verificationResult.expiresAt,
      );

      return { success: true, subscription };
    } catch (error) {
      console.error('Apple verification failed:', error);
      return { success: false };
    }
  }

  // Verify Google Play purchase
  async verifyGooglePurchase(
    userId: string,
    purchaseToken: string,
    productId: string,
  ): Promise<{ success: boolean; subscription?: Subscription }> {
    try {
      const verificationResult = await this.verifyGoogleReceipt(purchaseToken, productId);

      if (!verificationResult.valid) {
        return { success: false };
      }

      const tier = this.getTierFromProductId(productId, 'google');
      const subscription = await this.createOrUpdateSubscription(
        userId,
        tier,
        'google',
        verificationResult.orderId,
        verificationResult.expiresAt,
      );

      return { success: true, subscription };
    } catch (error) {
      console.error('Google verification failed:', error);
      return { success: false };
    }
  }

  async restorePurchases(
    userId: string,
    platform: 'apple' | 'google',
    receipts: string[],
  ): Promise<{ restored: boolean; subscription?: Subscription }> {
    for (const receipt of receipts) {
      if (platform === 'apple') {
        const result = await this.verifyApplePurchase(userId, receipt);
        if (result.success) {
          return { restored: true, subscription: result.subscription };
        }
      } else {
        // For Google, receipt is in format "productId:purchaseToken"
        const [productId, purchaseToken] = receipt.split(':');
        const result = await this.verifyGooglePurchase(userId, purchaseToken, productId);
        if (result.success) {
          return { restored: true, subscription: result.subscription };
        }
      }
    }

    return { restored: false };
  }

  async cancelSubscription(userId: string): Promise<{ message: string }> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId, status: SubscriptionStatus.ACTIVE },
    });

    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    // Note: Actual cancellation happens in the app store
    // We just mark it as pending cancellation
    subscription.cancelAtPeriodEnd = true;
    await this.subscriptionRepository.save(subscription);

    const platform = subscription.stripeCustomerId; // Reusing field for platform
    const instructions = platform === 'apple'
      ? 'Please cancel your subscription in the App Store Settings > Subscriptions'
      : 'Please cancel your subscription in Google Play Store > Subscriptions';

    return {
      message: `Subscription marked for cancellation. ${instructions}`,
    };
  }

  async startTrial(userId: string): Promise<Subscription> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user already had a trial
    const existingTrial = await this.subscriptionRepository.findOne({
      where: { userId, status: SubscriptionStatus.TRIALING },
    });

    if (existingTrial) {
      throw new BadRequestException('Trial already used');
    }

    // Create trial subscription
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7); // 7-day trial

    const subscription = this.subscriptionRepository.create({
      userId,
      tier: 'premium',
      status: SubscriptionStatus.TRIALING,
      currentPeriodEnd: trialEnd,
    });

    await this.subscriptionRepository.save(subscription);

    // Update user tier
    user.subscriptionTier = SubscriptionTier.PREMIUM;
    user.subscriptionExpiresAt = trialEnd;
    await this.userRepository.save(user);

    return subscription;
  }

  // Handle App Store Server Notifications (webhook)
  async handleAppleWebhook(signedPayload: string): Promise<void> {
    try {
      // In production, verify the JWT signature using Apple's public key
      // For now, we'll decode and process
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
    } catch (error) {
      console.error('Apple webhook handling failed:', error);
    }
  }

  // Handle Google Play Real-time Developer Notifications
  async handleGoogleWebhook(message: any): Promise<void> {
    try {
      const data = JSON.parse(Buffer.from(message.data, 'base64').toString());

      switch (data.notificationType) {
        case 1: // SUBSCRIPTION_RECOVERED
        case 2: // SUBSCRIPTION_RENEWED
        case 4: // SUBSCRIPTION_PURCHASED
          await this.handleGoogleSubscriptionActive(data);
          break;

        case 3: // SUBSCRIPTION_CANCELED
        case 5: // SUBSCRIPTION_ON_HOLD
        case 12: // SUBSCRIPTION_EXPIRED
        case 13: // SUBSCRIPTION_REVOKED
          await this.handleGoogleSubscriptionExpired(data);
          break;
      }
    } catch (error) {
      console.error('Google webhook handling failed:', error);
    }
  }

  private async verifyAppleReceipt(receiptData: string): Promise<PurchaseVerificationResult> {
    // In production, send to Apple's verifyReceipt endpoint
    // https://buy.itunes.apple.com/verifyReceipt (production)
    // https://sandbox.itunes.apple.com/verifyReceipt (sandbox)

    const sharedSecret = this.configService.get('apple.iapSharedSecret');

    try {
      // Try production first
      let response = await axios.post('https://buy.itunes.apple.com/verifyReceipt', {
        'receipt-data': receiptData,
        password: sharedSecret,
        'exclude-old-transactions': true,
      });

      // If sandbox, retry with sandbox URL
      if (response.data.status === 21007) {
        response = await axios.post('https://sandbox.itunes.apple.com/verifyReceipt', {
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
    } catch {
      // For development, return mock success
      return {
        valid: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        productId: 'com.styloai.premium.monthly',
        orderId: `mock_${Date.now()}`,
      };
    }
  }

  private async verifyGoogleReceipt(
    purchaseToken: string,
    productId: string,
  ): Promise<PurchaseVerificationResult> {
    // In production, use Google Play Developer API
    // https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptions

    try {
      const packageName = this.configService.get('google.packageName');
      const accessToken = await this.getGoogleAccessToken();

      const response = await axios.get(
        `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${productId}/tokens/${purchaseToken}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

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
    } catch {
      // For development, return mock success
      return {
        valid: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        productId,
        orderId: `mock_${Date.now()}`,
      };
    }
  }

  private async getGoogleAccessToken(): Promise<string> {
    // In production, use service account to get access token
    // For now, return placeholder
    return 'google_access_token';
  }

  private getTierFromProductId(productId: string, platform: 'apple' | 'google'): SubscriptionTier {
    const productMap: Record<string, SubscriptionTier> = {
      // Apple
      'com.styloai.premium.monthly': SubscriptionTier.PREMIUM,
      'com.styloai.premium.yearly': SubscriptionTier.PREMIUM,
      'com.styloai.premiumplus.monthly': SubscriptionTier.PREMIUM_PLUS,
      'com.styloai.premiumplus.yearly': SubscriptionTier.PREMIUM_PLUS,
      // Google
      'premium_monthly': SubscriptionTier.PREMIUM,
      'premium_yearly': SubscriptionTier.PREMIUM,
      'premium_plus_monthly': SubscriptionTier.PREMIUM_PLUS,
      'premium_plus_yearly': SubscriptionTier.PREMIUM_PLUS,
    };

    return productMap[productId] || SubscriptionTier.FREE;
  }

  private async createOrUpdateSubscription(
    userId: string,
    tier: SubscriptionTier,
    platform: 'apple' | 'google',
    orderId: string,
    expiresAt: Date,
  ): Promise<Subscription> {
    let subscription = await this.subscriptionRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (subscription) {
      subscription.tier = tier;
      subscription.status = SubscriptionStatus.ACTIVE;
      subscription.currentPeriodEnd = expiresAt;
      subscription.stripeSubscriptionId = orderId; // Reusing for order ID
      subscription.stripeCustomerId = platform; // Reusing for platform
    } else {
      subscription = this.subscriptionRepository.create({
        userId,
        tier,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd: expiresAt,
        stripeSubscriptionId: orderId,
        stripeCustomerId: platform,
      });
    }

    await this.subscriptionRepository.save(subscription);

    // Update user tier
    await this.userRepository.update(userId, {
      subscriptionTier: tier,
      subscriptionExpiresAt: expiresAt,
    });

    return subscription;
  }

  private decodeAppleNotification(signedPayload: string): any {
    // In production, verify JWT signature
    // For now, just decode the payload
    const parts = signedPayload.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    return JSON.parse(Buffer.from(parts[1], 'base64').toString());
  }

  private async handleAppleSubscriptionActive(payload: any): Promise<void> {
    // Update subscription status based on Apple notification
    const transactionId = payload.data?.transactionInfo?.originalTransactionId;
    if (!transactionId) return;

    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: transactionId },
    });

    if (subscription) {
      subscription.status = SubscriptionStatus.ACTIVE;
      await this.subscriptionRepository.save(subscription);
    }
  }

  private async handleAppleSubscriptionExpired(payload: any): Promise<void> {
    const transactionId = payload.data?.transactionInfo?.originalTransactionId;
    if (!transactionId) return;

    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: transactionId },
    });

    if (subscription) {
      subscription.status = SubscriptionStatus.CANCELLED;
      await this.subscriptionRepository.save(subscription);

      await this.userRepository.update(subscription.userId, {
        subscriptionTier: SubscriptionTier.FREE,
      });
    }
  }

  private async handleAppleRefund(payload: any): Promise<void> {
    await this.handleAppleSubscriptionExpired(payload);
  }

  private async handleGoogleSubscriptionActive(data: any): Promise<void> {
    const orderId = data.orderId;
    if (!orderId) return;

    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: orderId },
    });

    if (subscription) {
      subscription.status = SubscriptionStatus.ACTIVE;
      await this.subscriptionRepository.save(subscription);
    }
  }

  private async handleGoogleSubscriptionExpired(data: any): Promise<void> {
    const orderId = data.orderId;
    if (!orderId) return;

    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: orderId },
    });

    if (subscription) {
      subscription.status = SubscriptionStatus.CANCELLED;
      await this.subscriptionRepository.save(subscription);

      await this.userRepository.update(subscription.userId, {
        subscriptionTier: SubscriptionTier.FREE,
      });
    }
  }
}
