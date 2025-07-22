"use client";
import React, { useState } from 'react';

type Offer = {
  supplier: {
    name: string;
    rating: number;
    bulk_discount: Record<string, number>;
    shipping_cost: number;
    free_shipping_threshold: number;
    delivery_time: string;
  };
  product: {
    name: string;
    sku: string;
    category: string;
    brand: string;
  };
  price: number;
  quantity_available: number;
  delivery_time: string;
  total_cost: number;
  shipping_cost: number;
  bulk_discount_applied: number;
  final_price: number;
  score: number;
};

const QUICK_EXAMPLES = [
  'I need to buy 50 brake pads for Toyota Camry 2020 models',
  'Looking for 100 air filters with delivery in less than a week',
  'Need 25 spark plugs for Honda Civic, 2019, NGK brand',
  'Searching for 75 oil filters, best price for bulk order',
  'Want 10 alternators for Ford F-150',
  '200 ceramic brake pads for BMW vehicles',
  '500 air filters from Bosch or Mann brands, any model',
  'URGENT: Need 50 ignition coils for Toyota Camry 2020 models',
  '10 sets of Engine Oil for Nissan Versa',
  '1000 suspension components for mixed brands',
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [aiRecommendations, setAIRecommendations] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearching(true);
    setError(null);
    setAIRecommendations(null);
    setOffers([]);
    try {
      const res = await fetch('/api/procure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: search,
        }),
      });
      if (!res.ok) throw new Error('Failed to fetch offers');
      const data = await res.json();
      setOffers(data.offers || []);
      setAIRecommendations((data.recommendations && data.recommendations.join('\n')) || null);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a2233] to-[#23344d] text-white font-sans">
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="inline-block"><svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M3 17V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" stroke="#7de2ff" strokeWidth="2"/><circle cx="7.5" cy="16.5" r="1.5" fill="#7de2ff"/><circle cx="16.5" cy="16.5" r="1.5" fill="#7de2ff"/></svg></span>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#7de2ff] to-[#ff6bcb] bg-clip-text text-transparent tracking-tight">B2B Automotive <span className="font-bold">Parts Procurement</span></h1>
          </div>
          <p className="text-lg text-blue-100">AI-Powered Agent-to-Agent Procurement System</p>
        </header>

        {/* Quick Examples */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-[#7de2ff] mb-3 tracking-wide">QUICK EXAMPLES</h2>
          <div className="flex flex-wrap gap-3">
            {QUICK_EXAMPLES.map((ex, i) => (
              <button
                key={i}
                className="bg-[#22304a] hover:bg-[#2a3c5c] text-white rounded-full px-5 py-2 text-sm font-medium shadow transition"
                onClick={() => setSearch(ex)}
                type="button"
              >
                {ex}
              </button>
            ))}
          </div>
        </section>

        {/* Search Form */}
        <section className="mb-10 bg-[#1c2940]/80 rounded-xl shadow-lg p-8 border border-[#2a3c5c]">
          <h2 className="text-2xl font-bold mb-6 text-center">Search for Parts</h2>
          <form className="max-w-2xl mx-auto" onSubmit={handleSearch}>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1 text-[#7de2ff]">WHAT DO YOU NEED?</label>
              <textarea
                className="w-full rounded-lg p-3 bg-[#22304a] text-white border border-[#2a3c5c] focus:outline-none focus:ring-2 focus:ring-[#7de2ff] resize-none"
                rows={3}
                placeholder="Describe your parts requirement... (e.g., I need 50 brake pads for Toyota Camry 2020 models)"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#7de2ff] to-[#ff6bcb] text-[#1a2233] font-bold rounded-full px-8 py-3 text-lg shadow-lg hover:scale-105 transition flex items-center gap-2 disabled:opacity-60"
                disabled={searching}
              >
                {searching ? (
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-[#1a2233] border-t-[#7de2ff] rounded-full"></span>
                ) : (
                  '🔍 SEARCH ACROSS SUPPLIERS'
                )}
              </button>
            </div>
          </form>
          {error && <div className="mt-4 text-red-400 font-bold">{error}</div>}
        </section>

        {/* AI Recommendations */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#7de2ff]">AI Recommendations</h2>
          <div className="bg-[#22304a] border-l-4 border-[#7de2ff] rounded-lg p-6 text-blue-100 min-h-[80px]">
            {searching ? (
              <span className="italic opacity-60">Loading AI recommendations...</span>
            ) : aiRecommendations ? (
              <ol className="list-decimal pl-4 space-y-2">
                {aiRecommendations.split(/\n\n|\n/).map((rec, i) => (
                  <li key={i} className="mb-1">{rec}</li>
                ))}
              </ol>
            ) : (
              <span className="italic opacity-60">AI recommendations will appear here after your search.</span>
            )}
          </div>
        </section>

        {/* Offers from Suppliers */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#7de2ff]">Offers from Suppliers</h2>
          <div className="bg-[#22304a] rounded-lg p-6 shadow-lg min-h-[120px]">
            {searching ? (
              <span className="italic opacity-60">Searching for supplier offers...</span>
            ) : offers.length > 0 ? (
              <div className="space-y-6">
                {offers.map((offer, i) => (
                  <div key={i} className={`border rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${offer.score === Math.max(...offers.map(o => o.score)) ? 'border-[#7de2ff] bg-[#1c2940]' : 'border-[#2a3c5c] bg-[#22304a]'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">{offer.supplier.name}</span>
                        {offer.score === Math.max(...offers.map(o => o.score)) && <span className="ml-2 px-2 py-0.5 bg-[#7de2ff] text-[#1a2233] text-xs font-bold rounded-full">BEST OFFER</span>}
                      </div>
                      <div className="text-sm text-blue-100">Product: <span className="font-semibold text-white">{offer.product.name}</span> | SKU: {offer.product.sku}</div>
                      <div className="text-sm text-blue-100">Available: <span className="text-white font-semibold">{offer.quantity_available} units</span> | Delivery: {offer.delivery_time}</div>
                      <div className="text-sm text-blue-100">Bulk Discount: {Math.round(offer.bulk_discount_applied * 100)}% | Rating: <span className="text-yellow-300">★ {offer.supplier.rating}/5.0</span></div>
                    </div>
                    <div className="flex flex-col items-end min-w-[120px]">
                      <div className="text-2xl font-extrabold text-[#7de2ff]">${offer.final_price.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                      <div className="text-xs text-blue-200">Unit: ${offer.price.toFixed(2)}</div>
                      <div className="text-xs text-blue-200">Shipping: {offer.shipping_cost === 0 ? '$0.00' : `$${offer.shipping_cost}`}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span className="italic opacity-60">Supplier offers will appear here after your search.</span>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
