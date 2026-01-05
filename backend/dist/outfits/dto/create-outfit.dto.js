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
exports.CreateOutfitDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class OutfitItemDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-item' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OutfitItemDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'top' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OutfitItemDto.prototype, "position", void 0);
class CreateOutfitDto {
}
exports.CreateOutfitDto = CreateOutfitDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Casual Friday Look', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOutfitDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [OutfitItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OutfitItemDto),
    __metadata("design:type", Array)
], CreateOutfitDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'work', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOutfitDto.prototype, "occasion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOutfitDto.prototype, "notes", void 0);
//# sourceMappingURL=create-outfit.dto.js.map