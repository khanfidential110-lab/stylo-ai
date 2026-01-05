import { ClothingCategory, Season } from '../../database/entities/wardrobe-item.entity';
export declare class QueryWardrobeDto {
    category?: ClothingCategory;
    color?: string;
    season?: Season;
    occasion?: string;
    brand?: string;
    minFormality?: number;
    maxFormality?: number;
    isFavorite?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
