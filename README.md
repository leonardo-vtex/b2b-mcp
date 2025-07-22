# 🚗 B2B Automotive Parts Procurement MCP Demo

A **Model Context Protocol (MCP)** demonstration showcasing **Agent-to-Agent (A2A)** procurement in the automotive industry. This system uses AI to intelligently parse procurement queries and coordinate between a main procurement agent and 10 specialized supplier agents.

## 🤖 **MCP/A2A Architecture Implemented**

This demo now features a **real MCP (Model Context Protocol)** implementation with **Agent-to-Agent (A2A)** communication:

### **🏗️ MCP Agent Architecture**
```
┌─────────────────────────────────────────────────────────────┐
│                    Main Procurement Agent                   │
│                    (MCP Coordinator)                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│AutoParts Pro│ │Filter King  │ │Engine Masters│
│(Brakes)     │ │(Filters)    │ │(Engine)     │
└─────────────┘ └─────────────┘ └─────────────┘
        │             │             │
        ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│Electrical   │ │Suspension   │ │Cooling      │
│Solutions    │ │Specialists  │ │Systems Pro  │
└─────────────┘ └─────────────┘ └─────────────┘
        │             │             │
        ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│Exhaust      │ │Transmission │ │Fuel Systems │
│Experts      │ │Tech         │ │Plus         │
└─────────────┘ └─────────────┘ └─────────────┘
        │
        ▼
┌─────────────┐
│Steering     │
│Solutions    │
└─────────────┘
```

### **🔄 A2A Communication Flow**
1. **User Query** → Frontend → Backend MCP Service
2. **Main Agent** parses query and identifies relevant supplier agents
3. **A2A Coordination** between Main Agent and specialized Supplier Agents
4. **Supplier Agents** process requests and generate offers
5. **Main Agent** aggregates and ranks offers
6. **Response** with AI recommendations and coordinated offers

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

- **🤖 Real MCP Implementation**: True Model Context Protocol with Agent-to-Agent communication
- **🏢 A2A Coordination**: 10 specialized supplier agents with real inter-agent communication
- **🧠 AI-Powered Query Parsing**: OpenAI GPT-4 integration for intelligent query understanding
- **📊 Intelligent Scoring**: AI-driven offer evaluation and ranking across agents
- **🎨 Modern Dark UI**: Beautiful, responsive interface with glassmorphism effects
- **⚡ Real-time A2A Processing**: Fast response times with coordinated agent communication
- **🔍 Advanced Search**: Fuzzy matching and category-based filtering with agent specialization
- **💰 Smart Pricing**: Bulk discounts, shipping calculations, and supplier ratings
- **🔄 Fallback System**: Traditional procurement as backup when MCP agents don't find matches

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

Try these example queries to see the **MCP/A2A system** in action:

1. **"I need brake pads for Toyota Camry"**
   - 🤖 **MCP Agent**: Main Agent → AutoParts Pro (Brakes Specialist)
   - 📊 **A2A Result**: Brake Pads - Front Set at $42.75
   - 🎯 **AI Recommendation**: "AutoParts Pro (brakes specialist) offers the best solution"

2. **"URGENT: Need 50 ignition coils for Toyota Camry"**
   - 🤖 **MCP Agent**: Main Agent → Electrical Solutions (Electrical Specialist)
   - 📊 **A2A Result**: Ignition Coil at $32.90
   - 🎯 **AI Recommendation**: "Electrical Solutions offers the best solution"

3. **"Looking for 100 air filters, urgent delivery"**
   - 🤖 **MCP Agent**: Main Agent → Filter King (Filters Specialist)
   - 📊 **A2A Result**: Air Filter - Premium at $17.46
   - 🎯 **AI Recommendation**: "Filter King (filters specialist) offers the best solution"

4. **"50 suspension parts for Honda Civic"**
   - 🤖 **MCP Agent**: Main Agent → Suspension Specialists (Suspension Specialist)
   - 📊 **A2A Result**: Front Shock Absorber at $80.75
   - 🎯 **AI Recommendation**: "Suspension Specialists offers the best solution"

5. **"Bulk order: 500 transmission components"**
   - 🤖 **MCP Agent**: Main Agent → Transmission Tech (Transmission Specialist)
   - 📊 **A2A Result**: Specialized transmission components with bulk pricing
   - 🎯 **AI Recommendation**: "Multiple MCP agents were coordinated to find the best offers"

## 🔧 API Endpoints

### Health Check
```http
GET /health
```

## 🚀 **Current System Status**

### ✅ **MCP/A2A Implementation Status**
- **🤖 Main Procurement Agent**: ✅ Implemented and running
- **🏢 10 Supplier Agents**: ✅ All agents operational
- **🔄 A2A Communication**: ✅ Real-time coordination working
- **🧠 OpenAI Integration**: ✅ API key configured and working
- **📊 Agent Specialization**: ✅ Each agent handles specific categories
- **🎯 Intelligent Routing**: ✅ Queries routed to relevant agents
- **💰 Offer Generation**: ✅ Agents generate realistic offers
- **📈 Scoring System**: ✅ Offers ranked by multiple factors

### 🔧 **Technical Stack**
- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Node.js/Express with TypeScript
- **MCP Framework**: Custom implementation with A2A communication
- **AI**: OpenAI GPT-4 for query parsing
- **Data**: JSON-based product and supplier catalogs
- **Architecture**: Monorepo with microservices

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