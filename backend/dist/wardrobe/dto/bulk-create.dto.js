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
exports.BulkCreateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_wardrobe_item_dto_1 = require("./create-wardrobe-item.dto");
class BulkItemDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://cdn.stylo-ai.com/wardrobe/item.jpg' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkItemDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_wardrobe_item_dto_1.CreateWardrobeItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", create_wardrobe_item_dto_1.CreateWardrobeItemDto)
], BulkItemDto.prototype, "data", void 0);
class BulkCreateDto {
}
exports.BulkCreateDto = BulkCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [BulkItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BulkItemDto),
    __metadata("design:type", Array)
], BulkCreateDto.prototype, "items", void 0);
//# sourceMappingURL=bulk-create.dto.js.map