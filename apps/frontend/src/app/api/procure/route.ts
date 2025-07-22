import { NextRequest, NextResponse } from 'next/server';

// --- API Route ---
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Determine backend URL based on environment
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    
    // Forward request to backend MCP service
    const backendResponse = await fetch(`${backendUrl}/api/procure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!backendResponse.ok) {
      // If backend is not available, return a demo response for production
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({
          query: body.query,
          parsed_query: {
            product_category: 'brakes',
            product_name: 'brake pads',
            brand: 'Toyota Camry 2020',
            quantity: 50,
            urgency: null,
            price_preference: null
          },
          offers: [{
            supplier: {
              id: 'SUP-001',
              name: 'AutoParts Pro',
              specialization: 'brakes',
              location: 'Detroit, MI',
              rating: 4.8,
              delivery_time: '3-5 days',
              minimum_order: 10,
              bulk_discount: { '50+': 0.05, '100+': 0.10 },
              payment_terms: 'Net 30',
              shipping_cost: 15.00,
              free_shipping_threshold: 500.00
            },
            product: {
              sku: 'BRK-020',
              name: 'Brake Pads - Front Set',
              category: 'brakes',
              brand: 'Toyota',
              compatibility: ['Toyota Camry 2020', 'Toyota Camry 2019', 'Toyota Camry 2021'],
              specifications: { type: 'Ceramic', position: 'Front' },
              dimensions: { length: '155mm', width: '60mm', height: '18mm' },
              weight: '2.5kg',
              warranty: '24 months',
              certifications: ['ISO 9001', 'DOT Approved'],
              description: 'Premium ceramic brake pads for Toyota Camry 2020 front axle.'
            },
            price: 45.00,
            quantity_available: 1000,
            delivery_time: '3-5 days',
            total_cost: 2250.00,
            shipping_cost: 15.00,
            bulk_discount_applied: 0.05,
            final_price: 2152.50,
            score: 85
          }],
          total_offers: 1,
          best_offer: {
            supplier: {
              id: 'SUP-001',
              name: 'AutoParts Pro',
              specialization: 'brakes',
              location: 'Detroit, MI',
              rating: 4.8,
              delivery_time: '3-5 days',
              minimum_order: 10,
              bulk_discount: { '50+': 0.05, '100+': 0.10 },
              payment_terms: 'Net 30',
              shipping_cost: 15.00,
              free_shipping_threshold: 500.00
            },
            product: {
              sku: 'BRK-020',
              name: 'Brake Pads - Front Set',
              category: 'brakes',
              brand: 'Toyota',
              compatibility: ['Toyota Camry 2020', 'Toyota Camry 2019', 'Toyota Camry 2021'],
              specifications: { type: 'Ceramic', position: 'Front' },
              dimensions: { length: '155mm', width: '60mm', height: '18mm' },
              weight: '2.5kg',
              warranty: '24 months',
              certifications: ['ISO 9001', 'DOT Approved'],
              description: 'Premium ceramic brake pads for Toyota Camry 2020 front axle.'
            },
            price: 45.00,
            quantity_available: 1000,
            delivery_time: '3-5 days',
            total_cost: 2250.00,
            shipping_cost: 15.00,
            bulk_discount_applied: 0.05,
            final_price: 2152.50,
            score: 85
          },
          recommendations: [
            'AutoParts Pro offers the best solution for Brake Pads - Front Set compatible with Toyota Camry 2020 at a quantity of 50 for $2152.50 (unit: $45.00). Delivery: 3-5 days.',
            '🤖 MCP/A2A Demo: This is a simulated response showing how the MCP agents would coordinate to find the best brake pad solution for your Toyota Camry 2020.'
          ],
          processing_time: 150
        });
      }
      throw new Error('Backend service unavailable');
    }
    
    const response = await backendResponse.json();
    return NextResponse.json(response);
  } catch (error) {
    console.error('Frontend API error:', error);
    const message = (error as Error).message || 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 