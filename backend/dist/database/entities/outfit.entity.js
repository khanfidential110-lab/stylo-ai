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
exports.Outfit = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let Outfit = class Outfit {
};
exports.Outfit = Outfit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Outfit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Outfit.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.outfits, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Outfit.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Outfit.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Array)
], Outfit.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Outfit.prototype, "occasion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'overall_score', nullable: true }),
    __metadata("design:type", Number)
], Outfit.prototype, "overallScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ai_feedback', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Outfit.prototype, "aiFeedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'outfit_image_url', nullable: true }),
    __metadata("design:type", String)
], Outfit.prototype, "outfitImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_saved', default: false }),
    __metadata("design:type", Boolean)
], Outfit.prototype, "isSaved", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'worn_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Outfit.prototype, "wornDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_rating', nullable: true }),
    __metadata("design:type", Number)
], Outfit.prototype, "userRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Outfit.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'weather_data', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Outfit.prototype, "weatherData", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Outfit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Outfit.prototype, "updatedAt", void 0);
exports.Outfit = Outfit = __decorate([
    (0, typeorm_1.Entity)('outfits')
], Outfit);
//# sourceMappingURL=outfit.entity.js.map