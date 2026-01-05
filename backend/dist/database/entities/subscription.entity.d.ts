import { User } from './user.entity';
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    CANCELLED = "cancelled",
    PAST_DUE = "past_due",
    TRIALING = "trialing",
    PAUSED = "paused"
}
export declare class Subscription {
    id: string;
    userId: string;
    user: User;
    tier: string;
    status: SubscriptionStatus;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    createdAt: Date;
    updatedAt: Date;
}
