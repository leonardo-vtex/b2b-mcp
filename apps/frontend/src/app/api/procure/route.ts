import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// --- Types ---
interface Product {
  sku: string;
  name: string;
  category: string;
  brand: string;
  compatibility: string[];
  specifications: Record<string, unknown>;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  weight: string;
  warranty: string;
  certifications: string[];
  description: string;
}

interface Supplier {
  id: string;
  name: string;
  specialization: string;
  location: string;
  rating: number;
  delivery_time: string;
  minimum_order: number;
  bulk_discount: Record<string, number>;
  payment_terms: string;
  shipping_cost: number;
  free_shipping_threshold: number;
}

interface SupplierOffer {
  supplier: Supplier;
  product: Product;
  price: number;
  quantity_available: number;
  delivery_time: string;
  total_cost: number;
  shipping_cost: number;
  bulk_discount_applied: number;
  final_price: number;
  score: number;
}

interface ProcurementRequest {
  query: string;
  quantity?: number;
  urgency?: string;
  price_preference?: string;
}

interface ParsedQuery {
  product_category: string | null;
  product_name: string | null;
  brand: string | null;
  quantity: number | null;
  urgency: string | null;
  price_preference: string | null;
}

interface ProcurementResponse {
  query: string;
  parsed_query: ParsedQuery;
  offers: SupplierOffer[];
  total_offers: number;
  best_offer?: SupplierOffer;
  recommendations: string[];
  processing_time: number;
}

// --- DataService ---
class DataService {
  private products: Product[] = [];
  private suppliers: Supplier[] = [];

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    try {
      // Load products from all JSON files
      const productFiles = [
        'data/products.json',
        'data/products_extended.json',
        'data/products_additional.json',
        'data/products_final.json',
      ];
      this.products = [];
      for (const file of productFiles) {
        try {
          const filePath = path.join(process.cwd(), file);
          if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (Array.isArray(data)) {
              this.products.push(...data);
            } else if (data.products && Array.isArray(data.products)) {
              this.products.push(...data.products);
            }
          }
        } catch (error) {
          // ignore
        }
      }
      // Load suppliers
      const suppliersPath = path.join(process.cwd(), 'data/suppliers.json');
      if (fs.existsSync(suppliersPath)) {
        const suppliersData = JSON.parse(fs.readFileSync(suppliersPath, 'utf8'));
        this.suppliers = Array.isArray(suppliersData) ? suppliersData : suppliersData.suppliers || [];
      }
    } catch (error) {
      // ignore
    }
  }

  getProducts(limit?: number): Product[] {
    return limit ? this.products.slice(0, limit) : this.products;
  }
  getSuppliers(): Supplier[] {
    return this.suppliers;
  }
  findProductsByCategory(category: string): Product[] {
    return this.products.filter(product =>
      product.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  findProductsByName(name: string): Product[] {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(name.toLowerCase()) ||
      product.sku.toLowerCase().includes(name.toLowerCase())
    );
  }
  getSuppliersBySpecialization(specialization: string): Supplier[] {
    return this.suppliers.filter(supplier =>
      supplier.specialization.toLowerCase().includes(specialization.toLowerCase())
    );
  }
}

// --- OpenAIService (only fallbackParse for Vercel demo) ---
class OpenAIService {
  async parseQuery(query: string): Promise<ParsedQuery> {
    return this.fallbackParse(query);
  }
  private fallbackParse(query: string): ParsedQuery {
    const lowerQuery = query.toLowerCase();
    const categories = ['brakes', 'filters', 'engine', 'suspension', 'steering', 'fuel', 'interior', 'exterior', 'accessories', 'cooling', 'exhaust', 'transmission', 'ignition'];
    const foundCategory = categories.find(cat => lowerQuery.includes(cat));
    const brands = ['toyota', 'honda', 'nissan', 'ford', 'chevrolet', 'bmw', 'mercedes', 'audi', 'volkswagen', 'hyundai', 'kia', 'mazda'];
    const foundBrand = brands.find(brand => lowerQuery.includes(brand));
    const quantityMatch = lowerQuery.match(/(\d+)/);
    const quantity = quantityMatch ? parseInt(quantityMatch[1]) : null;
    const urgency = lowerQuery.includes('urgent') || lowerQuery.includes('asap') ? 'high' : lowerQuery.includes('soon') ? 'medium' : null;
    const pricePreference = lowerQuery.includes('cheap') || lowerQuery.includes('budget') ? 'budget' : lowerQuery.includes('premium') || lowerQuery.includes('high-end') ? 'premium' : lowerQuery.includes('mid') ? 'mid-range' : null;
    // Try to extract product name (very basic)
    let product_name = null;
    for (const word of ['brake pad', 'air filter', 'spark plug', 'oil filter', 'alternator', 'ignition coil', 'engine kit', 'suspension component']) {
      if (lowerQuery.includes(word)) product_name = word;
    }
    return {
      product_category: foundCategory || null,
      product_name,
      brand: foundBrand || null,
      quantity,
      urgency,
      price_preference: pricePreference
    };
  }
}

