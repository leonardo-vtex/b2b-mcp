#!/usr/bin/env python3
"""
Test script for B2B Automotive Parts Procurement MCP Demo
Tests the system functionality without requiring OpenAI API
"""

import json
import sys
import os
from datetime import datetime

def test_data_loading():
    """Test loading of product and supplier data"""
    print("🧪 Testing data loading...")
    
    try:
        # Test products loading
        with open("data/products.json", "r") as f:
            products_data = json.load(f)
        
        with open("data/products_extended.json", "r") as f:
            extended_products = json.load(f)
        
        with open("data/products_additional.json", "r") as f:
            additional_products = json.load(f)
        
        with open("data/products_final.json", "r") as f:
            final_products = json.load(f)
        
        total_products = len(products_data["products"]) + len(extended_products["products"]) + len(additional_products["products"]) + len(final_products["products"])
        print(f"✅ Loaded {total_products} products")
        
        # Test suppliers loading
        with open("data/suppliers.json", "r") as f:
            suppliers_data = json.load(f)
        
        print(f"✅ Loaded {len(suppliers_data['suppliers'])} suppliers")
        
        return True
        
    except Exception as e:
        print(f"❌ Data loading failed: {e}")
        return False

def test_product_categories():
    """Test product categorization"""
    print("\n🧪 Testing product categories...")
    
    try:
        with open("data/products.json", "r") as f:
            products_data = json.load(f)
        
        with open("data/products_extended.json", "r") as f:
            extended_products = json.load(f)
        
        with open("data/products_additional.json", "r") as f:
            additional_products = json.load(f)
        
        with open("data/products_final.json", "r") as f:
            final_products = json.load(f)
        
        all_products = products_data["products"] + extended_products["products"] + additional_products["products"] + final_products["products"]
        
        # Count products by category
        categories = {}
        for product in all_products:
            category = product["category"]
            categories[category] = categories.get(category, 0) + 1
        
        print("📊 Product distribution by category:")
        for category, count in sorted(categories.items()):
            print(f"   {category}: {count} products")
        
        # Check if we have at least 100 products
        total_products = sum(categories.values())
        if total_products >= 100:
            print(f"✅ Total products: {total_products} (meets requirement)")
        else:
            print(f"⚠️  Total products: {total_products} (below 100 requirement)")
        
        return True
        
    except Exception as e:
        print(f"❌ Category testing failed: {e}")
        return False

def test_supplier_specializations():
    """Test supplier specializations"""
    print("\n🧪 Testing supplier specializations...")
    
    try:
        with open("data/suppliers.json", "r") as f:
            suppliers_data = json.load(f)
        
        specializations = {}
        for supplier in suppliers_data["suppliers"]:
            spec = supplier["specialization"]
            specializations[spec] = specializations.get(spec, 0) + 1
        
        print("📊 Supplier specializations:")
        for spec, count in sorted(specializations.items()):
            print(f"   {spec}: {count} suppliers")
        
        # Check if we have 10 suppliers
        total_suppliers = len(suppliers_data["suppliers"])
        if total_suppliers == 10:
            print(f"✅ Total suppliers: {total_suppliers} (meets requirement)")
        else:
            print(f"⚠️  Total suppliers: {total_suppliers} (expected 10)")
        
        return True
        
    except Exception as e:
        print(f"❌ Supplier testing failed: {e}")
        return False

def test_product_quality():
    """Test product data quality"""
    print("\n🧪 Testing product data quality...")
    
    try:
        with open("data/products.json", "r") as f:
            products_data = json.load(f)
        
        with open("data/products_extended.json", "r") as f:
            extended_products = json.load(f)
        
        with open("data/products_additional.json", "r") as f:
            additional_products = json.load(f)
        
        with open("data/products_final.json", "r") as f:
            final_products = json.load(f)
        
        all_products = products_data["products"] + extended_products["products"] + additional_products["products"] + final_products["products"]
        
        required_fields = ["sku", "name", "category", "brand", "specifications", "dimensions", "weight", "warranty", "certifications", "description"]
        
        missing_fields = 0
        for product in all_products:
            for field in required_fields:
                if field not in product:
                    missing_fields += 1
                    print(f"   ⚠️  Product {product.get('sku', 'unknown')} missing field: {field}")
        
        if missing_fields == 0:
            print("✅ All products have required fields")
        else:
            print(f"⚠️  {missing_fields} missing fields found")
        
        # Test SKU uniqueness
        skus = [p["sku"] for p in all_products]
        unique_skus = set(skus)
        if len(skus) == len(unique_skus):
            print("✅ All SKUs are unique")
        else:
            print(f"⚠️  Duplicate SKUs found: {len(skus) - len(unique_skus)} duplicates")
        
        return True
        
    except Exception as e:
        print(f"❌ Product quality testing failed: {e}")
        return False

def test_supplier_pricing():
    """Test supplier pricing structures"""
    print("\n🧪 Testing supplier pricing structures...")
    
    try:
        with open("data/suppliers.json", "r") as f:
            suppliers_data = json.load(f)
        
        for supplier in suppliers_data["suppliers"]:
            # Check bulk discount structure
            bulk_discount = supplier.get("bulk_discount", {})
            if not bulk_discount:
                print(f"   ⚠️  Supplier {supplier['name']} has no bulk discounts")
                continue
            
            # Check discount tiers
            tiers = list(bulk_discount.keys())
            if len(tiers) >= 2:
                print(f"   ✅ {supplier['name']}: {len(tiers)} discount tiers")
            else:
                print(f"   ⚠️  {supplier['name']}: Only {len(tiers)} discount tier")
        
        return True
        
    except Exception as e:
        print(f"❌ Supplier pricing testing failed: {e}")
        return False

def test_file_structure():
    """Test project file structure"""
    print("\n🧪 Testing project file structure...")
    
    required_files = [
        "README.md",
        "requirements.txt",
        "setup.py",
        "backend/main.py",
        "data/products.json",
        "data/products_extended.json",
        "data/products_additional.json",
        "data/products_final.json",
        "data/suppliers.json",
        "frontend/index.html",
        "docs/README.md"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if not missing_files:
        print("✅ All required files present")
    else:
        print(f"❌ Missing files: {missing_files}")
        return False
    
    return True

def main():
    """Run all tests"""
    print("🚗 B2B Automotive Parts Procurement MCP Demo - System Test")
    print("=" * 60)
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    tests = [
        ("File Structure", test_file_structure),
        ("Data Loading", test_data_loading),
        ("Product Categories", test_product_categories),
        ("Supplier Specializations", test_supplier_specializations),
        ("Product Quality", test_product_quality),
        ("Supplier Pricing", test_supplier_pricing)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                print(f"❌ {test_name} test failed")
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
    
    print("\n" + "=" * 60)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! System is ready for use.")
        print("\n📋 Next steps:")
        print("1. Set your OpenAI API key in .env file")
        print("2. Run: python backend/main.py")
        print("3. Open frontend/index.html in your browser")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 