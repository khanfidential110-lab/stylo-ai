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
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const subscription_service_1 = require("./subscription.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const user_entity_1 = require("../database/entities/user.entity");
const verify_apple_purchase_dto_1 = require("./dto/verify-apple-purchase.dto");
const verify_google_purchase_dto_1 = require("./dto/verify-google-purchase.dto");
const restore_purchases_dto_1 = require("./dto/restore-purchases.dto");
let SubscriptionController = class SubscriptionController {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async getPlans() {
        return this.subscriptionService.getPlans();
    }
    async getSubscription(user) {
        return this.subscriptionService.getSubscription(user.id);
    }
    async verifyApplePurchase(user, dto) {
        return this.subscriptionService.verifyApplePurchase(user.id, dto.receiptData);
    }
    async verifyGooglePurchase(user, dto) {
        return this.subscriptionService.verifyGooglePurchase(user.id, dto.purchaseToken, dto.productId);
    }
    async restorePurchases(user, dto) {
        return this.subscriptionService.restorePurchases(user.id, dto.platform, dto.receipts);
    }
    async cancelSubscription(user) {
        return this.subscriptionService.cancelSubscription(user.id);
    }
    async startTrial(user) {
        return this.subscriptionService.startTrial(user.id);
    }
    async handleAppleWebhook(body) {
        return this.subscriptionService.handleAppleWebhook(body.signedPayload);
    }
    async handleGoogleWebhook(body) {
        return this.subscriptionService.handleGoogleWebhook(body.message);
    }
};
exports.SubscriptionController = SubscriptionController;
__decorate([
    (0, common_1.Get)('plans'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available subscription plans' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns subscription plans' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getPlans", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current subscription status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns subscription info' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getSubscription", null);
__decorate([
    (0, common_1.Post)('verify/apple'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Apple App Store purchase' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Purchase verified' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        verify_apple_purchase_dto_1.VerifyApplePurchaseDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "verifyApplePurchase", null);
__decorate([
    (0, common_1.Post)('verify/google'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Google Play purchase' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Purchase verified' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        verify_google_purchase_dto_1.VerifyGooglePurchaseDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "verifyGooglePurchase", null);
__decorate([
    (0, common_1.Post)('restore'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Restore purchases' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Purchases restored' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        restore_purchases_dto_1.RestorePurchasesDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "restorePurchases", null);
__decorate([
    (0, common_1.Post)('cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel subscription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription cancelled' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "cancelSubscription", null);
__decorate([
    (0, common_1.Post)('trial'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Start free trial' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Trial started' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "startTrial", null);
__decorate([
    (0, common_1.Post)('webhook/apple'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Apple App Store Server Notifications webhook' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "handleAppleWebhook", null);
__decorate([
    (0, common_1.Post)('webhook/google'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Google Play Real-time Developer Notifications webhook' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "handleGoogleWebhook", null);
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, swagger_1.ApiTags)('subscription'),
    (0, common_1.Controller)('subscription'),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService])
], SubscriptionController);
//# sourceMappingURL=subscription.controller.js.map