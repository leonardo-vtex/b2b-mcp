import { MainProcurementAgent } from './mcp/mcpAgent';
import { ProcurementRequest, ProcurementResponse } from '../types';

export class MCPService {
  private mainAgent: MainProcurementAgent;

  constructor() {
    this.mainAgent = new MainProcurementAgent();
  }

  async processProcurementRequest(request: ProcurementRequest): Promise<ProcurementResponse> {
    const startTime = Date.now();
    
    try {
      console.log('🚀 MCP Service starting procurement request');
      
      // Use the main procurement agent to coordinate with supplier agents
      const offers = await this.mainAgent.processRequest(request);
      
      // Generate recommendations based on offers
      const recommendations = this.generateRecommendations(offers, request);
      
      const processingTime = Date.now() - startTime;
      
      console.log(`✅ MCP Service completed in ${processingTime}ms`);
      
      return {
        query: request.query,
        parsed_query: {
          product_category: null, // Will be filled by agent
          product_name: null,
          brand: null,
          quantity: null,
          urgency: null,
          price_preference: null
        },
        offers,
        total_offers: offers.length,
        best_offer: offers.length > 0 ? offers[0] : undefined,
        recommendations,
        processing_time: processingTime
      };
    } catch (error) {
      console.error('❌ MCP Service error:', error);
      return {
        query: request.query,
        parsed_query: {
          product_category: null,
          product_name: null,
          brand: null,
          quantity: null,
          urgency: null,
          price_preference: null
        },
        offers: [],
        total_offers: 0,
        recommendations: ['Error processing request through MCP agents.'],
        processing_time: Date.now() - startTime
      };
    }
  }

  private generateRecommendations(offers: any[], request: ProcurementRequest): string[] {
    const recommendations: string[] = [];
    
    if (offers.length === 0) {
      recommendations.push('No offers found from MCP agents. Consider broadening your search criteria.');
      return recommendations;
    }
    
    const bestOffer = offers[0];
    
    // Main recommendation
    recommendations.push(
      `${bestOffer.supplier.name} (${bestOffer.supplier.specialization} specialist) offers the best solution for ${bestOffer.product.name} at $${bestOffer.final_price.toFixed(2)}. Delivery: ${bestOffer.delivery_time}.`
    );
    
    // Alternative if available
    if (offers.length > 1) {
      const alt = offers[1];
      recommendations.push(
        `${alt.supplier.name} is an alternative for ${alt.product.name} at $${alt.final_price.toFixed(2)}. Delivery: ${alt.delivery_time}.`
      );
    }
    
    // MCP-specific recommendation
    recommendations.push('Multiple MCP agents were coordinated to find the best offers for your request.');
    
    return recommendations;
  }
} 