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
exports.StyleProfile = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let StyleProfile = class StyleProfile {
};
exports.StyleProfile = StyleProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StyleProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], StyleProfile.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.styleProfile, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], StyleProfile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'style_tags', type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], StyleProfile.prototype, "styleTags", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'preferred_colors', type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], StyleProfile.prototype, "preferredColors", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'avoided_colors', type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], StyleProfile.prototype, "avoidedColors", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'formality_preference', nullable: true }),
    __metadata("design:type", Number)
], StyleProfile.prototype, "formalityPreference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'preferred_brands', type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], StyleProfile.prototype, "preferredBrands", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'body_type', nullable: true }),
    __metadata("design:type", String)
], StyleProfile.prototype, "bodyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StyleProfile.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'preferred_fit', nullable: true }),
    __metadata("design:type", String)
], StyleProfile.prototype, "preferredFit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'style_inspirations', type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], StyleProfile.prototype, "styleInspirations", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'occasions_priority', type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], StyleProfile.prototype, "occasionsPriority", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StyleProfile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StyleProfile.prototype, "updatedAt", void 0);
exports.StyleProfile = StyleProfile = __decorate([
    (0, typeorm_1.Entity)('style_profiles')
], StyleProfile);
//# sourceMappingURL=style-profile.entity.js.map