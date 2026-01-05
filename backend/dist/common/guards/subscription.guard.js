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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const user_entity_1 = require("../../database/entities/user.entity");
const required_tier_decorator_1 = require("../decorators/required-tier.decorator");
let SubscriptionGuard = class SubscriptionGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredTier = this.reflector.getAllAndOverride(required_tier_decorator_1.REQUIRED_TIER_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredTier) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const tierHierarchy = {
            [user_entity_1.SubscriptionTier.FREE]: 0,
            [user_entity_1.SubscriptionTier.PREMIUM]: 1,
            [user_entity_1.SubscriptionTier.PREMIUM_PLUS]: 2,
        };
        const userTierLevel = tierHierarchy[user.subscriptionTier] || 0;
        const requiredTierLevel = tierHierarchy[requiredTier] || 0;
        if (userTierLevel < requiredTierLevel) {
            throw new common_1.ForbiddenException(`This feature requires ${requiredTier} subscription`);
        }
        return true;
    }
};
exports.SubscriptionGuard = SubscriptionGuard;
exports.SubscriptionGuard = SubscriptionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], SubscriptionGuard);
//# sourceMappingURL=subscription.guard.js.map