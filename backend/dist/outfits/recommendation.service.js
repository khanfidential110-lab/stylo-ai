"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationService = void 0;
const common_1 = require("@nestjs/common");
const wardrobe_item_entity_1 = require("../database/entities/wardrobe-item.entity");
const COMPLEMENTARY_COLORS = {
    blue: ['orange', 'tan', 'brown', 'white', 'cream'],
    navy: ['white', 'cream', 'tan', 'burgundy', 'gold'],
    black: ['white', 'gray', 'red', 'gold', 'silver'],
    white: ['black', 'navy', 'gray', 'blue', 'any'],
    gray: ['black', 'white', 'blue', 'burgundy', 'pink'],
    red: ['black', 'white', 'gray', 'denim', 'navy'],
    green: ['brown', 'tan', 'white', 'cream', 'navy'],
    brown: ['white', 'cream', 'blue', 'green', 'tan'],
    beige: ['navy', 'brown', 'white', 'burgundy', 'olive'],
    pink: ['gray', 'white', 'navy', 'black', 'denim'],
};
const FORMALITY_TOLERANCE = 3;
let RecommendationService = class RecommendationService {
    async generateOutfits(wardrobeItems, options) {
        const { occasion, weather, count = 3 } = options;
        const itemsByCategory = this.groupByCategory(wardrobeItems);
        const filteredItems = weather
            ? this.filterByWeather(itemsByCategory, weather)
            : itemsByCategory;
        const occasionFiltered = occasion
            ? this.filterByOccasion(filteredItems, occasion)
            : filteredItems;
        const outfits = [];
        for (let i = 0; i < count; i++) {
            const outfit = this.createOutfitCombination(occasionFiltered, i);
            if (outfit) {
                const items = this.getItemsFromOutfit(outfit, wardrobeItems);
                const score = this.scoreOutfitItems(items, occasion, weather);
                const feedback = this.generateFeedback(items, score, occasion, weather);
                outfits.push({
                    items: Object.entries(outfit).map(([position, itemId]) => ({
                        itemId,
                        position,
                    })),
                    score: score.total,
                    feedback,
                });
            }
        }
        return outfits.sort((a, b) => b.score - a.score);
    }
    async scoreOutfit(items, occasion) {
        const score = this.scoreOutfitItems(items, occasion);
        const feedback = this.generateFeedback(items, score, occasion);
        return {
            overallScore: score.total,
            feedback,
        };
    }
    groupByCategory(items) {
        const grouped = {};
        for (const item of items) {
            if (!grouped[item.category]) {
                grouped[item.category] = [];
            }
            grouped[item.category].push(item);
        }
        return grouped;
    }
    filterByWeather(items, weather) {
        const temp = weather.temperature;
        const filtered = {};
        for (const [category, categoryItems] of Object.entries(items)) {
            filtered[category] = categoryItems.filter((item) => {
                if (temp < 50) {
                    return (item.season.includes('winter') ||
                        item.season.includes('fall') ||
                        item.season.includes('all-season'));
                }
                if (temp < 70) {
                    return (item.season.includes('spring') ||
                        item.season.includes('fall') ||
                        item.season.includes('all-season'));
                }
                return (item.season.includes('summer') ||
                    item.season.includes('spring') ||
                    item.season.includes('all-season'));
            });
        }
        return filtered;
    }
    filterByOccasion(items, occasion) {
        const filtered = {};
        const occasionLower = occasion.toLowerCase();
        for (const [category, categoryItems] of Object.entries(items)) {
            const matching = categoryItems.filter((item) => item.occasions.some((occ) => occ.toLowerCase().includes(occasionLower)));
            filtered[category] = matching.length > 0 ? matching : categoryItems;
        }
        return filtered;
    }
    createOutfitCombination(items, variationIndex) {
        const outfit = {};
        const tops = items[wardrobe_item_entity_1.ClothingCategory.TOPS] || [];
        if (tops.length > 0) {
            const topIndex = variationIndex % tops.length;
            outfit.top = tops[topIndex].id;
        }
        const dresses = items[wardrobe_item_entity_1.ClothingCategory.DRESSES] || [];
        const bottoms = items[wardrobe_item_entity_1.ClothingCategory.BOTTOMS] || [];
        if (variationIndex % 3 === 0 && dresses.length > 0) {
            outfit.dress = dresses[variationIndex % dresses.length].id;
        }
        else if (bottoms.length > 0) {
            outfit.bottom = bottoms[variationIndex % bottoms.length].id;
        }
        const footwear = items[wardrobe_item_entity_1.ClothingCategory.FOOTWEAR] || [];
        if (footwear.length > 0) {
            outfit.shoes = footwear[variationIndex % footwear.length].id;
        }
        const outerwear = items[wardrobe_item_entity_1.ClothingCategory.OUTERWEAR] || [];
        if (outerwear.length > 0 && variationIndex % 2 === 0) {
            outfit.outerwear = outerwear[variationIndex % outerwear.length].id;
        }
        const accessories = items[wardrobe_item_entity_1.ClothingCategory.ACCESSORIES] || [];
        if (accessories.length > 0 && variationIndex % 2 === 1) {
            outfit.accessory = accessories[variationIndex % accessories.length].id;
        }
        return Object.keys(outfit).length >= 2 ? outfit : null;
    }
    getItemsFromOutfit(outfit, allItems) {
        const itemIds = Object.values(outfit);
        return allItems.filter((item) => itemIds.includes(item.id));
    }
    scoreOutfitItems(items, occasion, weather) {
        const colorHarmony = this.scoreColorHarmony(items);
        const styleCoherence = this.scoreStyleCoherence(items);
        const occasionFit = occasion ? this.scoreOccasionFit(items, occasion) : 25;
        const weatherSuitability = weather
            ? this.scoreWeatherSuitability(items, weather)
            : 15;
        const completeness = this.scoreCompleteness(items);
        const total = colorHarmony + styleCoherence + occasionFit + weatherSuitability + completeness;
        return {
            colorHarmony,
            styleCoherence,
            occasionFit,
            weatherSuitability,
            completeness,
            total,
        };
    }
    scoreColorHarmony(items) {
        if (items.length < 2)
            return 25;
        let harmonyScore = 25;
        const colors = items.map((item) => item.primaryColor?.toLowerCase()).filter(Boolean);
        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                const color1 = colors[i];
                const color2 = colors[j];
                const complements = COMPLEMENTARY_COLORS[color1] || [];
                if (!complements.includes(color2) && color1 !== color2) {
                    harmonyScore -= 3;
                }
            }
        }
        const neutrals = ['black', 'white', 'gray', 'grey', 'navy', 'beige'];
        const hasNeutralBase = colors.some((c) => neutrals.includes(c));
        if (hasNeutralBase)
            harmonyScore += 5;
        return Math.max(0, Math.min(25, harmonyScore));
    }
    scoreStyleCoherence(items) {
        if (items.length < 2)
            return 25;
        let coherenceScore = 25;
        const formalities = items.map((item) => item.formalityScore || 5);
        const avgFormality = formalities.reduce((a, b) => a + b, 0) / formalities.length;
        const maxDeviation = Math.max(...formalities.map((f) => Math.abs(f - avgFormality)));
        if (maxDeviation > FORMALITY_TOLERANCE) {
            coherenceScore -= (maxDeviation - FORMALITY_TOLERANCE) * 3;
        }
        const patterns = items.map((item) => item.pattern).filter(Boolean);
        const nonSolidPatterns = patterns.filter((p) => p !== wardrobe_item_entity_1.Pattern.SOLID);
        if (nonSolidPatterns.length > 1) {
            coherenceScore -= 5;
        }
        return Math.max(0, Math.min(25, coherenceScore));
    }
    scoreOccasionFit(items, occasion) {
        const occasionLower = occasion.toLowerCase();
        let fitScore = 0;
        for (const item of items) {
            const hasOccasion = item.occasions.some((occ) => occ.toLowerCase().includes(occasionLower));
            if (hasOccasion) {
                fitScore += 25 / items.length;
            }
        }
        return Math.min(25, fitScore);
    }
    scoreWeatherSuitability(items, weather) {
        let suitabilityScore = 15;
        const temp = weather.temperature;
        for (const item of items) {
            const seasons = item.season || [];
            if (temp < 50) {
                if (!seasons.includes('winter') && !seasons.includes('fall')) {
                    suitabilityScore -= 3;
                }
            }
            else if (temp > 80) {
                if (!seasons.includes('summer')) {
                    suitabilityScore -= 3;
                }
            }
        }
        return Math.max(0, suitabilityScore);
    }
    scoreCompleteness(items) {
        const categories = new Set(items.map((item) => item.category));
        let score = 0;
        if (categories.has(wardrobe_item_entity_1.ClothingCategory.TOPS) || categories.has(wardrobe_item_entity_1.ClothingCategory.DRESSES)) {
            score += 4;
        }
        if (categories.has(wardrobe_item_entity_1.ClothingCategory.BOTTOMS) || categories.has(wardrobe_item_entity_1.ClothingCategory.DRESSES)) {
            score += 4;
        }
        if (categories.has(wardrobe_item_entity_1.ClothingCategory.FOOTWEAR)) {
            score += 2;
        }
        return Math.min(10, score);
    }
    generateFeedback(items, scores, occasion, weather) {
        const compliments = [];
        const suggestions = [];
        const warnings = [];
        if (scores.colorHarmony >= 20) {
            compliments.push('Great color coordination!');
        }
        else if (scores.colorHarmony < 15) {
            suggestions.push('Consider items with more complementary colors.');
        }
        if (scores.styleCoherence >= 20) {
            compliments.push('The style is well balanced.');
        }
        else if (scores.styleCoherence < 15) {
            suggestions.push('The formality levels of items could be more consistent.');
        }
        if (occasion) {
            if (scores.occasionFit >= 20) {
                compliments.push(`Perfect for ${occasion}!`);
            }
            else if (scores.occasionFit < 15) {
                suggestions.push(`Some items might not be ideal for ${occasion}.`);
            }
        }
        if (weather) {
            if (scores.weatherSuitability < 10) {
                if (weather.temperature < 50) {
                    warnings.push('Consider adding warmer layers for the cold weather.');
                }
                else if (weather.temperature > 80) {
                    warnings.push('Light, breathable fabrics would be better for this heat.');
                }
            }
        }
        if (scores.completeness < 8) {
            suggestions.push('The outfit could use some additional items.');
        }
        return {
            colorHarmony: {
                score: scores.colorHarmony,
                feedback: scores.colorHarmony >= 20 ? 'Excellent color combination' : 'Consider color harmony',
            },
            styleCoherence: {
                score: scores.styleCoherence,
                feedback: scores.styleCoherence >= 20 ? 'Cohesive style' : 'Mix of styles detected',
            },
            occasionFit: {
                score: scores.occasionFit,
                feedback: occasion ? `${scores.occasionFit >= 20 ? 'Perfect' : 'Suitable'} for ${occasion}` : 'No occasion specified',
            },
            weatherSuitability: {
                score: scores.weatherSuitability,
                feedback: weather ? `${scores.weatherSuitability >= 12 ? 'Appropriate' : 'Consider weather'} for current conditions` : 'No weather data',
            },
            completeness: {
                score: scores.completeness,
                feedback: scores.completeness >= 8 ? 'Complete outfit' : 'Missing items',
            },
            compliments,
            suggestions,
            alternatives: [],
            warnings,
        };
    }
};
exports.RecommendationService = RecommendationService;
exports.RecommendationService = RecommendationService = __decorate([
    (0, common_1.Injectable)()
], RecommendationService);
//# sourceMappingURL=recommendation.service.js.map