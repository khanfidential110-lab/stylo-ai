import { ConfigService } from '@nestjs/config';
import { ChatMessage, MessageAttachment } from '../database/entities/chat-message.entity';
import { WardrobeService } from '../wardrobe/wardrobe.service';
import { WeatherService } from '../weather/weather.service';
import { GeminiService } from '../common/services/gemini.service';
export interface ChatResponse {
    message: string;
    conversationId?: string;
    attachments?: MessageAttachment[];
    metadata?: Record<string, any>;
    quickActions?: {
        label: string;
        action: string;
    }[];
}
export declare class AiChatService {
    private readonly configService;
    private readonly wardrobeService;
    private readonly weatherService;
    private readonly geminiService;
    constructor(configService: ConfigService, wardrobeService: WardrobeService, weatherService: WeatherService, geminiService: GeminiService);
    generateResponse(userId: string, message: string, history: ChatMessage[], attachments?: MessageAttachment[]): Promise<ChatResponse>;
    private analyzeIntent;
    private extractOccasion;
    private handleOutfitRecommendation;
    private handleWeatherOutfit;
    private handleItemPairing;
    private handleStyleAdvice;
    private handleWardrobeQuestion;
    private handleGeneralQuery;
}
