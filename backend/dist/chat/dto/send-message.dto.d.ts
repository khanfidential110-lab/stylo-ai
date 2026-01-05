declare class AttachmentDto {
    type: 'image' | 'outfit' | 'wardrobe_item';
    url?: string;
    itemId?: string;
    outfitId?: string;
}
export declare class SendMessageDto {
    message: string;
    conversationId?: string;
    attachments?: AttachmentDto[];
}
export {};
