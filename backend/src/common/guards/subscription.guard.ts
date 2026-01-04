import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionTier } from '../../database/entities/user.entity';
import { REQUIRED_TIER_KEY } from '../decorators/required-tier.decorator';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredTier = this.reflector.getAllAndOverride<SubscriptionTier>(
      REQUIRED_TIER_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredTier) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const tierHierarchy = {
      [SubscriptionTier.FREE]: 0,
      [SubscriptionTier.PREMIUM]: 1,
      [SubscriptionTier.PREMIUM_PLUS]: 2,
    };

    const userTierLevel = tierHierarchy[user.subscriptionTier] || 0;
    const requiredTierLevel = tierHierarchy[requiredTier] || 0;

    if (userTierLevel < requiredTierLevel) {
      throw new ForbiddenException(
        `This feature requires ${requiredTier} subscription`,
      );
    }

    return true;
  }
}
