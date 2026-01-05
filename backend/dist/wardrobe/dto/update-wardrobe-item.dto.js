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
exports.UpdateWardrobeItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const wardrobe_item_entity_1 = require("../../database/entities/wardrobe-item.entity");
class UpdateWardrobeItemDto {
}
exports.UpdateWardrobeItemDto = UpdateWardrobeItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Navy Blue T-Shirt', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWardrobeItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: wardrobe_item_entity_1.ClothingCategory, required: false }),
    (0, class_validator_1.IsEnum)(wardrobe_item_entity_1.ClothingCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWardrobeItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 't-shirt', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWardrobeItemDto.prototype, "subcategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'blue', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWardrobeItemDto.prototype, "primaryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: wardrobe_item_entity_1.Pattern, required: false }),
    (0, class_validator_1.IsEnum)(wardrobe_item_entity_1.Pattern),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWardrobeItemDto.prototype, "pattern", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cotton', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWardrobeItemDto.prototype, "material", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: wardrobe_item_entity_1.Season, isArray: true, required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(wardrobe_item_entity_1.Season, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateWardrobeItemDto.prototype, "season", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['casual', 'work'], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateWardrobeItemDto.prototype, "occasions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, minimum: 1, maximum: 10, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdateWardrobeItemDto.prototype, "formalityScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nike', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWardrobeItemDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'M', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateWardrobeItemDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 49.99, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateWardrobeItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateWardrobeItemDto.prototype, "isFavorite", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['favorite', 'summer'], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateWardrobeItemDto.prototype, "tags", void 0);
//# sourceMappingURL=update-wardrobe-item.dto.js.map