import { User } from './user.entity';
export declare enum ClothingCategory {
    TOPS = "tops",
    BOTTOMS = "bottoms",
    DRESSES = "dresses",
    OUTERWEAR = "outerwear",
    FOOTWEAR = "footwear",
    ACCESSORIES = "accessories",
    ACTIVEWEAR = "activewear",
    SWIMWEAR = "swimwear",
    SLEEPWEAR = "sleepwear",
    FORMAL = "formal"
}
export declare enum Season {
    SPRING = "spring",
    SUMMER = "summer",
    FALL = "fall",
    WINTER = "winter",
    ALL_SEASON = "all-season"
}
export declare enum Pattern {
    SOLID = "solid",
    STRIPED = "striped",
    FLORAL = "floral",
    PLAID = "plaid",
    GEOMETRIC = "geometric",
    POLKA_DOT = "polka-dot",
    ABSTRACT = "abstract",
    ANIMAL_PRINT = "animal-print",
    CAMO = "camo",
    TIE_DYE = "tie-dye"
}
export declare class WardrobeItem {
    id: string;
    userId: string;
    user: User;
    name: string;
    category: ClothingCategory;
    subcategory: string;
    originalImageUrl: string;
    processedImageUrl: string;
    thumbnailUrl: string;
    primaryColor: string;
    primaryColorHex: string;
    secondaryColors: {
        name: string;
        hex: string;
    }[];
    pattern: Pattern;
    material: string;
    season: Season[];
    occasions: string[];
    formalityScore: number;
    brand: string;
    size: string;
    price: number;
    isFavorite: boolean;
    timesWorn: number;
    lastWornAt: Date;
    tags: string[];
    aiMetadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
