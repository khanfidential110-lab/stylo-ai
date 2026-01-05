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
var LLMService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let LLMService = LLMService_1 = class LLMService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(LLMService_1.name);
        this.openrouterKey = this.configService.get('ai.openrouterKey');
        this.groqKey = this.configService.get('ai.groqKey');
    }
    async generateResponse(messages) {
        if (this.openrouterKey) {
            try {
                return await this.callOpenRouter(messages);
            }
            catch (error) {
                this.logger.warn(`OpenRouter failed: ${error.message}`);
            }
        }
        if (this.groqKey) {
            try {
                return await this.callGroq(messages);
            }
            catch (error) {
                this.logger.warn(`Groq failed: ${error.message}`);
            }
        }
        return this.generateFallbackResponse(messages);
    }
    async callOpenRouter(messages) {
        const response = await axios_1.default.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'meta-llama/llama-3.1-8b-instruct:free',
            messages: [
                {
                    role: 'system',
                    content: this.getSystemPrompt(),
                },
                ...messages,
            ],
            max_tokens: 1000,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${this.openrouterKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://stylo-ai.com',
                'X-Title': 'STYLO AI',
            },
            timeout: 30000,
        });
        return {
            content: response.data.choices[0].message.content,
            provider: 'openrouter',
            model: 'meta-llama/llama-3.1-8b-instruct:free',
        };
    }
    async callGroq(messages) {
        const response = await axios_1.default.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.1-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: this.getSystemPrompt(),
                },
                ...messages,
            ],
            max_tokens: 1000,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${this.groqKey}`,
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });
        return {
            content: response.data.choices[0].message.content,
            provider: 'groq',
            model: 'llama-3.1-70b-versatile',
        };
    }
    generateFallbackResponse(messages) {
        const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
        let response = '';
        if (lastMessage.includes('wear') || lastMessage.includes('outfit')) {
            response = `Based on your wardrobe, I'd recommend a versatile outfit that works well for most occasions. Consider pairing neutral-colored basics with a statement piece to add visual interest. Would you like me to suggest specific items from your wardrobe?`;
        }
        else if (lastMessage.includes('weather') || lastMessage.includes('cold') || lastMessage.includes('hot')) {
            response = `For the current weather conditions, I'd suggest layering! Start with a breathable base layer and add or remove pieces as needed throughout the day. Don't forget accessories like a light jacket or sunglasses depending on the conditions.`;
        }
        else if (lastMessage.includes('color') || lastMessage.includes('match')) {
            response = `Great question about color matching! A safe approach is to pair neutrals (black, white, navy, gray) with any color. For bolder combinations, try complementary colors like blue and orange, or stick to the same color family for a monochromatic look.`;
        }
        else {
            response = `I'm here to help with your style needs! I can suggest outfits for any occasion, help you understand what colors and styles work together, and make the most of your wardrobe. What would you like help with today?`;
        }
        return {
            content: response,
            provider: 'fallback',
            model: 'built-in',
        };
    }
    getSystemPrompt() {
        return `You are STYLO AI, a friendly and knowledgeable personal style assistant. Your role is to help users:

1. Choose outfits for different occasions (work, dates, casual, formal events)
2. Understand color coordination and style principles
3. Make the most of their wardrobe
4. Get weather-appropriate outfit recommendations
5. Develop their personal style

Guidelines:
- Be concise but helpful (2-3 paragraphs max)
- Give specific, actionable advice
- Consider practicality and comfort
- Be encouraging and positive
- When suggesting outfits, mention color combinations and style tips
- If asked about items not in their wardrobe, suggest alternatives they might have

Remember: Fashion should be fun and express personality. There are no strict rules, only guidelines to help people feel confident!`;
    }
    async generateOutfitDescription(items, occasion) {
        const itemList = items.map(i => `${i.color} ${i.category} (${i.name})`).join(', ');
        const messages = [
            {
                role: 'user',
                content: `Describe this outfit combination in 2-3 sentences, explaining why it works well${occasion ? ` for ${occasion}` : ''}: ${itemList}`,
            },
        ];
        const response = await this.generateResponse(messages);
        return response.content;
    }
    async generateStylingTips(category, color, occasion) {
        const messages = [
            {
                role: 'user',
                content: `Give me 3 quick styling tips for wearing a ${color} ${category}${occasion ? ` to ${occasion}` : ''}. Format as a simple numbered list.`,
            },
        ];
        const response = await this.generateResponse(messages);
        const tips = response.content
            .split(/\d+\./)
            .map(tip => tip.trim())
            .filter(tip => tip.length > 0);
        return tips.slice(0, 3);
    }
};
exports.LLMService = LLMService;
exports.LLMService = LLMService = LLMService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LLMService);
//# sourceMappingURL=llm.service.js.map