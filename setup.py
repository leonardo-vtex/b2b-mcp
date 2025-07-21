#!/usr/bin/env python3
"""
Setup script for B2B Automotive Parts Procurement MCP Demo
"""

import os
import sys
import subprocess
import json

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def install_dependencies():
    """Install Python dependencies"""
    return run_command("python3 -m pip install -r requirements.txt", "Installing Python dependencies")

def create_env_file():
    """Create .env file if it doesn't exist"""
    env_file = ".env"
    if not os.path.exists(env_file):
        print("📝 Creating .env file...")
        with open(env_file, "w") as f:
            f.write("""# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8000

# Database Configuration (if needed later)
DATABASE_URL=sqlite:///./procurement.db

# Logging Configuration
LOG_LEVEL=INFO
""")
        print("✅ .env file created")
        print("⚠️  Please update OPENAI_API_KEY in .env file with your actual API key")
    else:
        print("✅ .env file already exists")

def verify_data_files():
    """Verify that all data files exist"""
    required_files = [
        "data/products.json",
        "data/products_extended.json",
        "data/products_additional.json",
        "data/products_final.json",
        "data/suppliers.json"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing data files: {missing_files}")
        return False
    
    # Count products
    try:
        with open("data/products.json", "r") as f:
            products_data = json.load(f)
        with open("data/products_extended.json", "r") as f:
            extended_products = json.load(f)
        with open("data/products_additional.json", "r") as f:
            additional_products = json.load(f)
        with open("data/products_final.json", "r") as f:
            final_products = json.load(f)
        
        total_products = len(products_data["products"]) + len(extended_products["products"]) + len(additional_products["products"]) + len(final_products["products"])
        print(f"✅ Found {total_products} products in catalog")
        
        with open("data/suppliers.json", "r") as f:
            suppliers_data = json.load(f)
        print(f"✅ Found {len(suppliers_data['suppliers'])} suppliers")
        
    except Exception as e:
        print(f"❌ Error reading data files: {e}")
        return False
    
    return True

def main():
    """Main setup function"""
    print("🚗 B2B Automotive Parts Procurement MCP Demo Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Setup failed during dependency installation")
        sys.exit(1)
    
    # Create environment file
    create_env_file()
    
    # Verify data files
    if not verify_data_files():
        print("❌ Setup failed during data verification")
        sys.exit(1)
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Update OPENAI_API_KEY in .env file with your actual API key")
    print("2. Run the server: python backend/main.py")
    print("3. Open frontend/index.html in your browser")
    print("4. Start searching for automotive parts!")
    
    print("\n🔧 Available commands:")
    print("- Start server: python backend/main.py")
    print("- Health check: curl http://localhost:8000/health")
    print("- Get products: curl http://localhost:8000/products")
    print("- Get suppliers: curl http://localhost:8000/suppliers")

if __name__ == "__main__":
    main() 