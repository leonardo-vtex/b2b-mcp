export interface Product {
  sku: string;
  name: string;
  category: string;
  brand: string;
  compatibility: string[];
  specifications: Record<string, any>;
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

export interface Supplier {
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

export interface SupplierOffer {
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

export interface ProcurementRequest {
  query: string;
  quantity?: number;
  urgency?: string;
  price_preference?: string;
}

export interface ParsedQuery {
  product_category: string | null;
  product_name: string | null;
  brand: string | null;
  quantity: number | null;
  urgency: string | null;
  price_preference: string | null;
}

export interface ProcurementResponse {
  query: string;
  parsed_query: ParsedQuery;
  offers: SupplierOffer[];
  total_offers: number;
  best_offer?: SupplierOffer;
  recommendations: string[];
  processing_time: number;
} 