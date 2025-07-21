# 🚗 B2B Automotive Parts Procurement MCP Demo

A cutting-edge demonstration of **Agent-to-Agent (A2A)** procurement systems using **Model Context Protocol (MCP)** for intelligent automotive parts sourcing.

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-purple.svg)
![MCP](https://img.shields.io/badge/Protocol-MCP-orange.svg)

## 🌟 Features

- **🤖 A2A Architecture**: 1 main procurement agent coordinating with 10 seller agents
- **🧠 AI-Powered**: OpenAI GPT-4 for intelligent query processing and recommendations
- **📊 Real-time Negotiation**: Dynamic pricing with bulk discounts and supplier competition
- **🎨 Modern UI**: Dark mode interface with glassmorphism effects
- **📈 100+ Products**: Comprehensive automotive parts catalog
- **⚡ Fast Processing**: Real-time responses in 2-8 seconds

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │  FastAPI Backend│    │   OpenAI GPT-4  │
│   (Dark Mode)   │◄──►│  (MCP Protocol) │◄──►│   (AI Agent)    │
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

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- OpenAI API Key
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MCP
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. **Run the system**
   ```bash
   # Start the backend server
   python3 backend/main.py
   
   # Open the frontend in your browser
   open frontend/index.html
   ```

## 🎯 Demo Examples

Try these queries to see the system in action:

### Basic Queries
- `"I need to buy 50 brake pads for Toyota Camry"`
- `"Looking for 100 air filters with delivery within 5 days"`
- `"Need 25 spark plugs for Honda Civic, premium quality"`

### Advanced Queries
- `"200 premium brake pads for BMW vehicles with delivery within 3 days and budget under $10,000"`
- `"500 air filters from Bosch or Mann brands for fleet maintenance"`
- `"URGENT: Need 50 ignition coils for Toyota Camry 2020 models, fastest delivery possible"`

### Enterprise Queries
- `"Procuring complete engine maintenance kit: 100 oil filters, 50 spark plugs, 25 air filters"`
- `"Evaluating suppliers for 1000 suspension components with 2-year warranty and ISO certification"`

## 🔧 API Endpoints

### Core Endpoints

- `POST /procure` - Main procurement endpoint
- `GET /health` - Health check
- `GET /products` - Get available products
- `GET /suppliers` - Get supplier information
- `POST /debug` - Debug query parsing and matching

### Example API Call

```bash
curl -X POST "http://localhost:8000/procure" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I need 50 brake pads for Toyota Camry",
    "quantity": 50
  }'
```

## 📊 Data Structure

### Products (100+ items)
- **Categories**: Brakes, Filters, Engine, Electrical, Suspension, Ignition, etc.
- **Specifications**: SKU, Brand, Compatibility, Dimensions, Certifications
- **Pricing**: Base prices with supplier variations

### Suppliers (10 agents)
- **Specializations**: Each supplier focuses on specific categories
- **Pricing Strategies**: Different multipliers and discount tiers
- **Business Rules**: Minimum orders, payment terms, shipping costs

## 🎨 Frontend Features

- **Dark Mode Design**: Modern glassmorphism interface
- **Real-time Search**: Instant results with loading animations
- **Interactive Examples**: Quick demo queries
- **Responsive Design**: Works on desktop and mobile
- **Visual Feedback**: Hover effects and transitions

## 🔍 How It Works

### 1. Query Processing
The system uses OpenAI GPT-4 to parse natural language queries and extract:
- Product category
- Brand preferences
- Quantity requirements
- Urgency level
- Price preferences

### 2. Agent Coordination
The main procurement agent:
- Finds matching products
- Coordinates with 10 supplier agents
- Collects competitive offers
- Calculates optimal pricing

### 3. AI Recommendations
GPT-4 analyzes all offers and provides:
- Best value recommendations
- Negotiation strategies
- Alternative suppliers
- Cost optimization tips

## 🛠️ Technical Stack

- **Backend**: FastAPI + Python 3.9+
- **Frontend**: HTML5 + CSS3 + JavaScript
- **AI**: OpenAI GPT-4 API
- **Protocol**: Model Context Protocol (MCP)
- **Data**: JSON files with 100+ products and 10 suppliers

## 📁 Project Structure

```
MCP/
├── backend/
│   └── main.py              # FastAPI server with MCP implementation
├── frontend/
│   └── index.html           # Dark mode UI
├── data/
│   ├── products.json        # Main product catalog
│   ├── products_extended.json
│   ├── products_additional.json
│   ├── products_final.json
│   └── suppliers.json       # Supplier agent configurations
├── docs/
│   └── README.md           # Detailed documentation
├── requirements.txt         # Python dependencies
├── setup.py                # Installation script
├── test_system.py          # System validation
├── env.example             # Environment template
└── README.md              # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- FastAPI for the web framework
- The MCP community for protocol inspiration

## 📞 Support

For questions or support, please open an issue in this repository.

---

**Built with ❤️ for the future of B2B procurement** 