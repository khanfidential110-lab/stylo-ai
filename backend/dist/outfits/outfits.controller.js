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
exports.OutfitsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const outfits_service_1 = require("./outfits.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../database/entities/user.entity");
const create_outfit_dto_1 = require("./dto/create-outfit.dto");
const recommend_outfit_dto_1 = require("./dto/recommend-outfit.dto");
const analyze_outfit_dto_1 = require("./dto/analyze-outfit.dto");
const rate_outfit_dto_1 = require("./dto/rate-outfit.dto");
const plan_outfit_dto_1 = require("./dto/plan-outfit.dto");
const calendar_query_dto_1 = require("./dto/calendar-query.dto");
let OutfitsController = class OutfitsController {
    constructor(outfitsService) {
        this.outfitsService = outfitsService;
    }
    async recommend(user, recommendDto) {
        return this.outfitsService.recommend(user.id, recommendDto);
    }
    async analyze(user, analyzeDto) {
        return this.outfitsService.analyze(user.id, analyzeDto);
    }
    async findAll(user, page, limit) {
        return this.outfitsService.findAll(user.id, page, limit);
    }
    async findOne(user, id) {
        return this.outfitsService.findOne(user.id, id);
    }
    async save(user, createDto) {
        return this.outfitsService.save(user.id, createDto);
    }
    async delete(user, id) {
        await this.outfitsService.delete(user.id, id);
        return { message: 'Outfit deleted successfully' };
    }
    async markAsWorn(user, id, date) {
        return this.outfitsService.markAsWorn(user.id, id, date);
    }
    async rate(user, id, rateDto) {
        return this.outfitsService.rate(user.id, id, rateDto.rating);
    }
    async getCalendar(user, query) {
        return this.outfitsService.getCalendar(user.id, query.startDate, query.endDate);
    }
    async planOutfit(user, planDto) {
        return this.outfitsService.planOutfit(user.id, planDto.date, planDto.outfitId, planDto.occasion);
    }
    async removeFromCalendar(user, date) {
        await this.outfitsService.removeFromCalendar(user.id, new Date(date));
        return { message: 'Removed from calendar' };
    }
};
exports.OutfitsController = OutfitsController;
__decorate([
    (0, common_1.Post)('recommend'),
    (0, swagger_1.ApiOperation)({ summary: 'Get AI outfit recommendations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns outfit recommendations' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        recommend_outfit_dto_1.RecommendOutfitDto]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "recommend", null);
__decorate([
    (0, common_1.Post)('analyze'),
    (0, swagger_1.ApiOperation)({ summary: 'Analyze an outfit from photo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns outfit analysis' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        analyze_outfit_dto_1.AnalyzeOutfitDto]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "analyze", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get saved outfits' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns saved outfits' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number, Number]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single outfit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns outfit' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Save an outfit' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Outfit saved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, create_outfit_dto_1.CreateOutfitDto]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "save", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a saved outfit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Outfit deleted' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/wear'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark outfit as worn' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Outfit marked as worn' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Date]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "markAsWorn", null);
__decorate([
    (0, common_1.Post)(':id/rate'),
    (0, swagger_1.ApiOperation)({ summary: 'Rate an outfit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Outfit rated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, rate_outfit_dto_1.RateOutfitDto]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "rate", null);
__decorate([
    (0, common_1.Get)('calendar'),
    (0, swagger_1.ApiOperation)({ summary: 'Get outfit calendar' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns calendar entries' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        calendar_query_dto_1.CalendarQueryDto]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "getCalendar", null);
__decorate([
    (0, common_1.Post)('calendar'),
    (0, swagger_1.ApiOperation)({ summary: 'Plan outfit for a date' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Outfit planned' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        plan_outfit_dto_1.PlanOutfitDto]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "planOutfit", null);
__decorate([
    (0, common_1.Delete)('calendar/:date'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove outfit from calendar' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Calendar entry removed' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], OutfitsController.prototype, "removeFromCalendar", null);
exports.OutfitsController = OutfitsController = __decorate([
    (0, swagger_1.ApiTags)('outfits'),
    (0, common_1.Controller)('outfits'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [outfits_service_1.OutfitsService])
], OutfitsController);
//# sourceMappingURL=outfits.controller.js.map