import { SetMetadata } from '@nestjs/common';
import { SubscriptionTier } from '../../database/entities/user.entity';

export const REQUIRED_TIER_KEY = 'requiredTier';
export const RequiredTier = (tier: SubscriptionTier) =>
  SetMetadata(REQUIRED_TIER_KEY, tier);
