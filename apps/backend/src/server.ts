import express from 'express';
import cors from 'cors';
import { DataService } from './services/dataService';
import { ProcurementService } from './services/procurementService';
import { ProcurementRequest } from './types';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const dataService = new DataService();
const procurementService = new ProcurementService();

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.get('/api/products', (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const products = dataService.getProducts(limit);
    res.json({ products, total: products.length, limit: limit || 'all' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/suppliers', (req, res) => {
  try {
    const suppliers = dataService.getSuppliers();
    res.json({ suppliers, total: suppliers.length });
  } catch (error) {
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
    res.status(500).json({ error: 'Error processing procurement request', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/recommendations', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    if (!openai) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }
    const prompt = `You are an expert B2B procurement assistant. Given the following procurement query, provide 3 actionable recommendations for the buyer.\nQuery: ${query}\nRecommendations:`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful procurement assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 200
    });
    const content = completion.choices[0]?.message?.content;
    res.json({ recommendations: content });
  } catch (error) {
    res.status(500).json({ error: 'Error generating recommendations', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend MCP/A2A running on http://localhost:${PORT}`);
  });
}

export default app;
