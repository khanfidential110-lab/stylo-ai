import { Injectable } from '@nestjs/common';
import { WardrobeItem, ClothingCategory, Pattern } from '../database/entities/wardrobe-item.entity';
import { OutfitItem, OutfitFeedback } from '../database/entities/outfit.entity';

interface RecommendationOptions {
  occasion?: string;
  weather?: {
    temperature: number;
    feelsLike: number;
    description: string;
    humidity: number;
  };
  count?: number;
}

interface OutfitRecommendation {
  items: OutfitItem[];
  score: number;
  feedback: OutfitFeedback;
}

// Color harmony rules
const COMPLEMENTARY_COLORS: Record<string, string[]> = {
  blue: ['orange', 'tan', 'brown', 'white', 'cream'],
  navy: ['white', 'cream', 'tan', 'burgundy', 'gold'],
  black: ['white', 'gray', 'red', 'gold', 'silver'],
  white: ['black', 'navy', 'gray', 'blue', 'any'],
  gray: ['black', 'white', 'blue', 'burgundy', 'pink'],
  red: ['black', 'white', 'gray', 'denim', 'navy'],
  green: ['brown', 'tan', 'white', 'cream', 'navy'],
  brown: ['white', 'cream', 'blue', 'green', 'tan'],
  beige: ['navy', 'brown', 'white', 'burgundy', 'olive'],
  pink: ['gray', 'white', 'navy', 'black', 'denim'],
};

// Formality compatibility
const FORMALITY_TOLERANCE = 3;

@Injectable()
export class RecommendationService {
  async generateOutfits(
    wardrobeItems: WardrobeItem[],
    options: RecommendationOptions,
  ): Promise<OutfitRecommendation[]> {
    const { occasion, weather, count = 3 } = options;

    // Group items by category
    const itemsByCategory = this.groupByCategory(wardrobeItems);

    // Filter by weather if provided
    const filteredItems = weather
      ? this.filterByWeather(itemsByCategory, weather)
      : itemsByCategory;

    // Filter by occasion if provided
    const occasionFiltered = occasion
      ? this.filterByOccasion(filteredItems, occasion)
      : filteredItems;

    // Generate outfit combinations
    const outfits: OutfitRecommendation[] = [];

    for (let i = 0; i < count; i++) {
      const outfit = this.createOutfitCombination(occasionFiltered, i);
      if (outfit) {
        const items = this.getItemsFromOutfit(outfit, wardrobeItems);
        const score = this.scoreOutfitItems(items, occasion, weather);
        const feedback = this.generateFeedback(items, score, occasion, weather);

        outfits.push({
          items: Object.entries(outfit).map(([position, itemId]) => ({
            itemId,
            position,
          })),
          score: score.total,
          feedback,
        });
      }
    }

    // Sort by score
    return outfits.sort((a, b) => b.score - a.score);
  }

  async scoreOutfit(
    items: WardrobeItem[],
    occasion?: string,
  ): Promise<{ overallScore: number; feedback: OutfitFeedback }> {
    const score = this.scoreOutfitItems(items, occasion);
    const feedback = this.generateFeedback(items, score, occasion);

    return {
      overallScore: score.total,
      feedback,
    };
  }

  private groupByCategory(
    items: WardrobeItem[],
  ): Record<ClothingCategory, WardrobeItem[]> {
    const grouped: Partial<Record<ClothingCategory, WardrobeItem[]>> = {};

    for (const item of items) {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    }

    return grouped as Record<ClothingCategory, WardrobeItem[]>;
  }

  private filterByWeather(
    items: Record<ClothingCategory, WardrobeItem[]>,
    weather: { temperature: number },
  ): Record<ClothingCategory, WardrobeItem[]> {
    const temp = weather.temperature;
    const filtered: Record<string, WardrobeItem[]> = {};

    for (const [category, categoryItems] of Object.entries(items)) {
      filtered[category] = categoryItems.filter((item) => {
        // Cold weather (below 50°F)
        if (temp < 50) {
          return (
            item.season.includes('winter' as any) ||
            item.season.includes('fall' as any) ||
            item.season.includes('all-season' as any)
          );
        }
        // Mild weather (50-70°F)
        if (temp < 70) {
          return (
            item.season.includes('spring' as any) ||
            item.season.includes('fall' as any) ||
            item.season.includes('all-season' as any)
          );
        }
        // Warm weather (above 70°F)
        return (
          item.season.includes('summer' as any) ||
          item.season.includes('spring' as any) ||
          item.season.includes('all-season' as any)
        );
      });
    }

    return filtered as Record<ClothingCategory, WardrobeItem[]>;
  }

