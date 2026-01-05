import { ChatService } from './chat.service';
import { User } from '../database/entities/user.entity';
import { SendMessageDto } from './dto/send-message.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    sendMessage(user: User, sendMessageDto: SendMessageDto): Promise<import("./ai-chat.service").ChatResponse>;
    getConversations(user: User): Promise<{
        id: string;
        lastMessage: string;
        messageCount: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getConversation(user: User, conversationId: string): Promise<{
        id: string;
        messages: import("../database/entities").ChatMessage[];
    }>;
    deleteConversation(user: User, conversationId: string): Promise<{
        message: string;
    }>;
}
