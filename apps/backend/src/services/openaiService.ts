import OpenAI from 'openai';
import { ParsedQuery } from '../types';

export class OpenAIService {
  private client: OpenAI | null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('OPENAI_API_KEY not found, using fallback parsing only');
      this.client = null;
    } else {
      this.client = new OpenAI({ apiKey });
    }
  }

  async parseQuery(query: string): Promise<ParsedQuery> {
    // If no OpenAI client, use fallback parsing
    if (!this.client) {
      return this.fallbackParse(query);
    }

    try {
      const prompt = `
You are an AI assistant that helps parse automotive parts procurement queries. 
Extract the following information from the user's query and return it as a JSON object:

- product_category: The category of the automotive part (e.g., brakes, filters, engine, etc.)
- product_name: The specific name of the product (e.g., brake pads, air filter, etc.)
- brand: The brand preference if mentioned
- quantity: The number of units needed (extract as number)
- urgency: The urgency level (high, medium, low) if mentioned
- price_preference: The price preference (budget, mid-range, premium) if mentioned

If any information is not mentioned, use null for that field.

Query: "${query}"

Return only the JSON object, no additional text.
`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that parses automotive parts queries and returns structured JSON data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 200
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Try to parse the JSON response
      try {
        const parsed = JSON.parse(content.trim());
        return {
          product_category: parsed.product_category || null,
          product_name: parsed.product_name || null,
          brand: parsed.brand || null,
          quantity: parsed.quantity || null,
          urgency: parsed.urgency || null,
          price_preference: parsed.price_preference || null
        };
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        return this.fallbackParse(query);
      }
    } catch (error) {
      console.error('Error parsing query with AI:', error);
      return this.fallbackParse(query);
    }
  }

  private fallbackParse(query: string): ParsedQuery {
    const lowerQuery = query.toLowerCase();
    
    // Mapeo de productos a categorías correctas
    const productToCategoryMap: Record<string, string> = {
      'brake pads': 'brakes',
      'brake pad': 'brakes',
      'brake rotor': 'brakes',
      'brake fluid': 'brakes',
      'brake hose': 'brakes',
      'master cylinder': 'brakes',
      'air filter': 'filters',
      'oil filter': 'filters',
      'cabin air filter': 'filters',
      'fuel filter': 'filters',
      'transmission filter': 'filters',
      'power steering filter': 'filters',
      'hydraulic filter': 'filters',
      'spark plug': 'engine',
      'alternator': 'electrical',
      'ignition coil': 'electrical',
      'engine kit': 'engine',
      'timing chain': 'engine',
      'crankshaft': 'engine',
      'camshaft': 'engine',
      'oil pump': 'engine',
      'engine block': 'engine',
      'suspension component': 'suspension',
      'shock absorber': 'suspension',
      'spring': 'suspension',
      'control arm': 'suspension',
      'battery': 'electrical',
      'led headlight': 'electrical',
      'wireless charger': 'electrical',
      'gps tracker': 'electrical',
      'solar panel': 'electrical',
      'fuel pump': 'fuel',
      'fuel injector': 'fuel',
      'fuel tank': 'fuel',
      'steering wheel': 'steering',
      'steering rack': 'steering',
      'tie rod': 'steering',
      'radiator': 'cooling',
      'water pump': 'cooling',
      'thermostat': 'cooling',
      'exhaust pipe': 'exhaust',
      'muffler': 'exhaust',
      'catalytic converter': 'exhaust',
      'clutch': 'transmission',
      'gearbox': 'transmission',
      'drive shaft': 'transmission'
    };
    
    // Buscar producto específico primero
    let product_name = null;
    let product_category = null;
    
    for (const [keyword, category] of Object.entries(productToCategoryMap)) {
      if (lowerQuery.includes(keyword)) {
        product_name = keyword;
        product_category = category;
        break;
      }
    }
    
    // Si no se encontró producto específico, buscar por categorías generales
    if (!product_category) {
      const categories = ['brakes', 'filters', 'engine', 'suspension', 'steering', 'fuel', 'interior', 'exterior', 'accessories', 'cooling', 'exhaust', 'transmission'];
      product_category = categories.find(cat => lowerQuery.includes(cat)) || null;
    }
    
    const brands = ['toyota', 'honda', 'nissan', 'ford', 'chevrolet', 'bmw', 'mercedes', 'audi', 'volkswagen', 'hyundai', 'kia', 'mazda'];
    const foundBrand = brands.find(brand => lowerQuery.includes(brand));
    
    // Extract quantity (look for numbers)
    const quantityMatch = lowerQuery.match(/(\d+)/);
    const quantity = quantityMatch ? parseInt(quantityMatch[1]) : null;
    
    // Extract urgency
    const urgency = lowerQuery.includes('urgent') || lowerQuery.includes('asap') ? 'high' :
                   lowerQuery.includes('soon') ? 'medium' : null;
    
    // Extract price preference
    const pricePreference = lowerQuery.includes('cheap') || lowerQuery.includes('budget') ? 'budget' :
                           lowerQuery.includes('premium') || lowerQuery.includes('high-end') ? 'premium' :
                           lowerQuery.includes('mid') ? 'mid-range' : null;

    return {
      product_category,
      product_name,
      brand: foundBrand || null,
      quantity,
      urgency,
      price_preference: pricePreference
    };
  }
} 