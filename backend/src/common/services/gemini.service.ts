import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

@Injectable()
export class GeminiService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
  }

  async analyzeClothingImage(imageUrl: string): Promise<{
    category: string;
    subcategory: string;
    primaryColor: string;
    secondaryColors: string[];
    pattern: string;
    material: string;
    seasons: string[];
    occasions: string[];
    formalityScore: number;
    suggestedName: string;
  }> {
    const prompt = `Analyze this clothing item image and provide a JSON response with the following fields:
{
  "category": "one of: tops, bottoms, dresses, outerwear, footwear, accessories, activewear, swimwear, sleepwear, formal",
  "subcategory": "specific type like t-shirt, jeans, blazer, etc.",
  "primaryColor": "main color name",
  "secondaryColors": ["array of other colors"],
  "pattern": "one of: solid, striped, plaid, floral, geometric, abstract, animal_print, polka_dot, checkered, camouflage",
  "material": "fabric type like cotton, denim, silk, etc.",
  "seasons": ["array of: spring, summer, fall, winter, all_season"],
  "occasions": ["array of suitable occasions like casual, work, formal, party, etc."],
  "formalityScore": "number 1-10 where 1 is very casual and 10 is very formal",
  "suggestedName": "a nice name like 'Navy Blue Blazer' or 'Classic White T-Shirt'"
}

Respond ONLY with valid JSON, no other text.`;

    try {
      const response = await fetch(
        `${this.baseUrl}/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: 'image/jpeg',
                      data: await this.fetchImageAsBase64(imageUrl),
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1024,
            },
          }),
        },
      );

      const data: GeminiResponse = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Gemini analysis error:', error);
      // Return default values on error
      return {
        category: 'tops',
        subcategory: 't-shirt',
        primaryColor: 'blue',
        secondaryColors: [],
        pattern: 'solid',
        material: 'cotton',
        seasons: ['all_season'],
        occasions: ['casual'],
        formalityScore: 5,
        suggestedName: 'Clothing Item',
      };
    }
  }

  async chat(message: string, context?: string): Promise<string> {
    const systemPrompt = `You are Stylo, an AI fashion and style assistant. You help users with:
- Outfit recommendations based on weather, occasion, and personal style
- Color coordination and pattern matching advice
- Wardrobe organization tips
- Fashion trends and styling suggestions
- Body type-appropriate clothing recommendations

Be friendly, helpful, and specific. Keep responses concise but informative.
${context ? `\nContext about user's wardrobe: ${context}` : ''}`;

    try {
      const response = await fetch(
        `${this.baseUrl}/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 512,
            },
          }),
        },
      );

      const data: GeminiResponse = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "I'm sorry, I couldn't process that request. Please try again.";
    } catch (error) {
      console.error('Gemini chat error:', error);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
  }

  async generateOutfitSuggestion(
    wardrobeItems: any[],
    occasion: string,
    weather?: { temperature: number; condition: string },
  ): Promise<{
    itemIds: string[];
    explanation: string;
    score: number;
  }> {
    const itemDescriptions = wardrobeItems
      .map((item, i) => `${i + 1}. ID: ${item.id} - ${item.name || item.category} (${item.primaryColor})`)
      .join('\n');

    const weatherInfo = weather
      ? `Weather: ${weather.temperature}°F, ${weather.condition}`
      : '';

    const prompt = `Given these wardrobe items:
${itemDescriptions}

Create an outfit for: ${occasion}
${weatherInfo}

Respond with JSON:
{
  "itemIds": ["array of item IDs to include in outfit"],
  "explanation": "brief explanation of why this outfit works",
  "score": "style score 1-10"
}

Respond ONLY with valid JSON.`;

    try {
      const response = await fetch(
        `${this.baseUrl}/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 512,
            },
          }),
        },
      );

      const data: GeminiResponse = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid response');
    } catch (error) {
      console.error('Gemini outfit suggestion error:', error);
      return {
        itemIds: wardrobeItems.slice(0, 3).map((i) => i.id),
        explanation: 'A classic combination for your occasion.',
        score: 7,
      };
    }
  }

  private async fetchImageAsBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();
      return Buffer.from(buffer).toString('base64');
    } catch (error) {
      console.error('Error fetching image:', error);
      return '';
    }
  }
}
