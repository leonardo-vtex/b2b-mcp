import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Helper to load JSON data
function loadData(file: string) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, `../data/${file}`), 'utf-8'));
}

// API: Get products
app.get('/api/products', (_req, res) => {
  const products = loadData('products.json');
  res.json(products);
});

// API: Get suppliers
app.get('/api/suppliers', (_req, res) => {
  const suppliers = loadData('suppliers.json');
  res.json(suppliers);
});

// API: Simulate procurement
app.post('/api/procure', (req, res) => {
  const { sku, supplierId, quantity } = req.body;
  if (!sku || !supplierId || !quantity) {
    return res.status(400).json({ error: 'sku, supplierId, and quantity are required' });
  }
  // Simulate a response
  res.json({
    status: 'success',
    message: `Procured ${quantity} units of ${sku} from supplier ${supplierId}`
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app; 