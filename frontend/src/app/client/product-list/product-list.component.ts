import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { ProductEventService } from '../../core/services/product-event.service';
import { FilterService } from '../../core/services/filter.service';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../admin/category.service';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  isLoading = false;
  error: string | null = null;
  activeCategory = 'All';
  searchQuery = '';

  constructor(
    private productService: ProductService,
    private productEventService: ProductEventService,
    private filterService: FilterService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();

    this.productEventService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
      this.applyFilters();
    });
    
    this.filterService.selectedCategory$.subscribe(category => {
      this.activeCategory = category;
      console.log(`Selected category changed to: ${category}`); // Log selected category
      
      this.applyFilters();
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.error = null;

    this.productService.getActiveProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        console.log('Loaded products:', ...this.products); // Log loaded products
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Erreur chargement produits:', err);
        this.error = 'Impossible de charger les produits.';
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.filter(cat => cat.active !== false);
      },
      error: (err: unknown) => console.error('Error loading categories:', err)
    });
  }
  
  onCategorySelected(category: string) {
    this.activeCategory = category;
    this.applyFilters();
  }

  applyFilters(): void {
    console.log(`Applying filters with active category: ${this.activeCategory}`); // Log active category
    console.log(`Current products:`, this.products); // Log current products
    let temp = [...this.products];

    if (this.activeCategory.toLowerCase() !== 'all') {
      temp = temp.filter(p => {
        // Handle both string and Category object types with proper type checking
        if (typeof p.category === 'string') {
          return p.category.toLowerCase() === this.activeCategory.toLowerCase();
        } else if (typeof p.category === 'object' && p.category !== null) {
          return (p.category as Category).name.toLowerCase() === this.activeCategory.toLowerCase();
        }
        return false;
      });
    }

    if (this.searchQuery.trim()) {
      temp = temp.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    console.log(`Filtered products:`, temp);
    this.filteredProducts = temp;
  }
  
}
  setTimeout(() => {
    const grid = document.getElementById('product-grid');
    if (grid) {
      grid.style.display = 'none';
      grid.offsetHeight; // trigger reflow
      grid.style.display = 'flex';
    }
  }, 50);
