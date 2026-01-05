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
exports.OutfitsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const outfit_entity_1 = require("../database/entities/outfit.entity");
const outfit_calendar_entity_1 = require("../database/entities/outfit-calendar.entity");
const wardrobe_service_1 = require("../wardrobe/wardrobe.service");
const recommendation_service_1 = require("./recommendation.service");
const weather_service_1 = require("../weather/weather.service");
let OutfitsService = class OutfitsService {
    constructor(outfitRepository, calendarRepository, wardrobeService, recommendationService, weatherService) {
        this.outfitRepository = outfitRepository;
        this.calendarRepository = calendarRepository;
        this.wardrobeService = wardrobeService;
        this.recommendationService = recommendationService;
        this.weatherService = weatherService;
    }
    async recommend(userId, recommendDto) {
        const { occasion, city, date } = recommendDto;
        let weather = null;
        if (city) {
            weather = await this.weatherService.getCurrentWeather(city);
        }
        const { items: wardrobeItems } = await this.wardrobeService.findAll(userId, {
            limit: 1000,
        });
        if (wardrobeItems.length === 0) {
            return { outfits: [], weather };
        }
        const recommendations = await this.recommendationService.generateOutfits(wardrobeItems, {
            occasion,
            weather,
            count: 3,
        });
        const outfits = await Promise.all(recommendations.map(async (rec) => {
            const outfit = this.outfitRepository.create({
                userId,
                items: rec.items,
                occasion,
                overallScore: rec.score,
                aiFeedback: rec.feedback,
                weatherData: weather
                    ? {
                        temperature: weather.temperature,
                        feelsLike: weather.feelsLike,
                        condition: weather.description,
                        humidity: weather.humidity,
                    }
                    : null,
            });
            return outfit;
        }));
        return { outfits, weather };
    }
    async analyze(userId, analyzeDto) {
        const { imageUrl, occasion, itemIds } = analyzeDto;
        let items = [];
        let detectedItems = [];
        if (itemIds && itemIds.length > 0) {
            const wardrobeItems = await this.wardrobeService.getItemsByIds(userId, itemIds);
            items = wardrobeItems.map((item) => ({
                itemId: item.id,
                position: item.category,
            }));
            detectedItems = wardrobeItems;
        }
        const analysis = await this.recommendationService.scoreOutfit(detectedItems, occasion);
        const outfit = this.outfitRepository.create({
            userId,
            items,
            outfitImageUrl: imageUrl,
            occasion,
            overallScore: analysis.overallScore,
            aiFeedback: analysis.feedback,
        });
        return {
            outfit,
            detectedItems,
            suggestions: analysis.feedback.suggestions,
        };
    }
    async findAll(userId, page = 1, limit = 20) {
        const [outfits, total] = await this.outfitRepository.findAndCount({
            where: { userId, isSaved: true },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            outfits,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(userId, outfitId) {
        const outfit = await this.outfitRepository.findOne({
            where: { id: outfitId, userId },
        });
        if (!outfit) {
            throw new common_1.NotFoundException('Outfit not found');
        }
        return outfit;
    }
    async save(userId, createDto) {
        const outfit = this.outfitRepository.create({
            userId,
            ...createDto,
            isSaved: true,
        });
        return this.outfitRepository.save(outfit);
    }
    async delete(userId, outfitId) {
        const result = await this.outfitRepository.delete({ id: outfitId, userId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Outfit not found');
        }
    }
    async markAsWorn(userId, outfitId, date) {
        const outfit = await this.findOne(userId, outfitId);
        outfit.wornDate = date || new Date();
        for (const item of outfit.items) {
            await this.wardrobeService.markAsWorn(userId, item.itemId);
        }
        return this.outfitRepository.save(outfit);
    }
    async rate(userId, outfitId, rating) {
        const outfit = await this.findOne(userId, outfitId);
        outfit.userRating = rating;
        return this.outfitRepository.save(outfit);
    }
    async getCalendar(userId, startDate, endDate) {
        return this.calendarRepository.find({
            where: {
                userId,
                date: (0, typeorm_2.Between)(startDate, endDate),
            },
            relations: ['outfit'],
            order: { date: 'ASC' },
        });
    }
    async planOutfit(userId, date, outfitId, occasion) {
        let calendar = await this.calendarRepository.findOne({
            where: { userId, date },
        });
        if (calendar) {
            calendar.outfitId = outfitId;
            calendar.occasion = occasion;
        }
        else {
            calendar = this.calendarRepository.create({
                userId,
                outfitId,
                date,
                occasion,
            });
        }
        return this.calendarRepository.save(calendar);
    }
    async removeFromCalendar(userId, date) {
        await this.calendarRepository.delete({ userId, date });
    }
};
exports.OutfitsService = OutfitsService;
exports.OutfitsService = OutfitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(outfit_entity_1.Outfit)),
    __param(1, (0, typeorm_1.InjectRepository)(outfit_calendar_entity_1.OutfitCalendar)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        wardrobe_service_1.WardrobeService,
        recommendation_service_1.RecommendationService,
        weather_service_1.WeatherService])
], OutfitsService);
//# sourceMappingURL=outfits.service.js.map