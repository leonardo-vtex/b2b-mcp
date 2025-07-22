import { DataService } from './dataService';
import { OpenAIService } from './openaiService';
import { Product, Supplier, SupplierOffer, ProcurementRequest, ProcurementResponse, ParsedQuery } from '../types';

export class ProcurementService {
  private dataService: DataService;
  private openaiService: OpenAIService;

  constructor() {
    this.dataService = new DataService();
    this.openaiService = new OpenAIService();
  }

  async processProcurementRequest(request: ProcurementRequest): Promise<ProcurementResponse> {
    const startTime = Date.now();
    
    try {
      // Parse the query using AI
      const parsedQuery = await this.openaiService.parseQuery(request.query);
      
      // Find matching products
      const matchingProducts = this.findMatchingProducts(parsedQuery);
      
      if (matchingProducts.length === 0) {
        return {
          query: request.query,
          parsed_query: parsedQuery,
          offers: [],
          total_offers: 0,
          recommendations: ['No products found matching your criteria. Please try a different search term.'],
          processing_time: Date.now() - startTime
        };
      }

      // Get supplier offers
      const offers = this.getSupplierOffers(matchingProducts, request, parsedQuery);
      
      // Sort offers by score
      offers.sort((a, b) => b.score - a.score);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(offers, parsedQuery);
      
      return {
        query: request.query,
        parsed_query: parsedQuery,
        offers,
        total_offers: offers.length,
        best_offer: offers.length > 0 ? offers[0] : undefined,
        recommendations,
        processing_time: Date.now() - startTime
      };
    } catch (error) {
      console.error('Error processing procurement request:', error);
      throw error;
    }
  }

  private findMatchingProducts(parsedQuery: ParsedQuery): Product[] {
    let matchingProducts: Product[] = [];

    // Search by category
    if (parsedQuery.product_category) {
      matchingProducts = this.dataService.findProductsByCategory(parsedQuery.product_category);
    }

    // Search by name if category search didn't yield results
    if (matchingProducts.length === 0 && parsedQuery.product_name) {
      matchingProducts = this.dataService.findProductsByName(parsedQuery.product_name);
    }

    // Search by brand if specified
    if (parsedQuery.brand && matchingProducts.length > 0) {
      matchingProducts = matchingProducts.filter(product => 
        product.brand.toLowerCase().includes(parsedQuery.brand!.toLowerCase()) ||
        product.compatibility.some(comp => comp.toLowerCase().includes(parsedQuery.brand!.toLowerCase()))
      );
    }

    // If still no results, try fuzzy matching
    if (matchingProducts.length === 0) {
      const allProducts = this.dataService.getProducts();
      const query = `${parsedQuery.product_category || ''} ${parsedQuery.product_name || ''}`.toLowerCase();
      
      matchingProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      );
    }

    return matchingProducts;
  }

  private getSupplierOffers(products: Product[], request: ProcurementRequest, parsedQuery: ParsedQuery): SupplierOffer[] {
    const offers: SupplierOffer[] = [];
    const quantity = request.quantity || parsedQuery.quantity || 1;

    for (const product of products) {
      // Find suppliers that can provide this product
      const relevantSuppliers = this.dataService.getSuppliersBySpecialization(product.category);
      
      for (const supplier of relevantSuppliers) {
        // Simulate pricing and availability
        const basePrice = this.generateBasePrice(product, supplier);
        const quantityAvailable = Math.floor(Math.random() * 1000) + 100;
        
        if (quantityAvailable >= quantity) {
          const offer = this.createSupplierOffer(product, supplier, basePrice, quantity, quantityAvailable);
          offers.push(offer);
        }
      }
    }

    return offers;
  }

  private generateBasePrice(product: Product, supplier: Supplier): number {
    // Base pricing logic based on product category and supplier rating
    const basePrices: Record<string, number> = {
      'brakes': 50,
      'filters': 15,
      'engine': 200,
      'suspension': 100,
      'steering': 80,
      'fuel': 60,
      'interior': 40,
      'exterior': 30,
      'accessories': 25,
      'cooling': 70,
      'exhaust': 90,
      'transmission': 150
    };

    const basePrice = basePrices[product.category] || 50;
    const supplierMultiplier = 0.8 + (supplier.rating / 5) * 0.4; // 0.8 to 1.2 range
    
    return Math.round(basePrice * supplierMultiplier * 100) / 100;
  }

  private createSupplierOffer(
    product: Product, 
    supplier: Supplier, 
    basePrice: number, 
    requestedQuantity: number, 
    availableQuantity: number
  ): SupplierOffer {
    const quantity = Math.min(requestedQuantity, availableQuantity);
    const totalCost = basePrice * quantity;
    
    // Calculate bulk discount
    let bulkDiscountApplied = 0;
    for (const [threshold, discount] of Object.entries(supplier.bulk_discount)) {
      const thresholdNum = parseInt(threshold.replace('+', ''));
      if (quantity >= thresholdNum) {
        bulkDiscountApplied = discount;
        break;
      }
    }
    
    const discountedCost = totalCost * (1 - bulkDiscountApplied);
    
    // Calculate shipping cost
    let shippingCost = supplier.shipping_cost;
    if (discountedCost >= supplier.free_shipping_threshold) {
      shippingCost = 0;
    }
    
    const finalPrice = discountedCost + shippingCost;
    
    // Calculate score based on multiple factors
    const score = this.calculateOfferScore(supplier, finalPrice, quantity, bulkDiscountApplied);
    
    return {
      supplier,
      product,
      price: basePrice,
      quantity_available: availableQuantity,
      delivery_time: supplier.delivery_time,
      total_cost: totalCost,
      shipping_cost: shippingCost,
      bulk_discount_applied: bulkDiscountApplied,
      final_price: finalPrice,
      score
    };
  }

  private calculateOfferScore(supplier: Supplier, finalPrice: number, quantity: number, bulkDiscount: number): number {
    // Score based on supplier rating, price, and bulk discount
    const ratingScore = supplier.rating * 20; // 0-100
    const priceScore = Math.max(0, 100 - (finalPrice / quantity) * 2); // Lower price = higher score
    const discountScore = bulkDiscount * 50; // 0-50
    
    return Math.round(ratingScore + priceScore + discountScore);
  }

  private generateRecommendations(offers: SupplierOffer[], parsedQuery: ParsedQuery): string[] {
    const recommendations: string[] = [];
    
    if (offers.length === 0) {
      recommendations.push('No offers found. Consider broadening your search criteria.');
      return recommendations;
    }

    const bestOffer = offers[0];
    
    // Price recommendations
    if (bestOffer.final_price > 1000) {
      recommendations.push('Consider ordering in larger quantities to qualify for bulk discounts.');
    }
    
    // Supplier recommendations
    if (bestOffer.supplier.rating >= 4.5) {
      recommendations.push(`Highly recommended supplier: ${bestOffer.supplier.name} (${bestOffer.supplier.rating}/5 rating)`);
    }
    
    // Delivery recommendations
    if (parsedQuery.urgency === 'high') {
      recommendations.push('For urgent orders, consider suppliers with faster delivery times.');
    }
    
    // Quantity recommendations
    if (parsedQuery.quantity && parsedQuery.quantity < 50) {
      recommendations.push('Consider ordering larger quantities to benefit from bulk pricing.');
    }

    return recommendations;
  }
} 