import express from 'express';
import cors from 'cors';
// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'B2B Automotive Parts Procurement MCP Demo is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({
    message: 'Test endpoint working!',
    timestamp: new Date().toISOString()
  });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}

// Export for Vercel
export default app; 