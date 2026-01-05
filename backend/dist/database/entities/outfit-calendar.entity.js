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
exports.OutfitCalendar = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const outfit_entity_1 = require("./outfit.entity");
let OutfitCalendar = class OutfitCalendar {
};
exports.OutfitCalendar = OutfitCalendar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OutfitCalendar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], OutfitCalendar.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], OutfitCalendar.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'outfit_id' }),
    __metadata("design:type", String)
], OutfitCalendar.prototype, "outfitId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => outfit_entity_1.Outfit, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'outfit_id' }),
    __metadata("design:type", outfit_entity_1.Outfit)
], OutfitCalendar.prototype, "outfit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], OutfitCalendar.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OutfitCalendar.prototype, "occasion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'weather_data', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], OutfitCalendar.prototype, "weatherData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], OutfitCalendar.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], OutfitCalendar.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], OutfitCalendar.prototype, "updatedAt", void 0);
exports.OutfitCalendar = OutfitCalendar = __decorate([
    (0, typeorm_1.Entity)('outfit_calendar'),
    (0, typeorm_1.Unique)(['userId', 'date'])
], OutfitCalendar);
//# sourceMappingURL=outfit-calendar.entity.js.map