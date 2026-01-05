import { ConfigService } from '@nestjs/config';
export interface LLMMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface LLMResponse {
    content: string;
    provider: 'openrouter' | 'groq' | 'fallback';
    model: string;
}
export declare class LLMService {
    private readonly configService;
    private readonly logger;
    private readonly openrouterKey;
    private readonly groqKey;
    constructor(configService: ConfigService);
    generateResponse(messages: LLMMessage[]): Promise<LLMResponse>;
    private callOpenRouter;
    private callGroq;
    private generateFallbackResponse;
    private getSystemPrompt;
    generateOutfitDescription(items: {
        name: string;
        category: string;
        color: string;
    }[], occasion?: string): Promise<string>;
    generateStylingTips(category: string, color: string, occasion?: string): Promise<string[]>;
}
