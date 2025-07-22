import { NextResponse } from 'next/server';

export async function POST(req: any) {
  try {
    const body = await req.json();
    const query = body.query?.toLowerCase() || '';
    
    // Parse the query to determine product category and details
    let productCategory = 'brakes';
    let productName = 'brake pads';
    let brand = 'Toyota Camry 2020';
    let quantity = 50;
    let supplierName = 'AutoParts Pro';
    let supplierSpecialization = 'brakes';
    let sku = 'BRK-020';
    let price = 45.00;
    
    // Dynamic parsing based on query content
    if (query.includes('spark plug') || query.includes('ignition')) {
      productCategory = 'engine';
      productName = 'Spark Plugs - NGK';
      brand = 'Honda Civic 2019';
      quantity = 25;
      supplierName = 'Engine Masters';
      supplierSpecialization = 'engine';
      sku = 'ENG-001';
      price = 12.50;
    } else if (query.includes('air filter') || query.includes('oil filter')) {
      productCategory = 'filters';
      productName = 'Air Filter - Premium';
      brand = 'Universal';
      quantity = 500;
      supplierName = 'Filter King';
      supplierSpecialization = 'filters';
      sku = 'FLT-001';
      price = 8.75;
    } else if (query.includes('ignition coil')) {
      productCategory = 'electrical';
      productName = 'Ignition Coil Set';
      brand = 'Toyota Camry 2020';
      quantity = 50;
      supplierName = 'Electrical Solutions';
      supplierSpecialization = 'electrical';
      sku = 'ELC-001';
      price = 35.00;
    } else if (query.includes('suspension') || query.includes('shock')) {
      productCategory = 'suspension';
      productName = 'Shock Absorber Set';
      brand = 'Universal';
      quantity = 4;
      supplierName = 'Suspension Specialists';
      supplierSpecialization = 'suspension';
      sku = 'SUS-001';
      price = 85.00;
    }
    
    // Calculate pricing
    const totalCost = price * quantity;
    const bulkDiscount = quantity >= 100 ? 0.10 : quantity >= 50 ? 0.05 : 0;
    const shippingCost = totalCost >= 500 ? 0 : 15.00;
    const finalPrice = totalCost * (1 - bulkDiscount) + shippingCost;
    
    return NextResponse.json({
      query: body.query || "demo query",
      parsed_query: {
        product_category: productCategory,
        product_name: productName,
        brand: brand,
        quantity: quantity,
        urgency: null,
        price_preference: null
      },
      offers: [{
        supplier: {
          id: 'SUP-001',
          name: supplierName,
          specialization: supplierSpecialization,
          location: 'Detroit, MI',
          rating: 4.8,
          delivery_time: '3-5 days',
          minimum_order: 10,
          bulk_discount: { '50+': 0.05, '100+': 0.10 },
          payment_terms: 'Net 30',
          shipping_cost: shippingCost,
          free_shipping_threshold: 500.00
        },
        product: {
          sku: sku,
          name: productName,
          category: productCategory,
          brand: brand,
          compatibility: [brand, 'Universal'],
          specifications: { type: 'Premium', position: 'Front' },
          dimensions: { length: '155mm', width: '60mm', height: '18mm' },
          weight: '2.5kg',
          warranty: '24 months',
          certifications: ['ISO 9001', 'DOT Approved'],
          description: `Premium ${productName.toLowerCase()} for ${brand}.`
        },
        price: price,
        quantity_available: 1000,
        delivery_time: '3-5 days',
        total_cost: totalCost,
        shipping_cost: shippingCost,
        bulk_discount_applied: bulkDiscount,
        final_price: finalPrice,
        score: 85
      }],
      total_offers: 1,
      best_offer: {
        supplier: {
          id: 'SUP-001',
          name: supplierName,
          specialization: supplierSpecialization,
          location: 'Detroit, MI',
          rating: 4.8,
          delivery_time: '3-5 days',
          minimum_order: 10,
          bulk_discount: { '50+': 0.05, '100+': 0.10 },
          payment_terms: 'Net 30',
          shipping_cost: shippingCost,
          free_shipping_threshold: 500.00
        },
        product: {
          sku: sku,
          name: productName,
          category: productCategory,
          brand: brand,
          compatibility: [brand, 'Universal'],
          specifications: { type: 'Premium', position: 'Front' },
          dimensions: { length: '155mm', width: '60mm', height: '18mm' },
          weight: '2.5kg',
          warranty: '24 months',
          certifications: ['ISO 9001', 'DOT Approved'],
          description: `Premium ${productName.toLowerCase()} for ${brand}.`
        },
        price: price,
        quantity_available: 1000,
        delivery_time: '3-5 days',
        total_cost: totalCost,
        shipping_cost: shippingCost,
        bulk_discount_applied: bulkDiscount,
        final_price: finalPrice,
        score: 85
      },
      recommendations: [
        `${supplierName} offers the best solution for ${productName} compatible with ${brand} at a quantity of ${quantity} for $${finalPrice.toFixed(2)} (unit: $${price.toFixed(2)}). Delivery: 3-5 days.`,
        `🤖 MCP/A2A Demo: This is a simulated response showing how the MCP agents would coordinate to find the best ${productCategory} solution for your ${brand}.`
      ],
      processing_time: 150
    });
  } catch (error) {
    // Fallback response if parsing fails
    return NextResponse.json({
      query: "demo query",
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
} 