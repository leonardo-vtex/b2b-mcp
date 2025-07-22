import express from 'express';
import cors from 'cors';
// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
import { DataService } from './services/dataService';
import { ProcurementService } from './services/procurementService';
import { ProcurementRequest } from './types';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize services
const dataService = new DataService();
const procurementService = new ProcurementService();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'B2B Automotive Parts Procurement MCP Demo is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Get products endpoint
app.get('/products', (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const products = dataService.getProducts(limit);
    
    res.json({
      products,
      total: products.length,
      limit: limit || 'all'
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get suppliers endpoint
app.get('/suppliers', (req, res) => {
  try {
    const suppliers = dataService.getSuppliers();
    res.json({
      suppliers,
      total: suppliers.length
    });
  } catch (error) {
    console.error('Error getting suppliers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Main procurement endpoint
app.post('/procure', async (req, res) => {
  try {
    const request: ProcurementRequest = req.body;
    
    if (!request.query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const response = await procurementService.processProcurementRequest(request);
    res.json(response);
  } catch (error) {
    console.error('Error processing procurement request:', error);
    res.status(500).json({ 
      error: 'Error processing procurement request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Debug endpoint for testing query parsing
app.post('/debug', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Test query parsing
    const procurementService = new ProcurementService();
    const response = await procurementService.processProcurementRequest({ query });
    
    res.json({
      original_query: query,
      parsed_query: response.parsed_query,
      matching_products_count: response.total_offers,
      processing_time: response.processing_time
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ error: 'Debug endpoint error' });
  }
});

// API routes for Vercel
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'B2B Automotive Parts Procurement MCP Demo is running',
    version: '1.0.0',
    environment: 'vercel'
  });
});

app.get('/api/products', (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const products = dataService.getProducts(limit);
    
    res.json({
      products,
      total: products.length,
      limit: limit || 'all'
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/suppliers', (req, res) => {
  try {
    const suppliers = dataService.getSuppliers();
    res.json({
      suppliers,
      total: suppliers.length
    });
  } catch (error) {
    console.error('Error getting suppliers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/procure', async (req, res) => {
  try {
    const request: ProcurementRequest = req.body;
    
    if (!request.query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const response = await procurementService.processProcurementRequest(request);
    res.json(response);
  } catch (error) {
    console.error('Error processing procurement request:', error);
    res.status(500).json({ 
      error: 'Error processing procurement request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🛍️  Products: http://localhost:${PORT}/products`);
    console.log(`🏢 Suppliers: http://localhost:${PORT}/suppliers`);
    console.log(`🔍 Procurement: http://localhost:${PORT}/procure`);
  });
}

// Export for Vercel
export default app; 