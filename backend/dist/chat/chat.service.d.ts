import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ChatMessage } from '../database/entities/chat-message.entity';
import { AiChatService, ChatResponse } from './ai-chat.service';
import { SendMessageDto } from './dto/send-message.dto';
export declare class ChatService {
    private readonly messageRepository;
    private readonly aiChatService;
    private readonly configService;
    constructor(messageRepository: Repository<ChatMessage>, aiChatService: AiChatService, configService: ConfigService);
    sendMessage(userId: string, sendMessageDto: SendMessageDto, userTier: string): Promise<ChatResponse>;
    getConversations(userId: string): Promise<{
        id: string;
        lastMessage: string;
        messageCount: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getConversation(userId: string, conversationId: string): Promise<{
        id: string;
        messages: ChatMessage[];
    }>;
    deleteConversation(userId: string, conversationId: string): Promise<void>;
    private getConversationHistory;
    private checkMessageLimit;
}
