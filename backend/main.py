#!/usr/bin/env python3
"""
B2B Automotive Parts Procurement MCP Server
Main procurement agent that coordinates with 10 seller agents
"""

import asyncio
import json
import logging
import os
from typing import Any, Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime
import openai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is required")

# Initialize OpenAI client
client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Load product and supplier data
def load_data():
    """Load product and supplier data from JSON files"""
    try:
        with open("data/products.json", "r") as f:
            products_data = json.load(f)
        
        with open("data/products_extended.json", "r") as f:
            extended_products = json.load(f)
        
        with open("data/products_additional.json", "r") as f:
            additional_products = json.load(f)
        
        with open("data/products_final.json", "r") as f:
            final_products = json.load(f)
        
        with open("data/suppliers.json", "r") as f:
            suppliers_data = json.load(f)
        
        # Combine all products
        all_products = products_data["products"] + extended_products["products"] + additional_products["products"] + final_products["products"]
        
        return all_products, suppliers_data["suppliers"]
    except FileNotFoundError as e:
        logger.error(f"Data file not found: {e}")
        return [], []

# Data models
class ProcurementRequest(BaseModel):
    query: str
    quantity: Optional[int] = None
    sku: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    max_price: Optional[float] = None
    delivery_priority: Optional[str] = "standard"  # standard, express, economy

class SupplierOffer(BaseModel):
    supplier_id: str
    supplier_name: str
    sku: str
    product_name: str
    unit_price: float
    quantity_available: int
    delivery_days: int
    shipping_cost: float
    total_cost: float
    bulk_discount: float
    supplier_rating: float
    payment_terms: str

class ProcurementResponse(BaseModel):
    request_id: str
    query: str
    offers: List[SupplierOffer]
    best_offer: Optional[SupplierOffer]
    total_suppliers_contacted: int
    processing_time: float
    recommendations: List[str]

class Product:
    def __init__(self, **kwargs):
        self.sku = kwargs.get('sku', '')
        self.name = kwargs.get('name', '')
        self.category = kwargs.get('category', '')
        self.brand = kwargs.get('brand', '')
        self.compatibility = kwargs.get('compatibility', [])
        self.specifications = kwargs.get('specifications', {})
        self.dimensions = kwargs.get('dimensions', {})
        self.weight = kwargs.get('weight', '')
        self.warranty = kwargs.get('warranty', '')
        self.certifications = kwargs.get('certifications', [])
        self.description = kwargs.get('description', '')
        
    def __repr__(self):
        return f"Product(sku='{self.sku}', name='{self.name}', category='{self.category}')"

@dataclass
class Supplier:
    id: str
    name: str
    specialization: str
    location: str
    rating: float
    delivery_time: str
    minimum_order: int
    bulk_discount: Dict[str, float]
    payment_terms: str
    shipping_cost: float
    free_shipping_threshold: float

