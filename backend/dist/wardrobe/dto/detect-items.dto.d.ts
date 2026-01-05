export declare class DetectItemsDto {
    imageUrl: string;
    autoSave?: boolean;
}
declare class ConfirmItemDto {
    suggestedName: string;
    category: string;
    subcategory?: string;
    primaryColor: string;
    croppedImageUrl?: string;
    selected?: boolean;
}
export declare class SaveDetectedItemsDto {
    originalImageUrl: string;
    items: ConfirmItemDto[];
}
export {};
