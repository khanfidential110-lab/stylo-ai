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
exports.AnalyzeOutfitDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AnalyzeOutfitDto {
}
exports.AnalyzeOutfitDto = AnalyzeOutfitDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://cdn.stylo-ai.com/outfit.jpg', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AnalyzeOutfitDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'date night', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AnalyzeOutfitDto.prototype, "occasion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['uuid-1', 'uuid-2'], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], AnalyzeOutfitDto.prototype, "itemIds", void 0);
//# sourceMappingURL=analyze-outfit.dto.js.map