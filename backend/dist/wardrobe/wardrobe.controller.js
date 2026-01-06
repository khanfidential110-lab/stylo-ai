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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WardrobeController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const wardrobe_service_1 = require("./wardrobe.service");
const outfit_detection_service_1 = require("./outfit-detection.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../database/entities/user.entity");
const create_wardrobe_item_dto_1 = require("./dto/create-wardrobe-item.dto");
const update_wardrobe_item_dto_1 = require("./dto/update-wardrobe-item.dto");
const query_wardrobe_dto_1 = require("./dto/query-wardrobe.dto");
const bulk_create_dto_1 = require("./dto/bulk-create.dto");
const detect_items_dto_1 = require("./dto/detect-items.dto");
let WardrobeController = class WardrobeController {
    constructor(wardrobeService, outfitDetectionService) {
        this.wardrobeService = wardrobeService;
        this.outfitDetectionService = outfitDetectionService;
    }
    async findAll(user, query) {
        return this.wardrobeService.findAll(user.id, query);
    }
    async getStatistics(user) {
        return this.wardrobeService.getStatistics(user.id);
    }
    async findOne(user, id) {
        return this.wardrobeService.findOne(user.id, id);
    }
    async create(user, file, createDto) {
        const imageUrl = `https://cdn.stylo-ai.com/wardrobe/${user.id}/original/${file?.filename || 'temp.jpg'}`;
        return this.wardrobeService.create(user.id, createDto, imageUrl);
    }
    async bulkCreate(user, bulkDto) {
        return this.wardrobeService.bulkCreate(user.id, bulkDto.items);
    }
    async update(user, id, updateDto) {
        return this.wardrobeService.update(user.id, id, updateDto);
    }
    async delete(user, id) {
        await this.wardrobeService.delete(user.id, id);
        return { message: 'Item deleted successfully' };
    }
    async toggleFavorite(user, id) {
        return this.wardrobeService.toggleFavorite(user.id, id);
    }
    async markAsWorn(user, id) {
        return this.wardrobeService.markAsWorn(user.id, id);
    }
    async detectItems(user, detectDto) {
        const result = await this.outfitDetectionService.detectItemsFromPhoto(detectDto.imageUrl);
        if (detectDto.autoSave && result.detectedItems.length > 0) {
            const savedItems = await this.wardrobeService.bulkCreate(user.id, result.detectedItems.map((item) => ({
                imageUrl: item.croppedImageUrl || detectDto.imageUrl,
                data: {
                    name: item.suggestedName,
                    category: item.category,
                    subcategory: item.subcategory,
                },
            })));
            return { ...result, savedItems };
        }
        return result;
    }
    async detectFromImage(user, file, detectDto) {
        if (!file) {
            throw new Error('No image file provided');
        }
        const imageUrl = `https://cdn.stylo-ai.com/uploads/${file.filename}`;
        const result = await this.outfitDetectionService.detectItemsFromPhoto(imageUrl);
        if (detectDto.autoSave && result.detectedItems.length > 0) {
            const savedItems = await this.wardrobeService.bulkCreate(user.id, result.detectedItems.map((item) => ({
                imageUrl: item.croppedImageUrl || imageUrl,
                data: {
                    name: item.suggestedName,
                    category: item.category,
                    subcategory: item.subcategory,
                },
            })));
            return { ...result, savedItems };
        }
        return result;
    }
    async saveDetectedItems(user, saveDto) {
        const selectedItems = saveDto.items.filter((item) => item.selected !== false);
        const savedItems = await this.wardrobeService.bulkCreate(user.id, selectedItems.map((item) => ({
            imageUrl: item.croppedImageUrl || saveDto.originalImageUrl,
            data: {
                name: item.suggestedName,
                category: item.category,
                subcategory: item.subcategory,
            },
        })));
        return {
            message: `${savedItems.length} items saved to wardrobe`,
            items: savedItems,
        };
    }
    async analyzeFromImage(user, file) {
        if (!file) {
            throw new Error('No image file provided');
        }
        const imageUrl = `https://cdn.stylo-ai.com/uploads/${file.filename}`;
        return this.wardrobeService.analyzeClothing(imageUrl);
    }
};
exports.WardrobeController = WardrobeController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all wardrobe items with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns paginated wardrobe items' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, query_wardrobe_dto_1.QueryWardrobeDto]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wardrobe statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns wardrobe analytics' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single wardrobe item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns wardrobe item' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new wardrobe item' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item created' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Item limit reached' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object, create_wardrobe_item_dto_1.CreateWardrobeItemDto]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk upload wardrobe items' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Items created' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, bulk_create_dto_1.BulkCreateDto]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a wardrobe item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, update_wardrobe_item_dto_1.UpdateWardrobeItemDto]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a wardrobe item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/favorite'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle favorite status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Favorite toggled' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "toggleFavorite", null);
__decorate([
    (0, common_1.Post)(':id/wear'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark item as worn' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item marked as worn' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "markAsWorn", null);
__decorate([
    (0, common_1.Post)('detect'),
    (0, swagger_1.ApiOperation)({ summary: 'Detect clothing items from a full-body photo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns detected items' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        detect_items_dto_1.DetectItemsDto]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "detectItems", null);
__decorate([
    (0, common_1.Post)('detect/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Detect clothing items from an uploaded photo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns detected items' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object, detect_items_dto_1.DetectItemsDto]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "detectFromImage", null);
__decorate([
    (0, common_1.Post)('detect/save'),
    (0, swagger_1.ApiOperation)({ summary: 'Save selected detected items to wardrobe' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Items saved to wardrobe' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        detect_items_dto_1.SaveDetectedItemsDto]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "saveDetectedItems", null);
__decorate([
    (0, common_1.Post)('analyze/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Analyze clothing item from an uploaded photo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns analysis result' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], WardrobeController.prototype, "analyzeFromImage", null);
exports.WardrobeController = WardrobeController = __decorate([
    (0, swagger_1.ApiTags)('wardrobe'),
    (0, common_1.Controller)('wardrobe'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [wardrobe_service_1.WardrobeService,
        outfit_detection_service_1.OutfitDetectionService])
], WardrobeController);
//# sourceMappingURL=wardrobe.controller.js.map