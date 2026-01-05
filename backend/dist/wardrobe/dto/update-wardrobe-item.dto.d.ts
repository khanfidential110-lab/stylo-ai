import { ClothingCategory, Pattern, Season } from '../../database/entities/wardrobe-item.entity';
export declare class UpdateWardrobeItemDto {
    name?: string;
    category?: ClothingCategory;
    subcategory?: string;
    primaryColor?: string;
    pattern?: Pattern;
    material?: string;
    season?: Season[];
    occasions?: string[];
    formalityScore?: number;
    brand?: string;
    size?: string;
    price?: number;
    isFavorite?: boolean;
    tags?: string[];
}
