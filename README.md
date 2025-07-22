# 🚗 B2B Automotive Parts Procurement MCP Demo

A **Model Context Protocol (MCP)** demonstration showcasing **Agent-to-Agent (A2A)** procurement in the automotive industry. This system uses AI to intelligently parse procurement queries and coordinate between a main procurement agent and 10 specialized supplier agents.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │  Node.js Server │    │   OpenAI GPT-4  │
│   (Dark Mode)   │◄──►│  (TypeScript)   │◄──►│   (AI Agent)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  10 Supplier    │
                       │     Agents      │
                       │                 │
                       │ - AutoParts Pro │
                       │ - Engine Masters│
                       │ - Filter King   │
                       │ - ... (7 more)  │
                       └─────────────────┘
```

## ✨ Features

- **🤖 AI-Powered Query Parsing**: Natural language processing for procurement requests
- **🏢 Multi-Agent Coordination**: 10 specialized supplier agents with unique catalogs
- **📊 Intelligent Scoring**: AI-driven offer evaluation and ranking
- **🎨 Modern Dark UI**: Beautiful, responsive interface with glassmorphism effects
- **⚡ Real-time Processing**: Fast response times with intelligent caching
- **🔍 Advanced Search**: Fuzzy matching and category-based filtering
- **💰 Smart Pricing**: Bulk discounts, shipping calculations, and supplier ratings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/leonardo-vtex/mcp.git
   cd mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎯 Demo Examples

Try these example queries to see the system in action:

1. **"I need brake pads for Toyota Camry"**
   - Parses: Category=brakes, Brand=Toyota
   - Returns: Multiple supplier offers with pricing

2. **"Looking for 100 air filters, urgent delivery"**
   - Parses: Category=filters, Quantity=100, Urgency=high
   - Returns: Prioritized offers with fast delivery

3. **"Need premium engine oil filters for BMW"**
   - Parses: Category=filters, Brand=BMW, Price=premium
   - Returns: High-quality supplier recommendations

4. **"50 suspension parts for Honda Civic"**
   - Parses: Category=suspension, Brand=Honda, Quantity=50
   - Returns: Bulk pricing and availability

5. **"Bulk order: 500 transmission components"**
   - Parses: Category=transmission, Quantity=500
   - Returns: Maximum bulk discounts and volume pricing

## 🔧 API Endpoints

### Health Check
```http
GET /health
```

### Get Products
```http
GET /products?limit=10
```

### Get Suppliers
```http
GET /suppliers
```

### Procurement Request
```http
POST /procure
Content-Type: application/json

{
  "query": "I need 50 brake pads for Toyota Camry",
  "quantity": 50,
  "urgency": "high",
  "price_preference": "mid-range"
}
```

## 📊 Data Structure

### Product Catalog
- **100+ Complete References**: SKU, name, category, brand, specifications
- **Automotive Focus**: Brakes, filters, engine, suspension, steering, etc.
- **Rich Metadata**: Dimensions, weight, warranty, certifications

### Supplier Network
- **10 Specialized Agents**: Each with unique product focus
- **Dynamic Pricing**: Rating-based multipliers and bulk discounts
- **Location & Delivery**: Geographic distribution and shipping options

## 🎨 Frontend Features

- **Dark Mode Design**: Modern glassmorphism with neon accents
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Real-time Search**: Instant feedback and loading states
- **Interactive Cards**: Hover effects and detailed offer information
- **AI Recommendations**: Intelligent suggestions based on query analysis

## 🔍 How It Works

1. **Query Input**: User enters natural language procurement request
2. **AI Parsing**: OpenAI GPT-4 extracts structured data (category, brand, quantity, etc.)
3. **Product Matching**: Fuzzy search across 100+ automotive products
4. **Supplier Coordination**: 10 agents compete with specialized offers
5. **Intelligent Scoring**: AI evaluates offers based on price, rating, delivery, discounts
6. **Recommendations**: System provides optimization suggestions
7. **Results Display**: Beautiful cards showing best offers with detailed breakdowns

## 🛠️ Technical Stack

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: Vanilla HTML/CSS/JavaScript (Dark Mode)
- **AI**: OpenAI GPT-4 for query parsing
- **Data**: JSON files with 100+ products and 10 suppliers
- **Deployment**: Vercel-ready configuration

## 📁 Project Structure

```
MCP/
├── src/
│   ├── types/           # TypeScript interfaces
│   ├── services/        # Business logic
│   │   ├── dataService.ts
│   │   ├── openaiService.ts
│   │   └── procurementService.ts
│   └── server.ts        # Express server
├── public/
│   └── index.html       # Frontend UI
├── data/
│   ├── products.json    # Product catalog
│   ├── products_extended.json
│   ├── products_additional.json
│   ├── products_final.json
│   └── suppliers.json   # Supplier network
├── package.json
├── tsconfig.json
└── vercel.json
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variable: `OPENAI_API_KEY`
3. Deploy automatically on push to main

### Local Production
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Vercel for deployment platform
- Automotive industry experts for product data

---

**Built with ❤️ for the MCP (Model Context Protocol) community** 

<!-- Trigger redeploy: dummy change for Vercel --> 