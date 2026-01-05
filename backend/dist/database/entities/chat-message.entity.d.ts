import { User } from './user.entity';
export declare enum MessageRole {
    USER = "user",
    ASSISTANT = "assistant",
    SYSTEM = "system"
}
export interface MessageAttachment {
    type: 'image' | 'outfit' | 'wardrobe_item';
    url?: string;
    itemId?: string;
    outfitId?: string;
}
export declare class ChatMessage {
    id: string;
    userId: string;
    user: User;
    conversationId: string;
    role: MessageRole;
    content: string;
    attachments: MessageAttachment[];
    metadata: Record<string, any>;
    createdAt: Date;
}
