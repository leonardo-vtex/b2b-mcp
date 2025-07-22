import os
import json
import asyncio
from typing import Dict, List, Optional, Any
import openai
from dotenv import load_dotenv
from pydantic import BaseModel
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is required")

client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Pydantic models
class ProcurementRequest(BaseModel):
    query: str
    quantity: Optional[int] = None

class SupplierOffer(BaseModel):
    supplier_id: str
    supplier_name: str
    product_sku: str
    product_name: str
    unit_price: float
    total_price: float
    delivery_time: str
    rating: float
    bulk_discount: Optional[float] = None
    shipping_cost: float
    final_price: float

class ProcurementResponse(BaseModel):
    query: str
    parsed_query: Dict[str, Any]
    offers: List[SupplierOffer]
    recommendations: str
    total_offers: int
    processing_time: float

# Product class
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

# Global data storage
products = []
suppliers = []

def load_data():
    """Load product and supplier data"""
    global products, suppliers
    
    try:
        # Load products from all JSON files
        product_files = [
            "data/products.json",
            "data/products_extended.json", 
            "data/products_additional.json",
            "data/products_final.json"
        ]
        
        for file_path in product_files:
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        products.extend([Product(**item) for item in data])
                    else:
                        products.append(Product(**data))
        
        # Load suppliers
        with open("data/suppliers.json", 'r', encoding='utf-8') as f:
            suppliers_data = json.load(f)
            suppliers.extend(suppliers_data)
        
        logger.info(f"Loaded {len(products)} products and {len(suppliers)} suppliers")
        
    except Exception as e:
        logger.error(f"Error loading data: {e}")
        raise

# Load data on module import
load_data()

