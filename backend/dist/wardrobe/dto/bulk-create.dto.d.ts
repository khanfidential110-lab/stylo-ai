import { CreateWardrobeItemDto } from './create-wardrobe-item.dto';
declare class BulkItemDto {
    imageUrl: string;
    data?: CreateWardrobeItemDto;
}
export declare class BulkCreateDto {
    items: BulkItemDto[];
}
export {};
