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
        'data/products_final.json'
      ];

      this.products = [];
      for (const file of productFiles) {
        try {
          const filePath = path.join(process.cwd(), file);
          if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (Array.isArray(data)) {
              this.products.push(...data);
            } else if (data.products && Array.isArray(data.products)) {
              this.products.push(...data.products);
            }
          }
        } catch (error) {
          console.warn(`Warning: Could not load ${file}:`, error);
        }
      }

      // Load suppliers
      const suppliersPath = path.join(process.cwd(), 'data/suppliers.json');
      if (fs.existsSync(suppliersPath)) {
        const suppliersData = JSON.parse(fs.readFileSync(suppliersPath, 'utf8'));
        this.suppliers = Array.isArray(suppliersData) ? suppliersData : suppliersData.suppliers || [];
      }

      console.log(`Loaded ${this.products.length} products and ${this.suppliers.length} suppliers`);
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