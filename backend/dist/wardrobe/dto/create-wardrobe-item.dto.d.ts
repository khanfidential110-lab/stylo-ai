import { ClothingCategory, Season } from '../../database/entities/wardrobe-item.entity';
export declare class CreateWardrobeItemDto {
    name?: string;
    category?: ClothingCategory;
    subcategory?: string;
    material?: string;
    primaryColor?: string;
    season?: Season[];
    occasions?: string[];
    brand?: string;
    size?: string;
    price?: number;
    tags?: string[];
}