class ProcurementAgent:
    """Main procurement agent that coordinates with seller agents"""
    
    def __init__(self):
        self.products, self.suppliers = load_data()
        self.products_dict = {p["sku"]: p for p in self.products}
        self.suppliers_dict = {s["id"]: s for s in self.suppliers}
        logger.info(f"Loaded {len(self.products)} products and {len(self.suppliers)} suppliers")
    
    async def process_query(self, request: ProcurementRequest) -> ProcurementResponse:
        """Process procurement query using OpenAI and coordinate with suppliers"""
        start_time = datetime.now()
        
        # Parse query using OpenAI
        parsed_query = await self._parse_query_with_ai(request.query)
        
        # Find matching products
        matching_products = self._find_matching_products(parsed_query)
        
        if not matching_products:
            return ProcurementResponse(
                request_id=f"REQ_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                query=request.query,
                offers=[],
                best_offer=None,
                total_suppliers_contacted=0,
                processing_time=(datetime.now() - start_time).total_seconds(),
                recommendations=["No products found matching your criteria"]
            )
        
        # Get offers from all suppliers
        all_offers = []
        for product in matching_products:
            offers = await self._get_supplier_offers(product, request)
            all_offers.extend(offers)
        
        # Sort offers by total cost
        all_offers.sort(key=lambda x: x.total_cost)
        
        # Get AI recommendations
        recommendations = await self._get_ai_recommendations(request, all_offers)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return ProcurementResponse(
            request_id=f"REQ_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            query=request.query,
            offers=all_offers[:10],  # Top 10 offers
            best_offer=all_offers[0] if all_offers else None,
            total_suppliers_contacted=len(self.suppliers),
            processing_time=processing_time,
            recommendations=recommendations
        )
    
    async def _parse_query_with_ai(self, query: str) -> Dict[str, Any]:
        """Use OpenAI to parse and understand the procurement query"""
        try:
            response = await asyncio.to_thread(
                client.chat.completions.create,
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": """You are a procurement assistant for automotive parts. 
                        Parse the user's query and extract the following information:
                        - product_category (brakes, filters, engine, etc.)
                        - product_name (specific part name)
                        - brand (if mentioned)
                        - quantity (number of units)
                        - urgency (high, medium, low)
                        - price_preference (budget, mid-range, premium)
                        
                        Return as JSON with these fields."""
                    },
                    {
                        "role": "user",
                        "content": query
                    }
                ],
                temperature=0.1
            )
            
            parsed = json.loads(response.choices[0].message.content)
            logger.info(f"Parsed query: {parsed}")
            return parsed
            
        except Exception as e:
            logger.error(f"Error parsing query with AI: {e}")
            # Fallback parsing
            query_lower = query.lower()
            category = "general"
            product_name = query
            
            # Simple keyword-based category detection
            if any(word in query_lower for word in ["brake", "pad", "rotor", "caliper"]):
                category = "brakes"
            elif any(word in query_lower for word in ["filter", "air", "oil", "fuel"]):
                category = "filters"
            elif any(word in query_lower for word in ["engine", "piston", "valve", "cam"]):
                category = "engine"
            elif any(word in query_lower for word in ["ignition", "spark", "coil", "plug"]):
                category = "ignition"
            elif any(word in query_lower for word in ["suspension", "shock", "strut", "spring"]):
                category = "suspension"
            elif any(word in query_lower for word in ["electrical", "battery", "alternator", "starter"]):
                category = "electrical"
            
            return {
                "product_category": category,
                "product_name": query,
                "brand": "",
                "quantity": 1,
                "urgency": "medium",
                "price_preference": "mid-range"
            }
    
    def _find_matching_products(self, parsed_query: Dict[str, Any]) -> List[Product]:
        """Find products matching the parsed query"""
        matching_products = []
        query_lower = parsed_query.get("product_name", "").lower()
        
        for product_data in self.products:
            try:
                product = Product(**product_data)
                
                # Match by category
                if parsed_query.get("product_category") and parsed_query["product_category"] != "general":
                    if parsed_query["product_category"].lower() not in product.category.lower():
                        continue
                
                # Match by product name
                if parsed_query.get("product_name"):
                    if parsed_query["product_name"].lower() not in product.name.lower():
                        continue
                
                # Match by brand
                if parsed_query.get("brand"):
                    if parsed_query["brand"].lower() not in product.brand.lower():
                        continue
                
                matching_products.append(product)
            except Exception as e:
                logger.warning(f"Error creating Product from data: {e}")
                continue
        
        # If no matches found and we have a query, try fuzzy matching
        if not matching_products and query_lower:
            for product_data in self.products:
                try:
                    product = Product(**product_data)
                    # Check if any part of the query appears in product name or category
                    if (query_lower in product.name.lower() or 
                        query_lower in product.category.lower() or
                        any(word in product.name.lower() for word in query_lower.split())):
                        matching_products.append(product)
                except Exception as e:
                    continue
        
        return matching_products[:5]  # Limit to top 5 matches
    
    async def _get_supplier_offers(self, product: Product, request: ProcurementRequest) -> List[SupplierOffer]:
        """Simulate getting offers from all suppliers for a product"""
        offers = []
        quantity = request.quantity or 1
        
        for supplier_data in self.suppliers:
            supplier = Supplier(**supplier_data)
            
            # Simulate supplier inventory and pricing
            base_price = self._get_base_price(product, supplier)
            available_quantity = self._get_available_quantity(product, supplier)
            
            if available_quantity < quantity:
                continue
            
            # Calculate bulk discount
            discount = self._calculate_bulk_discount(quantity, supplier.bulk_discount)
            unit_price = base_price * (1 - discount)
            
            # Calculate shipping
            subtotal = unit_price * quantity
            shipping_cost = 0 if subtotal >= supplier.free_shipping_threshold else supplier.shipping_cost
            
            # Calculate delivery time
            delivery_days = self._parse_delivery_time(supplier.delivery_time)
            
            offer = SupplierOffer(
                supplier_id=supplier.id,
                supplier_name=supplier.name,
                sku=product.sku,
                product_name=product.name,
                unit_price=unit_price,
                quantity_available=available_quantity,
                delivery_days=delivery_days,
                shipping_cost=shipping_cost,
                total_cost=subtotal + shipping_cost,
                bulk_discount=discount,
                supplier_rating=supplier.rating,
                payment_terms=supplier.payment_terms
            )
            
            offers.append(offer)
        
        return offers
    
    def _get_base_price(self, product: Product, supplier: Supplier) -> float:
        """Get base price for a product from a supplier"""
        # Simulate different pricing strategies based on supplier specialization
        base_prices = {
            "brakes": 45.0,
            "filters": 12.0,
            "engine": 85.0,
            "electrical": 65.0,
            "suspension": 120.0,
            "ignition": 35.0,
            "transmission": 150.0,
            "exhaust": 95.0,
            "cooling": 75.0,
            "steering": 110.0,
            "fuel_system": 55.0,
            "interior": 45.0,
            "exterior": 180.0,
            "accessories": 25.0
        }
        
        base_price = base_prices.get(product.category, 50.0)
        
        # Add supplier-specific pricing variations
        supplier_multipliers = {
            "supplier_1": 1.0,   # Standard pricing
            "supplier_2": 1.1,   # Premium pricing
            "supplier_3": 0.9,   # Competitive pricing
            "supplier_4": 1.05,  # Slightly premium
            "supplier_5": 0.95,  # Slightly competitive
            "supplier_6": 1.0,   # Standard pricing
            "supplier_7": 1.15,  # Premium pricing
            "supplier_8": 0.85,  # Very competitive
            "supplier_9": 1.0,   # Standard pricing
            "supplier_10": 0.9   # Competitive pricing
        }
        
        return base_price * supplier_multipliers.get(supplier.id, 1.0)
    
    def _get_available_quantity(self, product: Product, supplier: Supplier) -> int:
        """Get available quantity from supplier"""
        # Simulate inventory levels
        import random
        base_quantities = {
            "brakes": 200,
            "filters": 500,
            "engine": 50,
            "electrical": 150,
            "suspension": 80,
            "ignition": 300,
            "transmission": 30,
            "exhaust": 100,
            "cooling": 120,
            "steering": 90,
            "fuel_system": 180,
            "interior": 250,
            "exterior": 60,
            "accessories": 400
        }
        
        base_qty = base_quantities.get(product.category, 100)
        return random.randint(base_qty * 0.3, base_qty * 1.2)
    
    def _calculate_bulk_discount(self, quantity: int, discount_tiers: Dict[str, float]) -> float:
        """Calculate bulk discount based on quantity"""
        discount = 0.0
        
        for tier, tier_discount in discount_tiers.items():
            min_qty = int(tier.replace("+", ""))
            if quantity >= min_qty:
                discount = max(discount, tier_discount)
        
        return discount
    
    def _parse_delivery_time(self, delivery_time: str) -> int:
        """Parse delivery time string to number of days"""
        if "1-2" in delivery_time:
            return 2
        elif "2-3" in delivery_time:
            return 3
        elif "3-4" in delivery_time:
            return 4
        elif "3-5" in delivery_time:
            return 4
        elif "4-6" in delivery_time:
            return 5
        else:
            return 3
    
    async def _get_ai_recommendations(self, request: ProcurementRequest, offers: List[SupplierOffer]) -> List[str]:
        """Get AI-powered recommendations for the procurement decision"""
        if not offers:
            return ["No offers available for your request"]
        
        try:
            offers_summary = []
            for offer in offers[:5]:  # Top 5 offers
                offers_summary.append(f"{offer.supplier_name}: ${offer.total_cost:.2f} ({offer.delivery_days} days)")
            
            response = await asyncio.to_thread(
                client.chat.completions.create,
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a procurement expert. Provide 2-3 concise recommendations based on the offers provided."
                    },
                    {
                        "role": "user",
                        "content": f"Query: {request.query}\nOffers: {', '.join(offers_summary)}\nProvide procurement recommendations."
                    }
                ],
                temperature=0.3
            )
            
            recommendations = response.choices[0].message.content.split('\n')
            return [rec.strip() for rec in recommendations if rec.strip()]
            
        except Exception as e:
            logger.error(f"Error getting AI recommendations: {e}")
            return ["Consider the best balance of price, delivery time, and supplier rating"]

# Initialize FastAPI app
app = FastAPI(title="B2B Automotive Parts Procurement MCP", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

procurement_agent = ProcurementAgent()

@app.post("/procure", response_model=ProcurementResponse)
async def procure_parts(request: ProcurementRequest):
    """Main procurement endpoint"""
    try:
        response = await procurement_agent.process_query(request)
        return response
    except Exception as e:
        logger.error(f"Error processing procurement request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/products")
async def get_products(category: Optional[str] = None, limit: int = 50):
    """Get available products"""
    products = procurement_agent.products
    if category:
        products = [p for p in products if category.lower() in p["category"].lower()]
    
    return {"products": products[:limit], "total": len(products)}

@app.get("/suppliers")
async def get_suppliers():
    """Get available suppliers"""
    return {"suppliers": procurement_agent.suppliers}

@app.post("/debug")
async def debug_query(request: ProcurementRequest):
    """Debug endpoint to test query parsing and product matching"""
    try:
        # Parse query using OpenAI
        parsed_query = await procurement_agent._parse_query_with_ai(request.query)
        
        # Find matching products
        matching_products = procurement_agent._find_matching_products(parsed_query)
        
        return {
            "original_query": request.query,
            "parsed_query": parsed_query,
            "matching_products_count": len(matching_products),
            "matching_products": [{"sku": p.sku, "name": p.name, "category": p.category} for p in matching_products],
            "total_products": len(procurement_agent.products),
            "total_suppliers": len(procurement_agent.suppliers)
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 