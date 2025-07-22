import { ParsedQuery, ProcurementRequest, ProcurementResponse, SupplierOffer } from '../../types';

export interface MCPAgent {
  id: string;
  name: string;
  specialization: string;
  processRequest(request: ProcurementRequest): Promise<SupplierOffer[]>;
}

export class MainProcurementAgent implements MCPAgent {
  id = 'main-procurement';
  name = 'Main Procurement Agent';
  specialization = 'procurement-coordination';

  private supplierAgents: MCPAgent[] = [];

  constructor() {
    this.initializeSupplierAgents();
  }

  private initializeSupplierAgents() {
    this.supplierAgents = [
      new SupplierAgent('SUP-001', 'AutoParts Pro', 'brakes'),
      new SupplierAgent('SUP-002', 'Filter King', 'filters'),
      new SupplierAgent('SUP-003', 'Engine Masters', 'engine'),
      new SupplierAgent('SUP-004', 'Electrical Solutions', 'electrical'),
      new SupplierAgent('SUP-005', 'Suspension Specialists', 'suspension'),
      new SupplierAgent('SUP-006', 'Cooling Systems Pro', 'cooling'),
      new SupplierAgent('SUP-007', 'Exhaust Experts', 'exhaust'),
      new SupplierAgent('SUP-008', 'Transmission Tech', 'transmission'),
      new SupplierAgent('SUP-009', 'Fuel Systems Plus', 'fuel'),
      new SupplierAgent('SUP-010', 'Steering Solutions', 'steering')
    ];
  }

  async processRequest(request: ProcurementRequest): Promise<SupplierOffer[]> {
    console.log(`🤖 Main Procurement Agent processing request: ${request.query}`);
    
    // Parse the query to understand requirements
    const parsedQuery = await this.parseQuery(request.query);
    
    // Find relevant supplier agents
    const relevantAgents = this.findRelevantAgents(parsedQuery);
    
    // Coordinate with supplier agents (A2A communication)
    const allOffers: SupplierOffer[] = [];
    
    for (const agent of relevantAgents) {
      try {
        console.log(`🤝 Coordinating with ${agent.name} (${agent.specialization})`);
        const agentOffers = await agent.processRequest(request);
        allOffers.push(...agentOffers);
      } catch (error) {
        console.error(`❌ Error communicating with ${agent.name}:`, error);
      }
    }
    
    // Sort offers by score
    allOffers.sort((a, b) => b.score - a.score);
    
    console.log(`✅ Main Procurement Agent found ${allOffers.length} offers`);
    return allOffers;
  }

  private findRelevantAgents(parsedQuery: ParsedQuery): MCPAgent[] {
    if (!parsedQuery.product_category) {
      return this.supplierAgents; // Return all agents if no specific category
    }
    
    return this.supplierAgents.filter(agent => 
      agent.specialization === parsedQuery.product_category
    );
  }

  private async parseQuery(query: string): Promise<ParsedQuery> {
    // This would use OpenAI for real parsing
    const lowerQuery = query.toLowerCase();
    
    const productToCategoryMap: Record<string, string> = {
      'brake pads': 'brakes',
      'brake pad': 'brakes',
      'brake rotor': 'brakes',
      'brake fluid': 'brakes',
      'air filter': 'filters',
      'oil filter': 'filters',
      'cabin air filter': 'filters',
      'spark plug': 'engine',
      'alternator': 'electrical',
      'ignition coil': 'electrical',
      'suspension': 'suspension',
      'shock absorber': 'suspension',
      'radiator': 'cooling',
      'exhaust': 'exhaust',
      'transmission': 'transmission',
      'fuel': 'fuel',
      'steering': 'steering'
    };
    
    let product_category = null;
    let product_name = null;
    
    for (const [keyword, category] of Object.entries(productToCategoryMap)) {
      if (lowerQuery.includes(keyword)) {
        product_name = keyword;
        product_category = category;
        break;
      }
    }
    
    const quantityMatch = lowerQuery.match(/(\d+)/);
    const quantity = quantityMatch ? parseInt(quantityMatch[1]) : null;
    
    const urgency = lowerQuery.includes('urgent') || lowerQuery.includes('asap') ? 'high' : null;
    
    const brands = ['toyota', 'honda', 'nissan', 'ford', 'chevrolet', 'bmw', 'mercedes', 'audi'];
    let brand = null;
    for (const b of brands) {
      if (lowerQuery.includes(b)) {
        brand = b.charAt(0).toUpperCase() + b.slice(1);
        break;
      }
    }
    
    return {
      product_category,
      product_name,
      brand,
      quantity,
      urgency,
      price_preference: null
    };
  }
}

export class SupplierAgent implements MCPAgent {
  constructor(
    public id: string,
    public name: string,
    public specialization: string
  ) {}

