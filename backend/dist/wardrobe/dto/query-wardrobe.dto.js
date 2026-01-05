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
exports.QueryWardrobeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const wardrobe_item_entity_1 = require("../../database/entities/wardrobe-item.entity");
class QueryWardrobeDto {
}
exports.QueryWardrobeDto = QueryWardrobeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: wardrobe_item_entity_1.ClothingCategory, required: false }),
    (0, class_validator_1.IsEnum)(wardrobe_item_entity_1.ClothingCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryWardrobeDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'blue', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryWardrobeDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: wardrobe_item_entity_1.Season, required: false }),
    (0, class_validator_1.IsEnum)(wardrobe_item_entity_1.Season),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryWardrobeDto.prototype, "season", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'casual', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryWardrobeDto.prototype, "occasion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nike', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryWardrobeDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, minimum: 1, maximum: 10, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], QueryWardrobeDto.prototype, "minFormality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, minimum: 1, maximum: 10, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], QueryWardrobeDto.prototype, "maxFormality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], QueryWardrobeDto.prototype, "isFavorite", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'blue shirt', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryWardrobeDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'createdAt',
        enum: ['createdAt', 'timesWorn', 'lastWornAt', 'price', 'name'],
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryWardrobeDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DESC', enum: ['ASC', 'DESC'], required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryWardrobeDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, minimum: 1, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryWardrobeDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20, minimum: 1, maximum: 100, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], QueryWardrobeDto.prototype, "limit", void 0);
//# sourceMappingURL=query-wardrobe.dto.js.map