  private filterByOccasion(
    items: Record<ClothingCategory, WardrobeItem[]>,
    occasion: string,
  ): Record<ClothingCategory, WardrobeItem[]> {
    const filtered: Record<string, WardrobeItem[]> = {};
    const occasionLower = occasion.toLowerCase();

    for (const [category, categoryItems] of Object.entries(items)) {
      const matching = categoryItems.filter((item) =>
        item.occasions.some((occ) => occ.toLowerCase().includes(occasionLower)),
      );
      // If no items match, keep all items for that category
      filtered[category] = matching.length > 0 ? matching : categoryItems;
    }

    return filtered as Record<ClothingCategory, WardrobeItem[]>;
  }

  private createOutfitCombination(
    items: Record<ClothingCategory, WardrobeItem[]>,
    variationIndex: number,
  ): Record<string, string> | null {
    const outfit: Record<string, string> = {};

    // Essential: Top
    const tops = items[ClothingCategory.TOPS] || [];
    if (tops.length > 0) {
      const topIndex = variationIndex % tops.length;
      outfit.top = tops[topIndex].id;
    }

    // Essential: Bottom (unless wearing a dress)
    const dresses = items[ClothingCategory.DRESSES] || [];
    const bottoms = items[ClothingCategory.BOTTOMS] || [];

    if (variationIndex % 3 === 0 && dresses.length > 0) {
      outfit.dress = dresses[variationIndex % dresses.length].id;
    } else if (bottoms.length > 0) {
      outfit.bottom = bottoms[variationIndex % bottoms.length].id;
    }

    // Essential: Footwear
    const footwear = items[ClothingCategory.FOOTWEAR] || [];
    if (footwear.length > 0) {
      outfit.shoes = footwear[variationIndex % footwear.length].id;
    }

    // Optional: Outerwear
    const outerwear = items[ClothingCategory.OUTERWEAR] || [];
    if (outerwear.length > 0 && variationIndex % 2 === 0) {
      outfit.outerwear = outerwear[variationIndex % outerwear.length].id;
    }

    // Optional: Accessories
    const accessories = items[ClothingCategory.ACCESSORIES] || [];
    if (accessories.length > 0 && variationIndex % 2 === 1) {
      outfit.accessory = accessories[variationIndex % accessories.length].id;
    }

    return Object.keys(outfit).length >= 2 ? outfit : null;
  }

  private getItemsFromOutfit(
    outfit: Record<string, string>,
    allItems: WardrobeItem[],
  ): WardrobeItem[] {
    const itemIds = Object.values(outfit);
    return allItems.filter((item) => itemIds.includes(item.id));
  }

  private scoreOutfitItems(
    items: WardrobeItem[],
    occasion?: string,
    weather?: { temperature: number },
  ): {
    colorHarmony: number;
    styleCoherence: number;
    occasionFit: number;
    weatherSuitability: number;
    completeness: number;
    total: number;
  } {
    const colorHarmony = this.scoreColorHarmony(items);
    const styleCoherence = this.scoreStyleCoherence(items);
    const occasionFit = occasion ? this.scoreOccasionFit(items, occasion) : 25;
    const weatherSuitability = weather
      ? this.scoreWeatherSuitability(items, weather)
      : 15;
    const completeness = this.scoreCompleteness(items);

    const total = colorHarmony + styleCoherence + occasionFit + weatherSuitability + completeness;

    return {
      colorHarmony,
      styleCoherence,
      occasionFit,
      weatherSuitability,
      completeness,
      total,
    };
  }

