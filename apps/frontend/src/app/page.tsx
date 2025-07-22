import React, { useEffect, useState } from 'react';

interface Product {
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
}
interface Supplier {
  id: number;
  name: string;
  specialization: string;
  location: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [result, setResult] = useState('');
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(data => setProducts(data.products || []));
    fetch('/api/suppliers').then(res => res.json()).then(data => setSuppliers(data.suppliers || []));
  }, []);

  async function handleProcure(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRecommendations(null);
    const form = e.target as HTMLFormElement;
    const sku = (form.elements.namedItem('sku') as HTMLInputElement).value;
    const supplierId = (form.elements.namedItem('supplierId') as HTMLInputElement).value;
    const quantity = (form.elements.namedItem('quantity') as HTMLInputElement).value;
    const query = `Procure ${quantity} units of ${sku} from supplier ${supplierId}`;
    const res = await fetch('/api/procure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, supplierId, quantity, query })
    });
    const data = await res.json();
    setResult(data.message || data.error);
    // Fetch AI recommendations
    setLoadingAI(true);
    const aiRes = await fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const aiData = await aiRes.json();
    setRecommendations(aiData.recommendations || null);
    setLoadingAI(false);
  }

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">🚗 B2B MCP Demo</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p.sku} className="border rounded p-4 shadow">
              <div className="font-bold">{p.name}</div>
              <div>SKU: {p.sku}</div>
              <div>Category: {p.category}</div>
              <div>Brand: {p.brand}</div>
              <div>Price: ${p.price}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Suppliers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map(s => (
            <div key={s.id} className="border rounded p-4 shadow">
              <div className="font-bold">{s.name}</div>
              <div>Specialization: {s.specialization}</div>
              <div>Location: {s.location}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Simulate Procurement</h2>
        <form onSubmit={handleProcure} className="flex flex-col gap-2 max-w-md">
          <input name="sku" placeholder="SKU" required className="border p-2 rounded" />
          <input name="supplierId" placeholder="Supplier ID" required className="border p-2 rounded" />
          <input name="quantity" type="number" min="1" placeholder="Quantity" required className="border p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white rounded p-2 mt-2">Procure</button>
        </form>
        {result && <div className="mt-4 font-bold">{result}</div>}
        {loadingAI && <div className="mt-4 text-blue-600">Loading AI recommendations...</div>}
        {recommendations && (
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400">
            <h3 className="font-semibold mb-2 text-blue-700">AI Recommendations</h3>
            <pre className="whitespace-pre-wrap text-sm">{recommendations}</pre>
          </div>
        )}
      </section>
    </main>
  );
}