// --- ProcurementService ---
class ProcurementService {
  private dataService: DataService;
  private openaiService: OpenAIService;
  constructor() {
    this.dataService = new DataService();
    this.openaiService = new OpenAIService();
  }
  async processProcurementRequest(request: ProcurementRequest): Promise<ProcurementResponse> {
    const startTime = Date.now();
    try {
      const parsedQuery = await this.openaiService.parseQuery(request.query);
      let matchingProducts = this.findMatchingProducts(parsedQuery);
      // --- MEJORA: Prioriza coincidencia exacta de nombre y compatibilidad ---
      if (parsedQuery.product_name && parsedQuery.brand) {
        const exact = matchingProducts.filter(product =>
          product.name.toLowerCase().includes(parsedQuery.product_name!.toLowerCase()) &&
          (product.compatibility?.some(c => c.toLowerCase().includes(parsedQuery.brand!.toLowerCase())) ||
           product.brand.toLowerCase().includes(parsedQuery.brand!.toLowerCase()))
        );
        if (exact.length > 0) matchingProducts = exact;
      } else if (parsedQuery.product_name) {
        const exact = matchingProducts.filter(product =>
          product.name.toLowerCase().includes(parsedQuery.product_name!.toLowerCase())
        );
        if (exact.length > 0) matchingProducts = exact;
      }
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
      const offers = this.getSupplierOffers(matchingProducts, request, parsedQuery);
      offers.sort((a, b) => b.score - a.score);
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
        recommendations: ['Internal error processing request.'],
        processing_time: 0
      };
    }
  }
  private findMatchingProducts(parsedQuery: ParsedQuery): Product[] {
    let matchingProducts: Product[] = [];
    if (parsedQuery.product_category) {
      matchingProducts = this.dataService.findProductsByCategory(parsedQuery.product_category);
    }
    if (matchingProducts.length === 0 && parsedQuery.product_name) {
      matchingProducts = this.dataService.findProductsByName(parsedQuery.product_name);
    }
    if (parsedQuery.brand && matchingProducts.length > 0) {
      matchingProducts = matchingProducts.filter(product =>
        product.brand.toLowerCase().includes(parsedQuery.brand!.toLowerCase()) ||
        product.compatibility.some(comp => comp.toLowerCase().includes(parsedQuery.brand!.toLowerCase()))
      );
    }
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
      const relevantSuppliers = this.dataService.getSuppliersBySpecialization(product.category);
      for (const supplier of relevantSuppliers) {
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
      'transmission': 150,
      'ignition': 60
    };
    const basePrice = basePrices[product.category] || 50;
    const supplierMultiplier = 0.8 + (supplier.rating / 5) * 0.4;
    return Math.round(basePrice * supplierMultiplier * 100) / 100;
  }
  private createSupplierOffer(product: Product, supplier: Supplier, basePrice: number, requestedQuantity: number, availableQuantity: number): SupplierOffer {
    const quantity = Math.min(requestedQuantity, availableQuantity);
    const totalCost = basePrice * quantity;
    let bulkDiscountApplied = 0;
    for (const [threshold, discount] of Object.entries(supplier.bulk_discount)) {
      const thresholdNum = parseInt(threshold.replace('+', ''));
      if (quantity >= thresholdNum) {
        bulkDiscountApplied = discount;
        break;
      }
    }
    const discountedCost = totalCost * (1 - bulkDiscountApplied);
    let shippingCost = supplier.shipping_cost;
    if (discountedCost >= supplier.free_shipping_threshold) {
      shippingCost = 0;
    }
    const finalPrice = discountedCost + shippingCost;
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
    const ratingScore = supplier.rating * 20;
    const priceScore = Math.max(0, 100 - (finalPrice / quantity) * 2);
    const discountScore = bulkDiscount * 50;
    return Math.round(ratingScore + priceScore + discountScore);
  }
  private generateRecommendations(offers: SupplierOffer[], parsedQuery: ParsedQuery): string[] {
    const recommendations: string[] = [];
    if (offers.length === 0) {
      recommendations.push('No offers found. Consider broadening your search criteria.');
      return recommendations;
    }
    const bestOffer = offers[0];
    if (bestOffer.final_price > 1000) {
      recommendations.push('Consider ordering in larger quantities to qualify for bulk discounts.');
    }
    if (bestOffer.supplier.rating >= 4.5) {
      recommendations.push(`Highly recommended supplier: ${bestOffer.supplier.name} (${bestOffer.supplier.rating}/5 rating)`);
    }
    if (parsedQuery.urgency === 'high') {
      recommendations.push('For urgent orders, consider suppliers with faster delivery times.');
    }
    if (parsedQuery.quantity && parsedQuery.quantity < 50) {
      recommendations.push('Consider ordering larger quantities to benefit from bulk pricing.');
    }
    return recommendations;
  }
}

// --- API Route ---
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const procurementService = new ProcurementService();
    const response = await procurementService.processProcurementRequest(body);
    return NextResponse.json(response);
  } catch (error) {
    const message = (error as Error).message || 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 