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
exports.User = exports.SubscriptionTier = exports.TemperatureUnit = void 0;
const typeorm_1 = require("typeorm");
const wardrobe_item_entity_1 = require("./wardrobe-item.entity");
const outfit_entity_1 = require("./outfit.entity");
const style_profile_entity_1 = require("./style-profile.entity");
const subscription_entity_1 = require("./subscription.entity");
const chat_message_entity_1 = require("./chat-message.entity");
var TemperatureUnit;
(function (TemperatureUnit) {
    TemperatureUnit["FAHRENHEIT"] = "fahrenheit";
    TemperatureUnit["CELSIUS"] = "celsius";
})(TemperatureUnit || (exports.TemperatureUnit = TemperatureUnit = {}));
var SubscriptionTier;
(function (SubscriptionTier) {
    SubscriptionTier["FREE"] = "free";
    SubscriptionTier["PREMIUM"] = "premium";
    SubscriptionTier["PREMIUM_PLUS"] = "premium_plus";
})(SubscriptionTier || (exports.SubscriptionTier = SubscriptionTier = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'avatar_url', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'temperature_unit',
        type: 'enum',
        enum: TemperatureUnit,
        default: TemperatureUnit.FAHRENHEIT,
    }),
    __metadata("design:type", String)
], User.prototype, "temperatureUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'subscription_tier',
        type: 'enum',
        enum: SubscriptionTier,
        default: SubscriptionTier.FREE,
    }),
    __metadata("design:type", String)
], User.prototype, "subscriptionTier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subscription_expires_at', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "subscriptionExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'google_id', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'apple_id', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "appleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_verified', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refresh_token', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => wardrobe_item_entity_1.WardrobeItem, (item) => item.user),
    __metadata("design:type", Array)
], User.prototype, "wardrobeItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => outfit_entity_1.Outfit, (outfit) => outfit.user),
    __metadata("design:type", Array)
], User.prototype, "outfits", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => style_profile_entity_1.StyleProfile, (profile) => profile.user),
    __metadata("design:type", style_profile_entity_1.StyleProfile)
], User.prototype, "styleProfile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => subscription_entity_1.Subscription, (subscription) => subscription.user),
    __metadata("design:type", Array)
], User.prototype, "subscriptions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_message_entity_1.ChatMessage, (message) => message.user),
    __metadata("design:type", Array)
], User.prototype, "chatMessages", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map