class ProcurementAgent:
    def __init__(self):
        self.products = products
        self.suppliers = suppliers
    
    async def _parse_query_with_ai(self, query: str) -> Dict[str, Any]:
        """Parse natural language query using OpenAI"""
        try:
            prompt = f"""
            Parse this automotive parts procurement query and extract key information.
            Return ONLY a JSON object with these fields:
            - product_category: brake, filter, engine, electrical, suspension, ignition, etc.
            - product_name: specific product name
            - brand: vehicle brand or part brand preference
            - quantity: number of units needed
            - urgency: high, medium, low
            - price_preference: budget, premium, mid-range, not mentioned
            
            Query: "{query}"
            
            JSON response:
            """
            
            response = await asyncio.to_thread(
                client.chat.completions.create,
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=200
            )
            
            content = response.choices[0].message.content.strip()
            # Extract JSON from response
            if content.startswith('```json'):
                content = content[7:-3]
            elif content.startswith('```'):
                content = content[3:-3]
            
            parsed = json.loads(content)
            logger.info(f"Parsed query: {parsed}")
            return parsed
            
        except Exception as e:
            logger.error(f"Error parsing query with AI: {e}")
            # Fallback parsing
            query_lower = query.lower()
            parsed = {
                "product_category": "general",
                "product_name": "auto parts",
                "brand": None,
                "quantity": None,
                "urgency": "medium",
                "price_preference": "not mentioned"
            }
            
            # Simple keyword detection
            if any(word in query_lower for word in ["brake", "pad", "rotor"]):
                parsed["product_category"] = "brakes"
            elif any(word in query_lower for word in ["filter", "air", "oil"]):
                parsed["product_category"] = "filters"
            elif any(word in query_lower for word in ["spark", "plug", "ignition"]):
                parsed["product_category"] = "ignition"
            
            return parsed
    
    def _find_matching_products(self, category: str, brand: Optional[str] = None) -> List[Product]:
        """Find products matching the criteria"""
        if not category or category.lower() in ["general", "not mentioned", "none"]:
            return self.products[:10]  # Return first 10 products as fallback
        
        category_lower = category.lower()
        matching_products = []
        
        for product in self.products:
            if category_lower in product.category.lower():
                if brand and brand.lower() not in ["not mentioned", "none"]:
                    if any(brand.lower() in comp.lower() for comp in product.compatibility):
                        matching_products.append(product)
                else:
                    matching_products.append(product)
        
        # If no exact matches, try fuzzy matching
        if not matching_products:
            for product in self.products:
                if (category_lower in product.name.lower() or 
                    category_lower in product.description.lower()):
                    matching_products.append(product)
        
        return matching_products[:5]  # Limit to 5 products
    
    def _get_supplier_offers(self, products: List[Product], quantity: int) -> List[SupplierOffer]:
        """Simulate getting offers from supplier agents"""
        offers = []
        
        for product in products:
            for supplier in self.suppliers:
                # Check if supplier specializes in this category
                if (supplier["specialization"].lower() in product.category.lower() or 
                    supplier["specialization"] == "general"):
                    
                    # Calculate pricing
                    base_price = 50.0  # Base price for all products
                    supplier_multiplier = supplier.get("price_multiplier", 1.0)
                    unit_price = base_price * supplier_multiplier
                    
                    # Apply bulk discounts
                    bulk_discount = 0.0
                    for threshold, discount in supplier.get("bulk_discount", {}).items():
                        if quantity >= int(threshold.replace("+", "")):
                            bulk_discount = discount
                            break
                    
                    total_price = unit_price * quantity * (1 - bulk_discount)
                    shipping_cost = supplier.get("shipping_cost", 25.0)
                    
                    # Free shipping threshold
                    if total_price >= supplier.get("free_shipping_threshold", 500.0):
                        shipping_cost = 0.0
                    
                    final_price = total_price + shipping_cost
                    
                    offer = SupplierOffer(
                        supplier_id=supplier["id"],
                        supplier_name=supplier["name"],
                        product_sku=product.sku,
                        product_name=product.name,
                        unit_price=round(unit_price, 2),
                        total_price=round(total_price, 2),
                        delivery_time=supplier["delivery_time"],
                        rating=supplier["rating"],
                        bulk_discount=bulk_discount,
                        shipping_cost=shipping_cost,
                        final_price=round(final_price, 2)
                    )
                    offers.append(offer)
        
        return offers
    
    async def process_procurement(self, request: ProcurementRequest) -> ProcurementResponse:
        """Process procurement request"""
        import time
        start_time = time.time()
        
        try:
            # Parse query
            parsed_query = await self._parse_query_with_ai(request.query)
            
            # Extract quantity
            quantity = request.quantity or parsed_query.get("quantity", 1)
            if isinstance(quantity, str) and quantity.isdigit():
                quantity = int(quantity)
            elif not isinstance(quantity, int):
                quantity = 1
            
            # Find matching products
            category = parsed_query.get("product_category", "general")
            brand = parsed_query.get("brand")
            matching_products = self._find_matching_products(category, brand)
            
            if not matching_products:
                return ProcurementResponse(
                    query=request.query,
                    parsed_query=parsed_query,
                    offers=[],
                    recommendations="No products found matching your criteria.",
                    total_offers=0,
                    processing_time=time.time() - start_time
                )
            
            # Get supplier offers
            offers = self._get_supplier_offers(matching_products, quantity)
            
            # Generate AI recommendations
            recommendations = await self._generate_recommendations(request.query, offers, parsed_query)
            
            processing_time = time.time() - start_time
            
            return ProcurementResponse(
                query=request.query,
                parsed_query=parsed_query,
                offers=offers,
                recommendations=recommendations,
                total_offers=len(offers),
                processing_time=round(processing_time, 2)
            )
            
        except Exception as e:
            logger.error(f"Error processing procurement request: {e}")
            raise
    
    async def _generate_recommendations(self, query: str, offers: List[SupplierOffer], parsed_query: Dict) -> str:
        """Generate AI-powered recommendations"""
        try:
            if not offers:
                return "No offers available for your request. Please try different search criteria."
            
            # Sort offers by final price
            sorted_offers = sorted(offers, key=lambda x: x.final_price)
            
            best_offer = sorted_offers[0]
            worst_offer = sorted_offers[-1]
            
            prompt = f"""
            Analyze these automotive parts offers and provide a brief recommendation.
            
            Query: "{query}"
            Parsed: {parsed_query}
            
            Best offer: {best_offer.supplier_name} - ${best_offer.final_price} (${best_offer.unit_price}/unit)
            Worst offer: {worst_offer.supplier_name} - ${worst_offer.final_price} (${worst_offer.unit_price}/unit)
            Total offers: {len(offers)}
            
            Provide a 2-3 sentence recommendation focusing on:
            1. Best value option
            2. Key considerations (delivery, quality, price)
            3. Any negotiation opportunities
            
            Recommendation:
            """
            
            response = await asyncio.to_thread(
                client.chat.completions.create,
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=150
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
            return f"Found {len(offers)} offers. Best price: ${min(offers, key=lambda x: x.final_price).final_price} from {min(offers, key=lambda x: x.final_price).supplier_name}."

# Initialize agent
agent = ProcurementAgent()

# Vercel serverless function handler
def handler(request):
    """Vercel serverless function handler"""
    from http.server import BaseHTTPRequestHandler
    import json
    
    class RequestHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path == "/api/health":
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                self.send_header("Access-Control-Allow-Headers", "Content-Type")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "healthy", "products": len(products), "suppliers": len(suppliers)}).encode())
            
            elif self.path.startswith("/api/products"):
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                self.send_header("Access-Control-Allow-Headers", "Content-Type")
                self.end_headers()
                
                # Parse limit parameter
                limit = 10
                if "limit=" in self.path:
                    try:
                        limit = int(self.path.split("limit=")[1].split("&")[0])
                    except:
                        pass
                
                products_data = []
                for product in products[:limit]:
                    products_data.append({
                        "sku": product.sku,
                        "name": product.name,
                        "category": product.category,
                        "brand": product.brand
                    })
                
                self.wfile.write(json.dumps({"products": products_data}).encode())
            
            elif self.path == "/api/suppliers":
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                self.send_header("Access-Control-Allow-Headers", "Content-Type")
                self.end_headers()
                self.wfile.write(json.dumps({"suppliers": suppliers}).encode())
            
            else:
                self.send_response(404)
                self.end_headers()
        
        def do_POST(self):
            if self.path == "/api/procure":
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                
                try:
                    data = json.loads(post_data.decode('utf-8'))
                    request_obj = ProcurementRequest(**data)
                    
                    # Process request
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    response = loop.run_until_complete(agent.process_procurement(request_obj))
                    loop.close()
                    
                    self.send_response(200)
                    self.send_header("Content-type", "application/json")
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                    self.send_header("Access-Control-Allow-Headers", "Content-Type")
                    self.end_headers()
                    self.wfile.write(response.json().encode())
                    
                except Exception as e:
                    logger.error(f"Error in POST /api/procure: {e}")
                    self.send_response(500)
                    self.send_header("Content-type", "application/json")
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": str(e)}).encode())
            
            else:
                self.send_response(404)
                self.end_headers()
        
        def do_OPTIONS(self):
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
    
    return RequestHandler(request)

# For local testing
if __name__ == "__main__":
    from http.server import HTTPServer
    server = HTTPServer(('localhost', 8000), handler)
    print("Server running on http://localhost:8000")
    server.serve_forever() 