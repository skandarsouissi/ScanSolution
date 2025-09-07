import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService, Category, Product } from '../../core/services/client.service';
import { FilterService } from '../../core/services/filter.service';
import { Output, EventEmitter, Input } from '@angular/core';
import { CategoryService } from '../../admin/category.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
  
})
export class FilterComponent implements OnInit {
  categories: Category[] = [];
  newCategoryName: string = '';
  activeCategory: string = 'All';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  @Input() category: Category[] = [];
  @Output() categorySelected = new EventEmitter<string>();
  @Output() productsFiltered = new EventEmitter<Product[]>();

  constructor(
    private clientService: ClientService,
    private filterService: FilterService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  

    this.filterService.selectedCategory$.subscribe(category => {
      this.activeCategory = category;
    
    });
  }

  loadCategories(): void {
    this.clientService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data.filter(cat => cat.active !== false); // Only active categories
      },
      error: (err: unknown) => console.error('Error loading categories:', err)
    });
  }



  addCategory(): void {
    if (!this.newCategoryName.trim()) return;

    this.clientService.createCategory({ name: this.newCategoryName, active: true }).subscribe({
      next: (createdCategory: Category) => {
        this.categories.push(createdCategory);
        this.newCategoryName = '';
      },
      error: (err: unknown) => console.error('Erreur création catégorie', err)
    });
  }

  setActiveCategory(categoryName: string): void {
    this.activeCategory = categoryName;
    this.filterService. setCategory(categoryName);
   
    this.categorySelected.emit(categoryName);
    this.productsFiltered.emit(this.filteredProducts);
  }



  getCategoryFilter(categoryName: string): string {
    return '.' + categoryName.toLowerCase().replace(/\s+/g, '-');
  }
}