import OpenAI from 'openai';
import { ParsedQuery } from '../types';

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    this.client = new OpenAI({ apiKey });
  }

  async parseQuery(query: string): Promise<ParsedQuery> {
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
    
    // Simple keyword-based parsing
    const categories = ['brakes', 'filters', 'engine', 'suspension', 'steering', 'fuel', 'interior', 'exterior', 'accessories', 'cooling', 'exhaust', 'transmission'];
    const foundCategory = categories.find(cat => lowerQuery.includes(cat));
    
    const brands = ['toyota', 'honda', 'nissan', 'ford', 'chevrolet', 'bmw', 'mercedes', 'audi', 'volkswagen', 'hyundai', 'kia', 'mazda'];
    const foundBrand = brands.find(brand => lowerQuery.includes(brand));
    
    // Extract quantity (look for numbers)
    const quantityMatch = lowerQuery.match(/(\d+)\s*(units?|pieces?|items?|pcs?)/i);
    const quantity = quantityMatch ? parseInt(quantityMatch[1]) : null;
    
    // Extract urgency
    const urgency = lowerQuery.includes('urgent') || lowerQuery.includes('asap') ? 'high' :
                   lowerQuery.includes('soon') ? 'medium' : null;
    
    // Extract price preference
    const pricePreference = lowerQuery.includes('cheap') || lowerQuery.includes('budget') ? 'budget' :
                           lowerQuery.includes('premium') || lowerQuery.includes('high-end') ? 'premium' :
                           lowerQuery.includes('mid') ? 'mid-range' : null;

    return {
      product_category: foundCategory || null,
      product_name: null,
      brand: foundBrand || null,
      quantity,
      urgency,
      price_preference: pricePreference
    };
  }
} 