  async processRequest(request: ProcurementRequest): Promise<SupplierOffer[]> {
    console.log(`🏢 ${this.name} (${this.specialization}) processing request`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    
    // Generate offers based on specialization
    const offers: SupplierOffer[] = [];
    
    // Simulate different scenarios based on specialization
    if (this.specialization === 'brakes') {
      offers.push(this.generateBrakeOffer(request));
    } else if (this.specialization === 'filters') {
      offers.push(this.generateFilterOffer(request));
    } else if (this.specialization === 'engine') {
      offers.push(this.generateEngineOffer(request));
    } else if (this.specialization === 'electrical') {
      offers.push(this.generateElectricalOffer(request));
    } else if (this.specialization === 'suspension') {
      offers.push(this.generateSuspensionOffer(request));
    }
    
    console.log(`✅ ${this.name} generated ${offers.length} offers`);
    return offers;
  }

  private generateBrakeOffer(request: ProcurementRequest): SupplierOffer {
    return {
      supplier: {
        id: this.id,
        name: this.name,
        specialization: this.specialization,
        location: 'New York',
        rating: 4.5,
        delivery_time: '3-5 days',
        minimum_order: 10,
        bulk_discount: { '50': 0.05, '100': 0.10, '200': 0.15 },
        payment_terms: 'Net 30',
        shipping_cost: 15.00,
        free_shipping_threshold: 500.00
      },
      product: {
        name: 'Brake Pads - Front Set',
        sku: 'BRK-001',
        category: 'brakes',
        brand: 'Toyota'
      },
      price: 45.00,
      quantity_available: 1000,
      delivery_time: '3-5 days',
      total_cost: 45.00,
      shipping_cost: 15.00,
      bulk_discount_applied: 0.05,
      final_price: 42.75,
      score: 85
    };
  }

  private generateFilterOffer(request: ProcurementRequest): SupplierOffer {
    return {
      supplier: {
        id: this.id,
        name: this.name,
        specialization: this.specialization,
        location: 'Los Angeles',
        rating: 4.3,
        delivery_time: '2-4 days',
        minimum_order: 5,
        bulk_discount: { '25': 0.03, '50': 0.07, '100': 0.12 },
        payment_terms: 'Net 30',
        shipping_cost: 12.00,
        free_shipping_threshold: 300.00
      },
      product: {
        name: 'Air Filter - Premium',
        sku: 'FLT-001',
        category: 'filters',
        brand: 'Universal'
      },
      price: 18.00,
      quantity_available: 500,
      delivery_time: '2-4 days',
      total_cost: 18.00,
      shipping_cost: 12.00,
      bulk_discount_applied: 0.03,
      final_price: 17.46,
      score: 78
    };
  }

  private generateEngineOffer(request: ProcurementRequest): SupplierOffer {
    return {
      supplier: {
        id: this.id,
        name: this.name,
        specialization: this.specialization,
        location: 'Chicago',
        rating: 4.7,
        delivery_time: '5-7 days',
        minimum_order: 1,
        bulk_discount: { '10': 0.08, '25': 0.15, '50': 0.20 },
        payment_terms: 'Net 30',
        shipping_cost: 25.00,
        free_shipping_threshold: 1000.00
      },
      product: {
        name: 'Spark Plugs - Iridium',
        sku: 'ENG-001',
        category: 'engine',
        brand: 'NGK'
      },
      price: 12.00,
      quantity_available: 200,
      delivery_time: '5-7 days',
      total_cost: 12.00,
      shipping_cost: 25.00,
      bulk_discount_applied: 0.08,
      final_price: 11.04,
      score: 82
    };
  }

  private generateElectricalOffer(request: ProcurementRequest): SupplierOffer {
    return {
      supplier: {
        id: this.id,
        name: this.name,
        specialization: this.specialization,
        location: 'Miami',
        rating: 4.2,
        delivery_time: '4-6 days',
        minimum_order: 5,
        bulk_discount: { '20': 0.06, '50': 0.12, '100': 0.18 },
        payment_terms: 'Net 30',
        shipping_cost: 18.00,
        free_shipping_threshold: 400.00
      },
      product: {
        name: 'Ignition Coil',
        sku: 'ELC-001',
        category: 'electrical',
        brand: 'Bosch'
      },
      price: 35.00,
      quantity_available: 150,
      delivery_time: '4-6 days',
      total_cost: 35.00,
      shipping_cost: 18.00,
      bulk_discount_applied: 0.06,
      final_price: 32.90,
      score: 76
    };
  }

  private generateSuspensionOffer(request: ProcurementRequest): SupplierOffer {
    return {
      supplier: {
        id: this.id,
        name: this.name,
        specialization: this.specialization,
        location: 'Detroit',
        rating: 4.6,
        delivery_time: '3-5 days',
        minimum_order: 2,
        bulk_discount: { '10': 0.05, '25': 0.10, '50': 0.15 },
        payment_terms: 'Net 30',
        shipping_cost: 20.00,
        free_shipping_threshold: 600.00
      },
      product: {
        name: 'Front Shock Absorber',
        sku: 'SUS-001',
        category: 'suspension',
        brand: 'Monroe'
      },
      price: 85.00,
      quantity_available: 75,
      delivery_time: '3-5 days',
      total_cost: 85.00,
      shipping_cost: 20.00,
      bulk_discount_applied: 0.05,
      final_price: 80.75,
      score: 88
    };
  }
} 