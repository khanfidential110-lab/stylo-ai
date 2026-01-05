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
exports.UpdateStyleProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateStyleProfileDto {
}
exports.UpdateStyleProfileDto = UpdateStyleProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['casual', 'minimalist', 'streetwear'], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStyleProfileDto.prototype, "styleTags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['black', 'navy', 'white'], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStyleProfileDto.prototype, "preferredColors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['neon', 'bright yellow'], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStyleProfileDto.prototype, "avoidedColors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, minimum: 1, maximum: 10, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdateStyleProfileDto.prototype, "formalityPreference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Nike', 'Zara', 'H&M'], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStyleProfileDto.prototype, "preferredBrands", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'athletic', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStyleProfileDto.prototype, "bodyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5\'10"', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStyleProfileDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'slim fit', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStyleProfileDto.prototype, "preferredFit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Chris Hemsworth', 'Ryan Gosling'], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStyleProfileDto.prototype, "styleInspirations", void 0);
//# sourceMappingURL=update-style-profile.dto.js.map