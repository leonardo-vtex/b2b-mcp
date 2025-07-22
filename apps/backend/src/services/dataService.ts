import { Product, Supplier } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export class DataService {
  private products: Product[] = [];
  private suppliers: Supplier[] = [];

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    try {
      // Load products from all JSON files
      const productFiles = [
        'data/products.json',
        'data/products_extended.json', 
        'data/products_additional.json',
        'data/products_final.json',
        'data/products_brakes.json',
        'data/products_filters.json',
        'data/products_engine.json',
        'data/products_electrical.json',
        'data/products_suspension.json'
      ];

      this.products = [];
      for (const file of productFiles) {
        try {
          // Try to find the file relative to the project root (two levels up from apps/backend)
          let filePath = path.join(process.cwd(), file);
          if (!fs.existsSync(filePath)) {
            // Try from project root
            filePath = path.join(process.cwd(), '..', '..', file);
          }
          if (!fs.existsSync(filePath)) {
            // Try from current directory
            filePath = path.join(__dirname, '..', '..', '..', file);
          }
          
          if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (Array.isArray(data)) {
              this.products.push(...data);
            } else if (data.products && Array.isArray(data.products)) {
              this.products.push(...data.products);
            }
            console.log(`Loaded ${file}: ${Array.isArray(data) ? data.length : data.products?.length || 0} products`);
          } else {
            console.warn(`File not found: ${file}`);
          }
        } catch (error) {
          console.warn(`Warning: Could not load ${file}:`, error);
        }
      }

      // Load suppliers
      let suppliersPath = path.join(process.cwd(), 'data/suppliers.json');
      if (!fs.existsSync(suppliersPath)) {
        suppliersPath = path.join(process.cwd(), '..', '..', 'data/suppliers.json');
      }
      if (!fs.existsSync(suppliersPath)) {
        suppliersPath = path.join(__dirname, '..', '..', '..', 'data/suppliers.json');
      }
      
      if (fs.existsSync(suppliersPath)) {
        const suppliersData = JSON.parse(fs.readFileSync(suppliersPath, 'utf8'));
        this.suppliers = Array.isArray(suppliersData) ? suppliersData : suppliersData.suppliers || [];
        console.log(`Loaded suppliers: ${this.suppliers.length} suppliers`);
      } else {
        console.warn('Suppliers file not found');
      }

      console.log(`Total loaded: ${this.products.length} products and ${this.suppliers.length} suppliers`);
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }

  getProducts(limit?: number): Product[] {
    return limit ? this.products.slice(0, limit) : this.products;
  }

  getSuppliers(): Supplier[] {
    return this.suppliers;
  }

  findProductsByCategory(category: string): Product[] {
    return this.products.filter(product => 
      product.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  findProductsByName(name: string): Product[] {
    return this.products.filter(product => 
      product.name.toLowerCase().includes(name.toLowerCase()) ||
      product.sku.toLowerCase().includes(name.toLowerCase())
    );
  }

  findProductsByBrand(brand: string): Product[] {
    return this.products.filter(product => 
      product.brand.toLowerCase().includes(brand.toLowerCase())
    );
  }

  getSuppliersBySpecialization(specialization: string): Supplier[] {
    return this.suppliers.filter(supplier => 
      supplier.specialization.toLowerCase().includes(specialization.toLowerCase())
    );
  }

  getAllCategories(): string[] {
    const categories = new Set(this.products.map(p => p.category));
    return Array.from(categories);
  }

  getAllBrands(): string[] {
    const brands = new Set(this.products.map(p => p.brand));
    return Array.from(brands);
  }
} 