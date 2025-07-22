"use client";

import React, { useState } from 'react';

const QUICK_EXAMPLES = [
  'I need to buy 50 brake pads for Toyota…',
  'Looking for 100 air filters with delivery…',
  'Need 25 spark plugs for Honda Civic, …',
  'Searching for 75 oil filters, best price f…',
  'Want 10 alternators for Ford F-150, n…',
  '200 premium brake pads for BMW ve…',
  '500 air filters from Bosch or Mann bra…',
  'URGENT: Need 50 ignition coils for T…',
  'Complete engine maintenance kit: 10…',
  '1000 suspension components with 2-…',
];

const MOCK_AI_RECOMMENDATIONS = `1. Exhaust Masters offers the most cost-effective solution at $897.60 for 100 air filters with a delivery time of 4 days. This meets the delivery requirement and offers the best price.\n\n2. Steering Solutions is a viable alternative if, for any reason, Exhaust Masters cannot fulfill the order. However, their offer is slightly more expensive at $928.80 for the same quantity and delivery time.\n\n3. It may be beneficial to negotiate with both suppliers for a better price or faster delivery time, given the volume of the order.`;

const MOCK_OFFERS = [
  {
    supplier: 'Exhaust Masters',
    best: true,
    product: 'Engine Air Filter',
    sku: 'FLT-001',
    unitPrice: 8.98,
    available: 421,
    delivery: '4 days',
    shipping: 0,
    bulkDiscount: '12.0%',
    rating: 4.4,
    total: 897.60,
  },
  {
    supplier: 'Exhaust Masters',
    best: true,
    product: 'Cabin Air Filter',
    sku: 'FLT-003',
    unitPrice: 8.98,
    available: 325,
    delivery: '4 days',
    shipping: 0,
    bulkDiscount: '12.0%',
    rating: 4.4,
    total: 897.60,
  },
  {
    supplier: 'Steering Solutions',
    best: false,
    product: 'Engine Air Filter',
    sku: 'FLT-001',
    unitPrice: 9.29,
    available: 300,
    delivery: '4 days',
    shipping: 0,
    bulkDiscount: '10.0%',
    rating: 4.2,
    total: 928.80,
  },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [maxPrice, setMaxPrice] = useState('');
  const [priority, setPriority] = useState('Standard');
  const [aiRecommendations, setAIRecommendations] = useState<string | null>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearching(true);
    setTimeout(() => {
      setAIRecommendations(MOCK_AI_RECOMMENDATIONS);
      setOffers(MOCK_OFFERS);
      setSearching(false);
    }, 1200);
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
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto" onSubmit={handleSearch}>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1 text-[#7de2ff]">WHAT DO YOU NEED?</label>
              <textarea
                className="w-full rounded-lg p-3 bg-[#22304a] text-white border border-[#2a3c5c] focus:outline-none focus:ring-2 focus:ring-[#7de2ff] resize-none"
                rows={2}
                placeholder="Describe your parts requirement..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#7de2ff]">QUANTITY</label>
              <input
                type="number"
                min="1"
                className="w-full rounded-lg p-3 bg-[#22304a] text-white border border-[#2a3c5c] focus:outline-none focus:ring-2 focus:ring-[#7de2ff]"
                placeholder="e.g. 50"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#7de2ff]">CATEGORY</label>
              <select
                className="w-full rounded-lg p-3 bg-[#22304a] text-white border border-[#2a3c5c] focus:outline-none focus:ring-2 focus:ring-[#7de2ff]"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option>All Categories</option>
                <option>Brakes</option>
                <option>Filters</option>
                <option>Ignition</option>
                <option>Suspension</option>
                <option>Engine</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#7de2ff]">MAX PRICE PER UNIT</label>
              <input
                type="number"
                min="0"
                className="w-full rounded-lg p-3 bg-[#22304a] text-white border border-[#2a3c5c] focus:outline-none focus:ring-2 focus:ring-[#7de2ff]"
                placeholder="e.g. 100.00"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#7de2ff]">DELIVERY PRIORITY</label>
              <select
                className="w-full rounded-lg p-3 bg-[#22304a] text-white border border-[#2a3c5c] focus:outline-none focus:ring-2 focus:ring-[#7de2ff]"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option>Standard</option>
                <option>Express</option>
                <option>Urgent</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-center mt-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#7de2ff] to-[#ff6bcb] text-[#1a2233] font-bold rounded-full px-8 py-3 text-lg shadow-lg hover:scale-105 transition flex items-center gap-2 disabled:opacity-60"
                disabled={searching}
              >
                {searching ? (
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-[#1a2233] border-t-[#7de2ff] rounded-full"></span>
                ) : (
                  '🔍 SEARCH ACROSS 10 SUPPLIERS'
                )}
              </button>
            </div>
          </form>
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
                  <div key={i} className={`border rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${offer.best ? 'border-[#7de2ff] bg-[#1c2940]' : 'border-[#2a3c5c] bg-[#22304a]'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">{offer.supplier}</span>
                        {offer.best && <span className="ml-2 px-2 py-0.5 bg-[#7de2ff] text-[#1a2233] text-xs font-bold rounded-full">BEST OFFER</span>}
                      </div>
                      <div className="text-sm text-blue-100">Product: <span className="font-semibold text-white">{offer.product}</span> | SKU: {offer.sku}</div>
                      <div className="text-sm text-blue-100">Available: <span className="text-white font-semibold">{offer.available} units</span> | Delivery: {offer.delivery}</div>
                      <div className="text-sm text-blue-100">Bulk Discount: {offer.bulkDiscount} | Rating: <span className="text-yellow-300">★ {offer.rating}/5.0</span></div>
                    </div>
                    <div className="flex flex-col items-end min-w-[120px]">
                      <div className="text-2xl font-extrabold text-[#7de2ff]">${offer.total.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                      <div className="text-xs text-blue-200">Unit: ${offer.unitPrice.toFixed(2)}</div>
                      <div className="text-xs text-blue-200">Shipping: {offer.shipping === 0 ? '$0.00' : `$${offer.shipping}`}</div>
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
