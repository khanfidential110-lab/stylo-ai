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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const wardrobe_item_entity_1 = require("../database/entities/wardrobe-item.entity");
const COLOR_MAP = {
    black: '#000000',
    white: '#FFFFFF',
    navy: '#000080',
    blue: '#0000FF',
    red: '#FF0000',
    green: '#008000',
    yellow: '#FFFF00',
    orange: '#FFA500',
    purple: '#800080',
    pink: '#FFC0CB',
    brown: '#8B4513',
    gray: '#808080',
    grey: '#808080',
    beige: '#F5F5DC',
    cream: '#FFFDD0',
    burgundy: '#800020',
    maroon: '#800000',
    olive: '#808000',
    teal: '#008080',
    coral: '#FF7F50',
    lavender: '#E6E6FA',
    mint: '#98FF98',
    gold: '#FFD700',
    silver: '#C0C0C0',
    tan: '#D2B48C',
    khaki: '#F0E68C',
    denim: '#1560BD',
    charcoal: '#36454F',
};
const SUBCATEGORIES = {
    [wardrobe_item_entity_1.ClothingCategory.TOPS]: [
        't-shirt', 'shirt', 'blouse', 'sweater', 'hoodie', 'tank top',
        'polo', 'cardigan', 'turtleneck', 'crop top', 'tunic',
    ],
    [wardrobe_item_entity_1.ClothingCategory.BOTTOMS]: [
        'jeans', 'pants', 'shorts', 'skirt', 'leggings', 'chinos',
        'trousers', 'joggers', 'cargo pants', 'dress pants',
    ],
    [wardrobe_item_entity_1.ClothingCategory.DRESSES]: [
        'casual dress', 'cocktail dress', 'maxi dress', 'midi dress',
        'mini dress', 'sundress', 'evening gown', 'wrap dress',
    ],
    [wardrobe_item_entity_1.ClothingCategory.OUTERWEAR]: [
        'jacket', 'coat', 'blazer', 'windbreaker', 'parka', 'vest',
        'cardigan', 'bomber jacket', 'leather jacket', 'denim jacket',
    ],
    [wardrobe_item_entity_1.ClothingCategory.FOOTWEAR]: [
        'sneakers', 'boots', 'sandals', 'loafers', 'heels', 'flats',
        'oxfords', 'running shoes', 'dress shoes', 'ankle boots',
    ],
    [wardrobe_item_entity_1.ClothingCategory.ACCESSORIES]: [
        'hat', 'scarf', 'belt', 'watch', 'jewelry', 'bag', 'sunglasses',
        'tie', 'gloves', 'wallet', 'backpack',
    ],
    [wardrobe_item_entity_1.ClothingCategory.ACTIVEWEAR]: [
        'sports bra', 'yoga pants', 'athletic shorts', 'gym tank',
        'compression wear', 'tracksuit', 'sports jacket',
    ],
    [wardrobe_item_entity_1.ClothingCategory.SWIMWEAR]: [
        'bikini', 'one-piece', 'swim trunks', 'board shorts', 'rash guard',
    ],
    [wardrobe_item_entity_1.ClothingCategory.SLEEPWEAR]: [
        'pajamas', 'nightgown', 'robe', 'sleep shorts', 'loungewear',
    ],
    [wardrobe_item_entity_1.ClothingCategory.FORMAL]: [
        'suit', 'tuxedo', 'formal dress', 'dress shirt', 'bow tie',
    ],
};
const OCCASION_MAP = {
    casual: ['casual', 'everyday', 'weekend', 'shopping', 'brunch'],
    smart_casual: ['work', 'business casual', 'dinner', 'date night'],
    formal: ['formal', 'meeting', 'interview', 'presentation', 'wedding'],
    active: ['gym', 'workout', 'sports', 'running', 'yoga', 'hiking'],
    party: ['party', 'night out', 'club', 'concert'],
};
let AiService = class AiService {
    constructor(configService) {
        this.configService = configService;
    }
    async analyzeClothingImage(imageUrl) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const category = this.detectCategory();
        const subcategory = this.detectSubcategory(category);
        const colors = this.detectColors();
        const pattern = this.detectPattern();
        const material = this.detectMaterial(category, subcategory);
        const seasons = this.detectSeasons(category, material);
        const formalityScore = this.calculateFormality(category, subcategory, material);
        const occasions = this.detectOccasions(formalityScore);
        return {
            processedImageUrl: imageUrl.replace('/original/', '/processed/'),
            thumbnailUrl: imageUrl.replace('/original/', '/thumbnails/'),
            suggestedName: this.generateName(colors.primary.name, subcategory),
            category,
            subcategory,
            primaryColor: colors.primary.name,
            primaryColorHex: colors.primary.hex,
            secondaryColors: colors.secondary,
            pattern,
            material,
            season: seasons,
            occasions,
            formalityScore,
            metadata: {
                confidence: 0.92,
                processingTime: 500,
                modelVersion: '1.0.0',
            },
        };
    }
    async removeBackground(imageUrl) {
        return imageUrl.replace('/original/', '/no-bg/');
    }
    async generateThumbnail(imageUrl) {
        return imageUrl.replace('/original/', '/thumbnails/');
    }
    async extractColors(imageUrl) {
        return this.detectColors();
    }
    detectCategory() {
        const categories = Object.values(wardrobe_item_entity_1.ClothingCategory);
        return categories[Math.floor(Math.random() * 6)];
    }
    detectSubcategory(category) {
        const subcategories = SUBCATEGORIES[category] || ['unknown'];
        return subcategories[Math.floor(Math.random() * subcategories.length)];
    }
    detectColors() {
        const colorNames = Object.keys(COLOR_MAP);
        const primaryColorName = colorNames[Math.floor(Math.random() * colorNames.length)];
        const secondaryColors = [];
        const numSecondary = Math.floor(Math.random() * 3);
        for (let i = 0; i < numSecondary; i++) {
            const name = colorNames[Math.floor(Math.random() * colorNames.length)];
            if (name !== primaryColorName) {
                secondaryColors.push({ name, hex: COLOR_MAP[name] });
            }
        }
        return {
            primary: { name: primaryColorName, hex: COLOR_MAP[primaryColorName] },
            secondary: secondaryColors,
        };
    }
    detectPattern() {
        const patterns = Object.values(wardrobe_item_entity_1.Pattern);
        if (Math.random() > 0.3) {
            return wardrobe_item_entity_1.Pattern.SOLID;
        }
        return patterns[Math.floor(Math.random() * patterns.length)];
    }
    detectMaterial(category, subcategory) {
        const materialMap = {
            't-shirt': ['cotton', 'polyester', 'cotton blend'],
            'jeans': ['denim'],
            'sweater': ['wool', 'cashmere', 'cotton', 'acrylic'],
            'jacket': ['leather', 'denim', 'nylon', 'polyester'],
            'dress': ['silk', 'polyester', 'cotton', 'linen'],
            'sneakers': ['leather', 'canvas', 'mesh'],
            default: ['cotton', 'polyester', 'blend'],
        };
        const materials = materialMap[subcategory] || materialMap.default;
        return materials[Math.floor(Math.random() * materials.length)];
    }
    detectSeasons(category, material) {
        const seasonMap = {
            wool: [wardrobe_item_entity_1.Season.FALL, wardrobe_item_entity_1.Season.WINTER],
            cashmere: [wardrobe_item_entity_1.Season.FALL, wardrobe_item_entity_1.Season.WINTER],
            linen: [wardrobe_item_entity_1.Season.SPRING, wardrobe_item_entity_1.Season.SUMMER],
            silk: [wardrobe_item_entity_1.Season.SPRING, wardrobe_item_entity_1.Season.SUMMER],
            denim: [wardrobe_item_entity_1.Season.ALL_SEASON],
            cotton: [wardrobe_item_entity_1.Season.SPRING, wardrobe_item_entity_1.Season.SUMMER, wardrobe_item_entity_1.Season.FALL],
            leather: [wardrobe_item_entity_1.Season.FALL, wardrobe_item_entity_1.Season.WINTER],
        };
        if (category === wardrobe_item_entity_1.ClothingCategory.OUTERWEAR) {
            return [wardrobe_item_entity_1.Season.FALL, wardrobe_item_entity_1.Season.WINTER];
        }
        if (category === wardrobe_item_entity_1.ClothingCategory.SWIMWEAR) {
            return [wardrobe_item_entity_1.Season.SUMMER];
        }
        return seasonMap[material] || [wardrobe_item_entity_1.Season.ALL_SEASON];
    }
    calculateFormality(category, subcategory, material) {
        const baseFormalityByCategory = {
            [wardrobe_item_entity_1.ClothingCategory.FORMAL]: 9,
            [wardrobe_item_entity_1.ClothingCategory.OUTERWEAR]: 6,
            [wardrobe_item_entity_1.ClothingCategory.DRESSES]: 6,
            [wardrobe_item_entity_1.ClothingCategory.TOPS]: 4,
            [wardrobe_item_entity_1.ClothingCategory.BOTTOMS]: 4,
            [wardrobe_item_entity_1.ClothingCategory.FOOTWEAR]: 5,
            [wardrobe_item_entity_1.ClothingCategory.ACCESSORIES]: 5,
            [wardrobe_item_entity_1.ClothingCategory.ACTIVEWEAR]: 2,
            [wardrobe_item_entity_1.ClothingCategory.SWIMWEAR]: 1,
            [wardrobe_item_entity_1.ClothingCategory.SLEEPWEAR]: 1,
        };
        let formality = baseFormalityByCategory[category] || 5;
        const casualItems = ['t-shirt', 'jeans', 'sneakers', 'hoodie', 'shorts'];
        const formalItems = ['blazer', 'dress shirt', 'heels', 'oxfords', 'suit'];
        if (casualItems.includes(subcategory)) {
            formality -= 2;
        }
        else if (formalItems.includes(subcategory)) {
            formality += 2;
        }
        return Math.max(1, Math.min(10, formality));
    }
    detectOccasions(formalityScore) {
        if (formalityScore <= 3) {
            return [...OCCASION_MAP.casual, ...OCCASION_MAP.active];
        }
        else if (formalityScore <= 5) {
            return [...OCCASION_MAP.casual, ...OCCASION_MAP.smart_casual];
        }
        else if (formalityScore <= 7) {
            return [...OCCASION_MAP.smart_casual, ...OCCASION_MAP.party];
        }
        else {
            return [...OCCASION_MAP.formal, ...OCCASION_MAP.party];
        }
    }
    generateName(color, subcategory) {
        const capitalizedColor = color.charAt(0).toUpperCase() + color.slice(1);
        const capitalizedSubcategory = subcategory
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        return `${capitalizedColor} ${capitalizedSubcategory}`;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map