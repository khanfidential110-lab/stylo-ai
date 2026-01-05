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
exports.WardrobeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const wardrobe_item_entity_1 = require("../database/entities/wardrobe-item.entity");
const user_entity_1 = require("../database/entities/user.entity");
const ai_service_1 = require("./ai.service");
let WardrobeService = class WardrobeService {
    constructor(wardrobeRepository, userRepository, aiService, configService) {
        this.wardrobeRepository = wardrobeRepository;
        this.userRepository = userRepository;
        this.aiService = aiService;
        this.configService = configService;
    }
    async create(userId, createDto, imageUrl) {
        await this.checkItemLimit(userId);
        const aiAnalysis = await this.aiService.analyzeClothingImage(imageUrl);
        const item = this.wardrobeRepository.create({
            userId,
            originalImageUrl: imageUrl,
            processedImageUrl: aiAnalysis.processedImageUrl,
            thumbnailUrl: aiAnalysis.thumbnailUrl,
            name: createDto.name || aiAnalysis.suggestedName,
            category: createDto.category || aiAnalysis.category,
            subcategory: createDto.subcategory || aiAnalysis.subcategory,
            primaryColor: aiAnalysis.primaryColor,
            primaryColorHex: aiAnalysis.primaryColorHex,
            secondaryColors: aiAnalysis.secondaryColors,
            pattern: aiAnalysis.pattern,
            material: createDto.material || aiAnalysis.material,
            season: createDto.season || aiAnalysis.season,
            occasions: createDto.occasions || aiAnalysis.occasions,
            formalityScore: aiAnalysis.formalityScore,
            brand: createDto.brand,
            size: createDto.size,
            price: createDto.price,
            tags: createDto.tags || [],
            aiMetadata: aiAnalysis.metadata,
        });
        return this.wardrobeRepository.save(item);
    }
    async findAll(userId, query) {
        const { category, color, season, occasion, brand, minFormality, maxFormality, isFavorite, search, sortBy = 'createdAt', sortOrder = 'DESC', page = 1, limit = 20, } = query;
        const queryBuilder = this.wardrobeRepository
            .createQueryBuilder('item')
            .where('item.userId = :userId', { userId });
        if (category) {
            queryBuilder.andWhere('item.category = :category', { category });
        }
        if (color) {
            queryBuilder.andWhere('(item.primaryColor ILIKE :color OR item.secondaryColors::text ILIKE :color)', { color: `%${color}%` });
        }
        if (season) {
            queryBuilder.andWhere(':season = ANY(item.season)', { season });
        }
        if (occasion) {
            queryBuilder.andWhere(':occasion = ANY(item.occasions)', { occasion });
        }
        if (brand) {
            queryBuilder.andWhere('item.brand ILIKE :brand', { brand: `%${brand}%` });
        }
        if (minFormality !== undefined) {
            queryBuilder.andWhere('item.formalityScore >= :minFormality', { minFormality });
        }
        if (maxFormality !== undefined) {
            queryBuilder.andWhere('item.formalityScore <= :maxFormality', { maxFormality });
        }
        if (isFavorite !== undefined) {
            queryBuilder.andWhere('item.isFavorite = :isFavorite', { isFavorite });
        }
        if (search) {
            queryBuilder.andWhere('(item.name ILIKE :search OR item.brand ILIKE :search OR item.tags::text ILIKE :search)', { search: `%${search}%` });
        }
        const validSortFields = ['createdAt', 'timesWorn', 'lastWornAt', 'price', 'name'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        queryBuilder.orderBy(`item.${sortField}`, sortOrder === 'ASC' ? 'ASC' : 'DESC');
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        const [items, total] = await queryBuilder.getManyAndCount();
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(userId, itemId) {
        const item = await this.wardrobeRepository.findOne({
            where: { id: itemId, userId },
        });
        if (!item) {
            throw new common_1.NotFoundException('Wardrobe item not found');
        }
        return item;
    }
    async update(userId, itemId, updateDto) {
        const item = await this.findOne(userId, itemId);
        Object.assign(item, updateDto);
        return this.wardrobeRepository.save(item);
    }
    async delete(userId, itemId) {
        const result = await this.wardrobeRepository.delete({ id: itemId, userId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Wardrobe item not found');
        }
    }
    async toggleFavorite(userId, itemId) {
        const item = await this.findOne(userId, itemId);
        item.isFavorite = !item.isFavorite;
        return this.wardrobeRepository.save(item);
    }
    async markAsWorn(userId, itemId) {
        const item = await this.findOne(userId, itemId);
        item.timesWorn += 1;
        item.lastWornAt = new Date();
        return this.wardrobeRepository.save(item);
    }
    async getStatistics(userId) {
        const items = await this.wardrobeRepository.find({ where: { userId } });
        const categoryCount = {};
        items.forEach((item) => {
            categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
        });
        const colorCount = {};
        items.forEach((item) => {
            if (item.primaryColor) {
                colorCount[item.primaryColor] = (colorCount[item.primaryColor] || 0) + 1;
            }
        });
        const sortedByWear = [...items].sort((a, b) => b.timesWorn - a.timesWorn);
        const mostWorn = sortedByWear.slice(0, 10);
        const leastWorn = sortedByWear.slice(-10).reverse();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const unworn30Days = items.filter((item) => !item.lastWornAt || item.lastWornAt < thirtyDaysAgo).length;
        const unworn60Days = items.filter((item) => !item.lastWornAt || item.lastWornAt < sixtyDaysAgo).length;
        const unworn90Days = items.filter((item) => !item.lastWornAt || item.lastWornAt < ninetyDaysAgo).length;
        const totalValue = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
        const costPerWear = items
            .filter((item) => item.price && item.timesWorn > 0)
            .map((item) => ({
            id: item.id,
            name: item.name,
            costPerWear: Number(item.price) / item.timesWorn,
        }))
            .sort((a, b) => a.costPerWear - b.costPerWear);
        return {
            totalItems: items.length,
            categoryDistribution: categoryCount,
            colorDistribution: colorCount,
            mostWorn: mostWorn.map((i) => ({ id: i.id, name: i.name, timesWorn: i.timesWorn })),
            leastWorn: leastWorn.map((i) => ({ id: i.id, name: i.name, timesWorn: i.timesWorn })),
            unwornStats: {
                last30Days: unworn30Days,
                last60Days: unworn60Days,
                last90Days: unworn90Days,
            },
            totalValue,
            topCostPerWear: costPerWear.slice(0, 10),
            worstCostPerWear: costPerWear.slice(-10).reverse(),
        };
    }
    async bulkCreate(userId, items) {
        const createdItems = [];
        for (const item of items) {
            try {
                const created = await this.create(userId, item.data, item.imageUrl);
                createdItems.push(created);
            }
            catch (error) {
                console.error(`Failed to create item: ${error.message}`);
            }
        }
        return createdItems;
    }
    async getItemsByIds(userId, itemIds) {
        return this.wardrobeRepository.find({
            where: { id: (0, typeorm_2.In)(itemIds), userId },
        });
    }
    async getItemsForWeather(userId, temperature, conditions) {
        let seasons = [];
        if (temperature < 45) {
            seasons = [wardrobe_item_entity_1.Season.WINTER, wardrobe_item_entity_1.Season.ALL_SEASON];
        }
        else if (temperature < 60) {
            seasons = [wardrobe_item_entity_1.Season.FALL, wardrobe_item_entity_1.Season.SPRING, wardrobe_item_entity_1.Season.ALL_SEASON];
        }
        else if (temperature < 75) {
            seasons = [wardrobe_item_entity_1.Season.SPRING, wardrobe_item_entity_1.Season.FALL, wardrobe_item_entity_1.Season.ALL_SEASON];
        }
        else {
            seasons = [wardrobe_item_entity_1.Season.SUMMER, wardrobe_item_entity_1.Season.ALL_SEASON];
        }
        const items = await this.wardrobeRepository
            .createQueryBuilder('item')
            .where('item.userId = :userId', { userId })
            .andWhere('item.season && :seasons', { seasons })
            .getMany();
        return items;
    }
    async checkItemLimit(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const limits = this.configService.get('limits');
        const tierLimits = limits[user.subscriptionTier];
        if (tierLimits.wardrobeItems === -1) {
            return;
        }
        const currentCount = await this.wardrobeRepository.count({ where: { userId } });
        if (currentCount >= tierLimits.wardrobeItems) {
            throw new common_1.ForbiddenException(`You have reached the limit of ${tierLimits.wardrobeItems} items. Upgrade to add more.`);
        }
    }
};
exports.WardrobeService = WardrobeService;
exports.WardrobeService = WardrobeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wardrobe_item_entity_1.WardrobeItem)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        ai_service_1.AiService,
        config_1.ConfigService])
], WardrobeService);
//# sourceMappingURL=wardrobe.service.js.map