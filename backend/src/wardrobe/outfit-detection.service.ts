import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ClothingCategory, Pattern, Season } from '../database/entities/wardrobe-item.entity';

export interface DetectedItem {
  category: ClothingCategory;
  subcategory: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  primaryColor: string;
  primaryColorHex: string;
  pattern: Pattern;
  material?: string;
  croppedImageUrl?: string;
  suggestedName: string;
}

export interface OutfitDetectionResult {
  originalImageUrl: string;
  detectedItems: DetectedItem[];
  personDetected: boolean;
  fullBodyVisible: boolean;
}

@Injectable()
export class OutfitDetectionService {
  private readonly openrouterKey: string;
  private readonly groqKey: string;

  constructor(private readonly configService: ConfigService) {
    this.openrouterKey = this.configService.get('ai.openrouterKey');
    this.groqKey = this.configService.get('ai.groqKey');
  }

  async detectItemsFromPhoto(imageUrl: string): Promise<OutfitDetectionResult> {
    // In production, use vision models like:
    // - Detectron2 for clothing detection
    // - CLIP for attribute classification
    // - GPT-4V or Claude Vision for detailed analysis

    // For now, we'll use a mock detection with AI-based analysis
    try {
      const analysisPrompt = `Analyze this outfit photo and identify all visible clothing items and accessories.
For each item, provide:
1. Category (tops, bottoms, outerwear, footwear, accessories, dresses)
2. Specific type (e.g., t-shirt, jeans, sneakers, watch, sunglasses)
3. Primary color
4. Pattern (solid, striped, floral, etc.)
5. Estimated position in image (top/middle/bottom, left/center/right)

Respond in JSON format with an array of detected items.`;

      // Try to call vision API
      const detectedItems = await this.analyzeWithVisionAPI(imageUrl, analysisPrompt);

      return {
        originalImageUrl: imageUrl,
        detectedItems,
        personDetected: true,
        fullBodyVisible: detectedItems.length >= 3,
      };
    } catch (error) {
      // Return mock detection for development
      return this.getMockDetection(imageUrl);
    }
  }

