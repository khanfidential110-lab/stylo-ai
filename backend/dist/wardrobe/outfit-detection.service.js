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
exports.OutfitDetectionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const wardrobe_item_entity_1 = require("../database/entities/wardrobe-item.entity");
let OutfitDetectionService = class OutfitDetectionService {
    constructor(configService) {
        this.configService = configService;
        this.openrouterKey = this.configService.get('ai.openrouterKey');
        this.groqKey = this.configService.get('ai.groqKey');
    }
    async detectItemsFromPhoto(imageUrl) {
        try {
            const analysisPrompt = `Analyze this outfit photo and identify all visible clothing items and accessories.
For each item, provide:
1. Category (tops, bottoms, outerwear, footwear, accessories, dresses)
2. Specific type (e.g., t-shirt, jeans, sneakers, watch, sunglasses)
3. Primary color
4. Pattern (solid, striped, floral, etc.)
5. Estimated position in image (top/middle/bottom, left/center/right)

Respond in JSON format with an array of detected items.`;
            const detectedItems = await this.analyzeWithVisionAPI(imageUrl, analysisPrompt);
            return {
                originalImageUrl: imageUrl,
                detectedItems,
                personDetected: true,
                fullBodyVisible: detectedItems.length >= 3,
            };
        }
        catch (error) {
            return this.getMockDetection(imageUrl);
        }
    }
    async analyzeWithVisionAPI(imageUrl, prompt) {
        if (this.openrouterKey) {
            try {
                const response = await axios_1.default.post('https://openrouter.ai/api/v1/chat/completions', {
                    model: 'meta-llama/llama-3.2-11b-vision-instruct:free',
                    messages: [
                        {
                            role: 'user',
                            content: [
                                { type: 'text', text: prompt },
                                { type: 'image_url', image_url: { url: imageUrl } },
                            ],
                        },
                    ],
                    max_tokens: 1500,
                }, {
                    headers: {
                        Authorization: `Bearer ${this.openrouterKey}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 60000,
                });
                const content = response.data.choices[0].message.content;
                return this.parseDetectionResponse(content);
            }
            catch (error) {
                console.error('Vision API error:', error.message);
            }
        }
        throw new Error('No vision API available');
    }
    parseDetectionResponse(content) {
        try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                return this.getMockDetectedItems();
            }
            const parsed = JSON.parse(jsonMatch[0]);
            return parsed.map((item, index) => this.normalizeDetectedItem(item, index));
        }
        catch {
            return this.getMockDetectedItems();
        }
    }
    normalizeDetectedItem(item, index) {
        const categoryMap = {
            top: wardrobe_item_entity_1.ClothingCategory.TOPS,
            tops: wardrobe_item_entity_1.ClothingCategory.TOPS,
            shirt: wardrobe_item_entity_1.ClothingCategory.TOPS,
            tshirt: wardrobe_item_entity_1.ClothingCategory.TOPS,
            blouse: wardrobe_item_entity_1.ClothingCategory.TOPS,
            bottom: wardrobe_item_entity_1.ClothingCategory.BOTTOMS,
            bottoms: wardrobe_item_entity_1.ClothingCategory.BOTTOMS,
            pants: wardrobe_item_entity_1.ClothingCategory.BOTTOMS,
            jeans: wardrobe_item_entity_1.ClothingCategory.BOTTOMS,
            skirt: wardrobe_item_entity_1.ClothingCategory.BOTTOMS,
            shorts: wardrobe_item_entity_1.ClothingCategory.BOTTOMS,
            dress: wardrobe_item_entity_1.ClothingCategory.DRESSES,
            dresses: wardrobe_item_entity_1.ClothingCategory.DRESSES,
            outerwear: wardrobe_item_entity_1.ClothingCategory.OUTERWEAR,
            jacket: wardrobe_item_entity_1.ClothingCategory.OUTERWEAR,
            coat: wardrobe_item_entity_1.ClothingCategory.OUTERWEAR,
            footwear: wardrobe_item_entity_1.ClothingCategory.FOOTWEAR,
            shoes: wardrobe_item_entity_1.ClothingCategory.FOOTWEAR,
            sneakers: wardrobe_item_entity_1.ClothingCategory.FOOTWEAR,
            boots: wardrobe_item_entity_1.ClothingCategory.FOOTWEAR,
            accessories: wardrobe_item_entity_1.ClothingCategory.ACCESSORIES,
            accessory: wardrobe_item_entity_1.ClothingCategory.ACCESSORIES,
            watch: wardrobe_item_entity_1.ClothingCategory.ACCESSORIES,
            bag: wardrobe_item_entity_1.ClothingCategory.ACCESSORIES,
            hat: wardrobe_item_entity_1.ClothingCategory.ACCESSORIES,
            sunglasses: wardrobe_item_entity_1.ClothingCategory.ACCESSORIES,
            jewelry: wardrobe_item_entity_1.ClothingCategory.ACCESSORIES,
            belt: wardrobe_item_entity_1.ClothingCategory.ACCESSORIES,
        };
        const category = categoryMap[item.category?.toLowerCase()] ||
            categoryMap[item.type?.toLowerCase()] ||
            wardrobe_item_entity_1.ClothingCategory.TOPS;
        const color = item.color || item.primaryColor || 'black';
        const colorHex = this.getColorHex(color);
        return {
            category,
            subcategory: item.type || item.subcategory || 'unknown',
            boundingBox: {
                x: item.x || index * 0.2,
                y: item.y || 0.2,
                width: item.width || 0.3,
                height: item.height || 0.3,
            },
            confidence: item.confidence || 0.85,
            primaryColor: color,
            primaryColorHex: colorHex,
            pattern: this.getPattern(item.pattern),
            material: item.material,
            suggestedName: `${this.capitalize(color)} ${this.capitalize(item.type || category)}`,
        };
    }
    getPattern(pattern) {
        if (!pattern)
            return wardrobe_item_entity_1.Pattern.SOLID;
        const patternMap = {
            solid: wardrobe_item_entity_1.Pattern.SOLID,
            plain: wardrobe_item_entity_1.Pattern.SOLID,
            striped: wardrobe_item_entity_1.Pattern.STRIPED,
            stripes: wardrobe_item_entity_1.Pattern.STRIPED,
            floral: wardrobe_item_entity_1.Pattern.FLORAL,
            plaid: wardrobe_item_entity_1.Pattern.PLAID,
            checkered: wardrobe_item_entity_1.Pattern.PLAID,
            geometric: wardrobe_item_entity_1.Pattern.GEOMETRIC,
            polka: wardrobe_item_entity_1.Pattern.POLKA_DOT,
            'polka dot': wardrobe_item_entity_1.Pattern.POLKA_DOT,
            abstract: wardrobe_item_entity_1.Pattern.ABSTRACT,
            animal: wardrobe_item_entity_1.Pattern.ANIMAL_PRINT,
            'animal print': wardrobe_item_entity_1.Pattern.ANIMAL_PRINT,
            camo: wardrobe_item_entity_1.Pattern.CAMO,
            camouflage: wardrobe_item_entity_1.Pattern.CAMO,
            'tie dye': wardrobe_item_entity_1.Pattern.TIE_DYE,
        };
        return patternMap[pattern.toLowerCase()] || wardrobe_item_entity_1.Pattern.SOLID;
    }
    getColorHex(color) {
        const colorMap = {
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
        };
        return colorMap[color.toLowerCase()] || '#808080';
    }
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    getMockDetection(imageUrl) {
        return {
            originalImageUrl: imageUrl,
            detectedItems: this.getMockDetectedItems(),
            personDetected: true,
            fullBodyVisible: true,
        };
    }
    getMockDetectedItems() {
        return [
            {
                category: wardrobe_item_entity_1.ClothingCategory.TOPS,
                subcategory: 't-shirt',
                boundingBox: { x: 0.2, y: 0.15, width: 0.6, height: 0.3 },
                confidence: 0.92,
                primaryColor: 'blue',
                primaryColorHex: '#0000FF',
                pattern: wardrobe_item_entity_1.Pattern.SOLID,
                suggestedName: 'Blue T-Shirt',
            },
            {
                category: wardrobe_item_entity_1.ClothingCategory.BOTTOMS,
                subcategory: 'jeans',
                boundingBox: { x: 0.2, y: 0.45, width: 0.6, height: 0.35 },
                confidence: 0.89,
                primaryColor: 'denim',
                primaryColorHex: '#1560BD',
                pattern: wardrobe_item_entity_1.Pattern.SOLID,
                material: 'denim',
                suggestedName: 'Denim Jeans',
            },
            {
                category: wardrobe_item_entity_1.ClothingCategory.FOOTWEAR,
                subcategory: 'sneakers',
                boundingBox: { x: 0.25, y: 0.8, width: 0.5, height: 0.15 },
                confidence: 0.87,
                primaryColor: 'white',
                primaryColorHex: '#FFFFFF',
                pattern: wardrobe_item_entity_1.Pattern.SOLID,
                suggestedName: 'White Sneakers',
            },
            {
                category: wardrobe_item_entity_1.ClothingCategory.ACCESSORIES,
                subcategory: 'watch',
                boundingBox: { x: 0.1, y: 0.4, width: 0.08, height: 0.06 },
                confidence: 0.78,
                primaryColor: 'silver',
                primaryColorHex: '#C0C0C0',
                pattern: wardrobe_item_entity_1.Pattern.SOLID,
                suggestedName: 'Silver Watch',
            },
        ];
    }
    async cropItemFromImage(originalImageUrl, boundingBox) {
        return `${originalImageUrl}?crop=${boundingBox.x},${boundingBox.y},${boundingBox.width},${boundingBox.height}`;
    }
};
exports.OutfitDetectionService = OutfitDetectionService;
exports.OutfitDetectionService = OutfitDetectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OutfitDetectionService);
//# sourceMappingURL=outfit-detection.service.js.map