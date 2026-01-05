declare class OutfitItemDto {
    itemId: string;
    position: string;
}
export declare class CreateOutfitDto {
    name?: string;
    items: OutfitItemDto[];
    occasion?: string;
    notes?: string;
}
export {};