  private async analyzeWithVisionAPI(
    imageUrl: string,
    prompt: string,
  ): Promise<DetectedItem[]> {
    // Try OpenRouter with vision model
    if (this.openrouterKey) {
      try {
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'meta-llama/llama-3.2-11b-vision-instruct:free',
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: prompt },
                  { type: 'image_url', image_url: { url: imageUrl } },
                ],
              },
            ],
            max_tokens: 1500,
          },
          {
            headers: {
              Authorization: `Bearer ${this.openrouterKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 60000,
          },
        );

        const content = response.data.choices[0].message.content;
        return this.parseDetectionResponse(content);
      } catch (error) {
        console.error('Vision API error:', error.message);
      }
    }

    throw new Error('No vision API available');
  }

  private parseDetectionResponse(content: string): DetectedItem[] {
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return this.getMockDetectedItems();
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.map((item: any, index: number) => this.normalizeDetectedItem(item, index));
    } catch {
      return this.getMockDetectedItems();
    }
  }

  private normalizeDetectedItem(item: any, index: number): DetectedItem {
    const categoryMap: Record<string, ClothingCategory> = {
      top: ClothingCategory.TOPS,
      tops: ClothingCategory.TOPS,
      shirt: ClothingCategory.TOPS,
      tshirt: ClothingCategory.TOPS,
      blouse: ClothingCategory.TOPS,
      bottom: ClothingCategory.BOTTOMS,
      bottoms: ClothingCategory.BOTTOMS,
      pants: ClothingCategory.BOTTOMS,
      jeans: ClothingCategory.BOTTOMS,
      skirt: ClothingCategory.BOTTOMS,
      shorts: ClothingCategory.BOTTOMS,
      dress: ClothingCategory.DRESSES,
      dresses: ClothingCategory.DRESSES,
      outerwear: ClothingCategory.OUTERWEAR,
      jacket: ClothingCategory.OUTERWEAR,
      coat: ClothingCategory.OUTERWEAR,
      footwear: ClothingCategory.FOOTWEAR,
      shoes: ClothingCategory.FOOTWEAR,
      sneakers: ClothingCategory.FOOTWEAR,
      boots: ClothingCategory.FOOTWEAR,
      accessories: ClothingCategory.ACCESSORIES,
      accessory: ClothingCategory.ACCESSORIES,
      watch: ClothingCategory.ACCESSORIES,
      bag: ClothingCategory.ACCESSORIES,
      hat: ClothingCategory.ACCESSORIES,
      sunglasses: ClothingCategory.ACCESSORIES,
      jewelry: ClothingCategory.ACCESSORIES,
      belt: ClothingCategory.ACCESSORIES,
    };

    const category =
      categoryMap[item.category?.toLowerCase()] ||
      categoryMap[item.type?.toLowerCase()] ||
      ClothingCategory.TOPS;

    const color = item.color || item.primaryColor || 'black';
    const colorHex = this.getColorHex(color);

    return {
      category,
      subcategory: item.type || item.subcategory || 'unknown',
      boundingBox: {
        x: item.x || index * 0.2,
        y: item.y || 0.2,
        width: item.width || 0.3,
        height: item.height || 0.3,
      },
      confidence: item.confidence || 0.85,
      primaryColor: color,
      primaryColorHex: colorHex,
      pattern: this.getPattern(item.pattern),
      material: item.material,
      suggestedName: `${this.capitalize(color)} ${this.capitalize(item.type || category)}`,
    };
  }

  private getPattern(pattern?: string): Pattern {
    if (!pattern) return Pattern.SOLID;

    const patternMap: Record<string, Pattern> = {
      solid: Pattern.SOLID,
      plain: Pattern.SOLID,
      striped: Pattern.STRIPED,
      stripes: Pattern.STRIPED,
      floral: Pattern.FLORAL,
      plaid: Pattern.PLAID,
      checkered: Pattern.PLAID,
      geometric: Pattern.GEOMETRIC,
      polka: Pattern.POLKA_DOT,
      'polka dot': Pattern.POLKA_DOT,
      abstract: Pattern.ABSTRACT,
      animal: Pattern.ANIMAL_PRINT,
      'animal print': Pattern.ANIMAL_PRINT,
      camo: Pattern.CAMO,
      camouflage: Pattern.CAMO,
      'tie dye': Pattern.TIE_DYE,
    };

    return patternMap[pattern.toLowerCase()] || Pattern.SOLID;
  }

  private getColorHex(color: string): string {
    const colorMap: Record<string, string> = {
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
    };

    return colorMap[color.toLowerCase()] || '#808080';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private getMockDetection(imageUrl: string): OutfitDetectionResult {
    return {
      originalImageUrl: imageUrl,
      detectedItems: this.getMockDetectedItems(),
      personDetected: true,
      fullBodyVisible: true,
    };
  }

  private getMockDetectedItems(): DetectedItem[] {
    return [
      {
        category: ClothingCategory.TOPS,
        subcategory: 't-shirt',
        boundingBox: { x: 0.2, y: 0.15, width: 0.6, height: 0.3 },
        confidence: 0.92,
        primaryColor: 'blue',
        primaryColorHex: '#0000FF',
        pattern: Pattern.SOLID,
        suggestedName: 'Blue T-Shirt',
      },
      {
        category: ClothingCategory.BOTTOMS,
        subcategory: 'jeans',
        boundingBox: { x: 0.2, y: 0.45, width: 0.6, height: 0.35 },
        confidence: 0.89,
        primaryColor: 'denim',
        primaryColorHex: '#1560BD',
        pattern: Pattern.SOLID,
        material: 'denim',
        suggestedName: 'Denim Jeans',
      },
      {
        category: ClothingCategory.FOOTWEAR,
        subcategory: 'sneakers',
        boundingBox: { x: 0.25, y: 0.8, width: 0.5, height: 0.15 },
        confidence: 0.87,
        primaryColor: 'white',
        primaryColorHex: '#FFFFFF',
        pattern: Pattern.SOLID,
        suggestedName: 'White Sneakers',
      },
      {
        category: ClothingCategory.ACCESSORIES,
        subcategory: 'watch',
        boundingBox: { x: 0.1, y: 0.4, width: 0.08, height: 0.06 },
        confidence: 0.78,
        primaryColor: 'silver',
        primaryColorHex: '#C0C0C0',
        pattern: Pattern.SOLID,
        suggestedName: 'Silver Watch',
      },
    ];
  }

  async cropItemFromImage(
    originalImageUrl: string,
    boundingBox: { x: number; y: number; width: number; height: number },
  ): Promise<string> {
    // In production, use Sharp or ImageMagick to crop
    // For now, return a placeholder URL
    return `${originalImageUrl}?crop=${boundingBox.x},${boundingBox.y},${boundingBox.width},${boundingBox.height}`;
  }
}
