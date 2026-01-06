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
exports.AiChatService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const wardrobe_service_1 = require("../wardrobe/wardrobe.service");
const weather_service_1 = require("../weather/weather.service");
const gemini_service_1 = require("../common/services/gemini.service");
let AiChatService = class AiChatService {
    constructor(configService, wardrobeService, weatherService, geminiService) {
        this.configService = configService;
        this.wardrobeService = wardrobeService;
        this.weatherService = weatherService;
        this.geminiService = geminiService;
    }
    async generateResponse(userId, message, history, attachments) {
        try {
            const intent = this.analyzeIntent(message);
            switch (intent.type) {
                case 'outfit_recommendation':
                    return this.handleOutfitRecommendation(userId, intent.entities);
                case 'weather_outfit':
                    return this.handleWeatherOutfit(userId, intent.entities);
                case 'item_pairing':
                    return this.handleItemPairing(userId, intent.entities);
                case 'style_advice':
                    return this.handleStyleAdvice(userId, message);
                case 'wardrobe_question':
                    return this.handleWardrobeQuestion(userId, message);
                default:
                    return this.handleGeneralQuery(message);
            }
        }
        catch (error) {
            console.error('AI Chat Error:', error);
            return {
                message: "I'm having trouble connecting to my fashion brain right now. But I can still help you browse your wardrobe!",
                quickActions: [
                    { label: 'Browse Wardrobe', action: 'browse_wardrobe' }
                ]
            };
        }
    }
    analyzeIntent(message) {
        const lowerMessage = message.toLowerCase();
        if ((lowerMessage.includes('weather') || lowerMessage.includes('cold') ||
            lowerMessage.includes('hot') || lowerMessage.includes('rain')) &&
            (lowerMessage.includes('wear') || lowerMessage.includes('outfit'))) {
            return { type: 'weather_outfit', entities: {} };
        }
        if (lowerMessage.includes('what should i wear') ||
            lowerMessage.includes('outfit for') ||
            lowerMessage.includes('going to') ||
            lowerMessage.includes('recommend')) {
            const occasion = this.extractOccasion(lowerMessage);
            return { type: 'outfit_recommendation', entities: { occasion } };
        }
        if (lowerMessage.includes('goes with') ||
            lowerMessage.includes('pair with') ||
            lowerMessage.includes('match with')) {
            return { type: 'item_pairing', entities: {} };
        }
        if (lowerMessage.includes('style') ||
            lowerMessage.includes('look') ||
            lowerMessage.includes('trend') ||
            lowerMessage.includes('fashion')) {
            return { type: 'style_advice', entities: {} };
        }
        if (lowerMessage.includes('wardrobe') ||
            lowerMessage.includes('closet') ||
            lowerMessage.includes('how many')) {
            return { type: 'wardrobe_question', entities: {} };
        }
        return { type: 'general', entities: {} };
    }
    extractOccasion(message) {
        const occasions = [
            'work', 'office', 'meeting', 'interview',
            'date', 'dinner', 'restaurant',
            'wedding', 'party', 'birthday',
            'casual', 'brunch', 'coffee',
            'gym', 'workout', 'running',
            'beach', 'vacation', 'travel',
        ];
        for (const occasion of occasions) {
            if (message.includes(occasion)) {
                return occasion;
            }
        }
        return 'casual';
    }
    async handleOutfitRecommendation(userId, entities) {
        const occasion = entities.occasion || 'casual';
        const { items } = await this.wardrobeService.findAll(userId, { limit: 100 });
        if (items.length === 0) {
            return {
                message: "I'd love to help you with outfit suggestions, but I don't see any items in your wardrobe yet. Would you like to add some clothes first?",
                quickActions: [
                    { label: 'Add Item', action: 'add_item' },
                ],
            };
        }
        const message = `Here are some outfit ideas for ${occasion}:\n\n` +
            `Based on your wardrobe, I recommend:\n` +
            `1. A classic combination that works well for ${occasion}\n` +
            `2. A comfortable yet stylish alternative\n` +
            `3. A more adventurous option if you're feeling bold\n\n` +
            `Would you like me to show you specific items from your wardrobe?`;
        return {
            message,
            quickActions: [
                { label: 'Show Options', action: 'show_outfits' },
                { label: 'Different Occasion', action: 'change_occasion' },
            ],
        };
    }
    async handleWeatherOutfit(userId, entities) {
        const weather = await this.weatherService.getCurrentWeather('New York');
        const recommendations = this.weatherService.getClothingRecommendations(weather);
        const message = `It's currently ${weather.temperature}°F (feels like ${weather.feelsLike}°F) with ${weather.description}.\n\n` +
            `Here's what I recommend:\n\n` +
            `**Layers:** ${recommendations.layers.join(', ')}\n` +
            `**Accessories:** ${recommendations.accessories.join(', ')}\n` +
            `**Best Materials:** ${recommendations.materials.join(', ')}\n\n` +
            `**Avoid:** ${recommendations.avoid.join(', ')}\n\n` +
            `Would you like me to find matching items from your wardrobe?`;
        return {
            message,
            metadata: { weather },
            quickActions: [
                { label: 'Find Matching Items', action: 'find_items' },
                { label: 'Generate Outfit', action: 'generate_outfit' },
            ],
        };
    }
    async handleItemPairing(userId, entities) {
        const message = `I can help you find great pairings! Here are some styling tips:\n\n` +
            `**Color Matching:**\n` +
            `- Pair neutrals (black, white, gray, navy) with any color\n` +
            `- Complementary colors create visual interest\n` +
            `- Monochromatic looks are always elegant\n\n` +
            `**Style Harmony:**\n` +
            `- Keep formality levels consistent\n` +
            `- Mix textures for depth\n` +
            `- Balance fitted and relaxed pieces\n\n` +
            `Tell me which item you'd like to pair, and I'll suggest options from your wardrobe!`;
        return {
            message,
            quickActions: [
                { label: 'Browse Wardrobe', action: 'browse_wardrobe' },
                { label: 'Color Guide', action: 'color_guide' },
            ],
        };
    }
    async handleStyleAdvice(userId, message) {
        const responseMessage = `Here are some timeless style tips:\n\n` +
            `**Building a Versatile Wardrobe:**\n` +
            `- Invest in quality basics that mix and match\n` +
            `- Have pieces for each formality level\n` +
            `- Include versatile colors that work together\n\n` +
            `**Looking Put-Together:**\n` +
            `- Fit is everything - clothes should skim, not cling\n` +
            `- Pay attention to details (ironed clothes, clean shoes)\n` +
            `- Accessorize thoughtfully\n\n` +
            `**Current Trends:**\n` +
            `- Sustainable fashion is in\n` +
            `- Comfort meets style\n` +
            `- Classic pieces with modern twists\n\n` +
            `Would you like personalized style advice based on your wardrobe?`;
        return {
            message: responseMessage,
            quickActions: [
                { label: 'Analyze My Style', action: 'analyze_style' },
                { label: 'Wardrobe Gaps', action: 'find_gaps' },
            ],
        };
    }
    async handleWardrobeQuestion(userId, message) {
        const stats = await this.wardrobeService.getStatistics(userId);
        const responseMessage = `Here's a quick look at your wardrobe:\n\n` +
            `**Total Items:** ${stats.totalItems}\n\n` +
            `**By Category:**\n` +
            Object.entries(stats.categoryDistribution)
                .map(([cat, count]) => `- ${cat}: ${count} items`)
                .join('\n') +
            `\n\n**Wardrobe Value:** $${stats.totalValue.toFixed(2)}\n\n` +
            `**Items to Consider Wearing:**\n` +
            `- Unworn in last 30 days: ${stats.unwornStats.last30Days}\n` +
            `- Unworn in last 60 days: ${stats.unwornStats.last60Days}\n\n` +
            `Would you like more detailed analytics?`;
        return {
            message: responseMessage,
            metadata: { stats },
            quickActions: [
                { label: 'Full Analytics', action: 'view_analytics' },
                { label: 'Least Worn Items', action: 'show_unworn' },
            ],
        };
    }
    async handleGeneralQuery(message) {
        try {
            const aiResponse = await this.geminiService.chat(message);
            return {
                message: aiResponse,
                quickActions: [
                    { label: "Today's Weather Picks", action: 'weather_outfit' },
                    { label: 'Outfit for Event', action: 'occasion_outfit' },
                    { label: 'Surprise Me', action: 'random_outfit' },
                ],
            };
        }
        catch (error) {
            return {
                message: `I'm your personal style assistant! Here's what I can help you with:\n\n` +
                    `**Outfit Recommendations** - Tell me where you're going\n` +
                    `**Weather-Based Styling** - I'll check the forecast and suggest appropriate outfits\n` +
                    `**Item Pairing** - Ask what goes with any piece\n` +
                    `**Wardrobe Analytics** - Understand your closet better\n` +
                    `**Style Advice** - Get personalized fashion tips\n\n` +
                    `Just ask me something like:\n` +
                    `- "What should I wear to a dinner date?"\n` +
                    `- "It's cold outside, what should I wear?"\n` +
                    `- "What goes with my blue blazer?"`,
                quickActions: [
                    { label: "Today's Weather Picks", action: 'weather_outfit' },
                    { label: 'Outfit for Event', action: 'occasion_outfit' },
                    { label: 'Surprise Me', action: 'random_outfit' },
                ],
            };
        }
    }
};
exports.AiChatService = AiChatService;
exports.AiChatService = AiChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        wardrobe_service_1.WardrobeService,
        weather_service_1.WeatherService,
        gemini_service_1.GeminiService])
], AiChatService);
//# sourceMappingURL=ai-chat.service.js.map