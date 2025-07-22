import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }
    // Simulación de recomendaciones
    const recommendations = [
      'Consider negotiating with suppliers for better pricing.',
      'Check for bulk discounts or free shipping options.',
      'Prioritize suppliers with higher ratings and faster delivery.'
    ];
    return NextResponse.json({ recommendations });
  } catch (error) {
    const message = (error as Error).message || 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 