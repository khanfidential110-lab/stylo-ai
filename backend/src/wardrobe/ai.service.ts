import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClothingCategory, Pattern, Season } from '../database/entities/wardrobe-item.entity';

export interface ClothingAnalysis {
  processedImageUrl: string;
  thumbnailUrl: string;
  suggestedName: string;
  category: ClothingCategory;
  subcategory: string;
  primaryColor: string;
  primaryColorHex: string;
  secondaryColors: { name: string; hex: string }[];
  pattern: Pattern;
  material: string;
  season: Season[];
  occasions: string[];
  formalityScore: number;
  metadata: Record<string, any>;
}

// Color name to hex mapping
const COLOR_MAP: Record<string, string> = {
  black: '#000000',
  white: '#FFFFFF',
  navy: '#000080',
  blue: '#0000FF',
  red: '#FF0000',
  green: '#008000',
  yellow: '#FFFF00',
  orange: '#FFA500',
  purple: '#800080',
  pink: '#FFC0CB',
  brown: '#8B4513',
  gray: '#808080',
  grey: '#808080',
  beige: '#F5F5DC',
  cream: '#FFFDD0',
  burgundy: '#800020',
  maroon: '#800000',
  olive: '#808000',
  teal: '#008080',
  coral: '#FF7F50',
  lavender: '#E6E6FA',
  mint: '#98FF98',
  gold: '#FFD700',
  silver: '#C0C0C0',
  tan: '#D2B48C',
  khaki: '#F0E68C',
  denim: '#1560BD',
  charcoal: '#36454F',
};

// Category to subcategory mapping
const SUBCATEGORIES: Record<ClothingCategory, string[]> = {
  [ClothingCategory.TOPS]: [
    't-shirt', 'shirt', 'blouse', 'sweater', 'hoodie', 'tank top',
    'polo', 'cardigan', 'turtleneck', 'crop top', 'tunic',
  ],
  [ClothingCategory.BOTTOMS]: [
    'jeans', 'pants', 'shorts', 'skirt', 'leggings', 'chinos',
    'trousers', 'joggers', 'cargo pants', 'dress pants',
  ],
  [ClothingCategory.DRESSES]: [
    'casual dress', 'cocktail dress', 'maxi dress', 'midi dress',
    'mini dress', 'sundress', 'evening gown', 'wrap dress',
  ],
  [ClothingCategory.OUTERWEAR]: [
    'jacket', 'coat', 'blazer', 'windbreaker', 'parka', 'vest',
    'cardigan', 'bomber jacket', 'leather jacket', 'denim jacket',
  ],
  [ClothingCategory.FOOTWEAR]: [
    'sneakers', 'boots', 'sandals', 'loafers', 'heels', 'flats',
    'oxfords', 'running shoes', 'dress shoes', 'ankle boots',
  ],
  [ClothingCategory.ACCESSORIES]: [
    'hat', 'scarf', 'belt', 'watch', 'jewelry', 'bag', 'sunglasses',
    'tie', 'gloves', 'wallet', 'backpack',
  ],
  [ClothingCategory.ACTIVEWEAR]: [
    'sports bra', 'yoga pants', 'athletic shorts', 'gym tank',
    'compression wear', 'tracksuit', 'sports jacket',
  ],
  [ClothingCategory.SWIMWEAR]: [
    'bikini', 'one-piece', 'swim trunks', 'board shorts', 'rash guard',
  ],
  [ClothingCategory.SLEEPWEAR]: [
    'pajamas', 'nightgown', 'robe', 'sleep shorts', 'loungewear',
  ],
  [ClothingCategory.FORMAL]: [
    'suit', 'tuxedo', 'formal dress', 'dress shirt', 'bow tie',
  ],
};