  private scoreColorHarmony(items: WardrobeItem[]): number {
    if (items.length < 2) return 25;

    let harmonyScore = 25;
    const colors = items.map((item) => item.primaryColor?.toLowerCase()).filter(Boolean);

    // Check color combinations
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const color1 = colors[i];
        const color2 = colors[j];

        // Check if colors are complementary
        const complements = COMPLEMENTARY_COLORS[color1] || [];
        if (!complements.includes(color2) && color1 !== color2) {
          harmonyScore -= 3;
        }
      }
    }

    // Bonus for neutral base
    const neutrals = ['black', 'white', 'gray', 'grey', 'navy', 'beige'];
    const hasNeutralBase = colors.some((c) => neutrals.includes(c));
    if (hasNeutralBase) harmonyScore += 5;

    return Math.max(0, Math.min(25, harmonyScore));
  }

  private scoreStyleCoherence(items: WardrobeItem[]): number {
    if (items.length < 2) return 25;

    let coherenceScore = 25;

    // Check formality consistency
    const formalities = items.map((item) => item.formalityScore || 5);
    const avgFormality = formalities.reduce((a, b) => a + b, 0) / formalities.length;
    const maxDeviation = Math.max(...formalities.map((f) => Math.abs(f - avgFormality)));

    if (maxDeviation > FORMALITY_TOLERANCE) {
      coherenceScore -= (maxDeviation - FORMALITY_TOLERANCE) * 3;
    }

    // Check pattern mixing
    const patterns = items.map((item) => item.pattern).filter(Boolean);
    const nonSolidPatterns = patterns.filter((p) => p !== Pattern.SOLID);
    if (nonSolidPatterns.length > 1) {
      coherenceScore -= 5; // Penalty for multiple patterns
    }

    return Math.max(0, Math.min(25, coherenceScore));
  }

  private scoreOccasionFit(items: WardrobeItem[], occasion: string): number {
    const occasionLower = occasion.toLowerCase();
    let fitScore = 0;

    for (const item of items) {
      const hasOccasion = item.occasions.some((occ) =>
        occ.toLowerCase().includes(occasionLower),
      );
      if (hasOccasion) {
        fitScore += 25 / items.length;
      }
    }

    return Math.min(25, fitScore);
  }

  private scoreWeatherSuitability(
    items: WardrobeItem[],
    weather: { temperature: number },
  ): number {
    let suitabilityScore = 15;
    const temp = weather.temperature;

    for (const item of items) {
      const seasons = item.season || [];

      if (temp < 50) {
        // Cold - should have winter/fall items
        if (!seasons.includes('winter' as any) && !seasons.includes('fall' as any)) {
          suitabilityScore -= 3;
        }
      } else if (temp > 80) {
        // Hot - should have summer items
        if (!seasons.includes('summer' as any)) {
          suitabilityScore -= 3;
        }
      }
    }

    return Math.max(0, suitabilityScore);
  }

  private scoreCompleteness(items: WardrobeItem[]): number {
    const categories = new Set(items.map((item) => item.category));

    let score = 0;

    // Has top or dress
    if (categories.has(ClothingCategory.TOPS) || categories.has(ClothingCategory.DRESSES)) {
      score += 4;
    }

    // Has bottom or dress
    if (categories.has(ClothingCategory.BOTTOMS) || categories.has(ClothingCategory.DRESSES)) {
      score += 4;
    }

    // Has footwear
    if (categories.has(ClothingCategory.FOOTWEAR)) {
      score += 2;
    }

    return Math.min(10, score);
  }

  private generateFeedback(
    items: WardrobeItem[],
    scores: {
      colorHarmony: number;
      styleCoherence: number;
      occasionFit: number;
      weatherSuitability: number;
      completeness: number;
      total: number;
    },
    occasion?: string,
    weather?: { temperature: number },
  ): OutfitFeedback {
    const compliments: string[] = [];
    const suggestions: string[] = [];
    const warnings: string[] = [];

    // Color harmony feedback
    if (scores.colorHarmony >= 20) {
      compliments.push('Great color coordination!');
    } else if (scores.colorHarmony < 15) {
      suggestions.push('Consider items with more complementary colors.');
    }

    // Style coherence feedback
    if (scores.styleCoherence >= 20) {
      compliments.push('The style is well balanced.');
    } else if (scores.styleCoherence < 15) {
      suggestions.push('The formality levels of items could be more consistent.');
    }

    // Occasion feedback
    if (occasion) {
      if (scores.occasionFit >= 20) {
        compliments.push(`Perfect for ${occasion}!`);
      } else if (scores.occasionFit < 15) {
        suggestions.push(`Some items might not be ideal for ${occasion}.`);
      }
    }

    // Weather feedback
    if (weather) {
      if (scores.weatherSuitability < 10) {
        if (weather.temperature < 50) {
          warnings.push('Consider adding warmer layers for the cold weather.');
        } else if (weather.temperature > 80) {
          warnings.push('Light, breathable fabrics would be better for this heat.');
        }
      }
    }

    // Completeness feedback
    if (scores.completeness < 8) {
      suggestions.push('The outfit could use some additional items.');
    }

    return {
      colorHarmony: {
        score: scores.colorHarmony,
        feedback: scores.colorHarmony >= 20 ? 'Excellent color combination' : 'Consider color harmony',
      },
      styleCoherence: {
        score: scores.styleCoherence,
        feedback: scores.styleCoherence >= 20 ? 'Cohesive style' : 'Mix of styles detected',
      },
      occasionFit: {
        score: scores.occasionFit,
        feedback: occasion ? `${scores.occasionFit >= 20 ? 'Perfect' : 'Suitable'} for ${occasion}` : 'No occasion specified',
      },
      weatherSuitability: {
        score: scores.weatherSuitability,
        feedback: weather ? `${scores.weatherSuitability >= 12 ? 'Appropriate' : 'Consider weather'} for current conditions` : 'No weather data',
      },
      completeness: {
        score: scores.completeness,
        feedback: scores.completeness >= 8 ? 'Complete outfit' : 'Missing items',
      },
      compliments,
      suggestions,
      alternatives: [],
      warnings,
    };
  }
}