// Occasion mappings based on formality
const OCCASION_MAP: Record<string, string[]> = {
  casual: ['casual', 'everyday', 'weekend', 'shopping', 'brunch'],
  smart_casual: ['work', 'business casual', 'dinner', 'date night'],
  formal: ['formal', 'meeting', 'interview', 'presentation', 'wedding'],
  active: ['gym', 'workout', 'sports', 'running', 'yoga', 'hiking'],
  party: ['party', 'night out', 'club', 'concert'],
};

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  async analyzeClothingImage(imageUrl: string): Promise<ClothingAnalysis> {
    // In production, this would call actual AI models
    // For now, we'll simulate the analysis with mock data

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock AI analysis - In production, use:
    // 1. U2-Net or MODNet for background removal
    // 2. EfficientNet for clothing classification
    // 3. K-means for color extraction
    // 4. CNN for pattern detection

    const category = this.detectCategory();
    const subcategory = this.detectSubcategory(category);
    const colors = this.detectColors();
    const pattern = this.detectPattern();
    const material = this.detectMaterial(category, subcategory);
    const seasons = this.detectSeasons(category, material);
    const formalityScore = this.calculateFormality(category, subcategory, material);
    const occasions = this.detectOccasions(formalityScore);

    return {
      processedImageUrl: imageUrl.replace('/original/', '/processed/'),
      thumbnailUrl: imageUrl.replace('/original/', '/thumbnails/'),
      suggestedName: this.generateName(colors.primary.name, subcategory),
      category,
      subcategory,
      primaryColor: colors.primary.name,
      primaryColorHex: colors.primary.hex,
      secondaryColors: colors.secondary,
      pattern,
      material,
      season: seasons,
      occasions,
      formalityScore,
      metadata: {
        confidence: 0.92,
        processingTime: 500,
        modelVersion: '1.0.0',
      },
    };
  }

  async removeBackground(imageUrl: string): Promise<string> {
    // In production, call U2-Net or Remove.bg API
    return imageUrl.replace('/original/', '/no-bg/');
  }

  async generateThumbnail(imageUrl: string): Promise<string> {
    // In production, use Sharp to resize
    return imageUrl.replace('/original/', '/thumbnails/');
  }

  async extractColors(imageUrl: string): Promise<{
    primary: { name: string; hex: string };
    secondary: { name: string; hex: string }[];
  }> {
    return this.detectColors();
  }

  private detectCategory(): ClothingCategory {
    const categories = Object.values(ClothingCategory);
    return categories[Math.floor(Math.random() * 6)] as ClothingCategory; // Limit to main categories
  }

  private detectSubcategory(category: ClothingCategory): string {
    const subcategories = SUBCATEGORIES[category] || ['unknown'];
    return subcategories[Math.floor(Math.random() * subcategories.length)];
  }

  private detectColors(): {
    primary: { name: string; hex: string };
    secondary: { name: string; hex: string }[];
  } {
    const colorNames = Object.keys(COLOR_MAP);
    const primaryColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

    const secondaryColors: { name: string; hex: string }[] = [];
    const numSecondary = Math.floor(Math.random() * 3);
    for (let i = 0; i < numSecondary; i++) {
      const name = colorNames[Math.floor(Math.random() * colorNames.length)];
      if (name !== primaryColorName) {
        secondaryColors.push({ name, hex: COLOR_MAP[name] });
      }
    }

    return {
      primary: { name: primaryColorName, hex: COLOR_MAP[primaryColorName] },
      secondary: secondaryColors,
    };
  }

  private detectPattern(): Pattern {
    const patterns = Object.values(Pattern);
    // Solid is most common
    if (Math.random() > 0.3) {
      return Pattern.SOLID;
    }
    return patterns[Math.floor(Math.random() * patterns.length)] as Pattern;
  }

  private detectMaterial(category: ClothingCategory, subcategory: string): string {
    const materialMap: Record<string, string[]> = {
      't-shirt': ['cotton', 'polyester', 'cotton blend'],
      'jeans': ['denim'],
      'sweater': ['wool', 'cashmere', 'cotton', 'acrylic'],
      'jacket': ['leather', 'denim', 'nylon', 'polyester'],
      'dress': ['silk', 'polyester', 'cotton', 'linen'],
      'sneakers': ['leather', 'canvas', 'mesh'],
      default: ['cotton', 'polyester', 'blend'],
    };

    const materials = materialMap[subcategory] || materialMap.default;
    return materials[Math.floor(Math.random() * materials.length)];
  }

  private detectSeasons(category: ClothingCategory, material: string): Season[] {
    const seasonMap: Record<string, Season[]> = {
      wool: [Season.FALL, Season.WINTER],
      cashmere: [Season.FALL, Season.WINTER],
      linen: [Season.SPRING, Season.SUMMER],
      silk: [Season.SPRING, Season.SUMMER],
      denim: [Season.ALL_SEASON],
      cotton: [Season.SPRING, Season.SUMMER, Season.FALL],
      leather: [Season.FALL, Season.WINTER],
    };

    if (category === ClothingCategory.OUTERWEAR) {
      return [Season.FALL, Season.WINTER];
    }

    if (category === ClothingCategory.SWIMWEAR) {
      return [Season.SUMMER];
    }

    return seasonMap[material] || [Season.ALL_SEASON];
  }

  private calculateFormality(
    category: ClothingCategory,
    subcategory: string,
    material: string,
  ): number {
    const baseFormalityByCategory: Record<ClothingCategory, number> = {
      [ClothingCategory.FORMAL]: 9,
      [ClothingCategory.OUTERWEAR]: 6,
      [ClothingCategory.DRESSES]: 6,
      [ClothingCategory.TOPS]: 4,
      [ClothingCategory.BOTTOMS]: 4,
      [ClothingCategory.FOOTWEAR]: 5,
      [ClothingCategory.ACCESSORIES]: 5,
      [ClothingCategory.ACTIVEWEAR]: 2,
      [ClothingCategory.SWIMWEAR]: 1,
      [ClothingCategory.SLEEPWEAR]: 1,
    };

    let formality = baseFormalityByCategory[category] || 5;

    // Adjust based on subcategory
    const casualItems = ['t-shirt', 'jeans', 'sneakers', 'hoodie', 'shorts'];
    const formalItems = ['blazer', 'dress shirt', 'heels', 'oxfords', 'suit'];

    if (casualItems.includes(subcategory)) {
      formality -= 2;
    } else if (formalItems.includes(subcategory)) {
      formality += 2;
    }

    // Clamp to 1-10
    return Math.max(1, Math.min(10, formality));
  }

  private detectOccasions(formalityScore: number): string[] {
    if (formalityScore <= 3) {
      return [...OCCASION_MAP.casual, ...OCCASION_MAP.active];
    } else if (formalityScore <= 5) {
      return [...OCCASION_MAP.casual, ...OCCASION_MAP.smart_casual];
    } else if (formalityScore <= 7) {
      return [...OCCASION_MAP.smart_casual, ...OCCASION_MAP.party];
    } else {
      return [...OCCASION_MAP.formal, ...OCCASION_MAP.party];
    }
  }

  private generateName(color: string, subcategory: string): string {
    const capitalizedColor = color.charAt(0).toUpperCase() + color.slice(1);
    const capitalizedSubcategory = subcategory
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return `${capitalizedColor} ${capitalizedSubcategory}`;
  }
}
