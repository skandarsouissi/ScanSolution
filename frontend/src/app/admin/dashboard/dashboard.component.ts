import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin.service';
import { CategoryDto } from '../categories';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { ProductResponse } from '../product.dto';
import { ProductEventService } from '../../core/services/product-event.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  categories: CategoryDto[] = [];
  products: ProductResponse[] = [];
  isLoading = false;
  showEditModal = false;
  showEditProductModal = false;
  editingCategory: CategoryDto | null = null;
  editingProduct: ProductResponse | null = null;
  editForm!: FormGroup;
  editProductForm!: FormGroup;
selectedImageFile: File | null = null;
selectedImageName: string | null = null;
imageError: string | null = null;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private productService: ProductService,
    private fb: FormBuilder,
    private productEventService: ProductEventService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      isActive: [true]
    });

    this.editProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      isActive: [true]
    });

    // Subscribe to product added events for real-time updates
    this.productEventService.productAdded$.subscribe((newProduct) => {
      // Add the new product to the existing list
      this.products = [...this.products, newProduct];
    });
  }
  onFileSelected(event: Event) {

  const file = (event.target as HTMLInputElement).files?.[0];

  if (file) {

  

    this.imageError = null; 


  } else {

    this.imageError = 'Veuillez sélectionner un fichier.';

  }

}
  

  loadCategories(): void {
    this.isLoading = true;
    this.adminService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.isLoading = false;
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
        this.isLoading = false;
      }
    });
  }

  goToAddCategory() {
    this.router.navigate(['/admin/add-categories']);
  }

  goToLogin() {
    this.router.navigate(['/admin/login']);
  }
  
  goToAddproduct() {
    this.router.navigate(['/admin/add-product']);
  }

  openEditProductModal(product: ProductResponse): void {
    this.editingProduct = product;
    this.editProductForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      isActive: product.isActive
      
    });
    this.showEditProductModal = true;
  }

  closeEditProductModal(): void {
    this.showEditProductModal = false;
    this.editingProduct = null;
    this.editProductForm.reset();
  }

  saveProduct(): void {
    if (this.editProductForm.invalid || !this.editingProduct) {
      console.log('Form validation errors:', this.editProductForm.errors);
      Object.keys(this.editProductForm.controls).forEach(key => {
        const control = this.editProductForm.get(key);
        if (control?.errors) {
          console.log(`${key} errors:`, control.errors);
        }
      });
      return;
    }
    

    // Find the category ID from the category name
    const selectedCategory = this.categories.find(cat => cat.name === this.editProductForm.value.category);
    if (!selectedCategory) {
      alert('Catégorie invalide sélectionnée');
      return;
    }
  const dishDTO = {
    name: this.editProductForm.value.name,
    description: this.editProductForm.value.description,
    price: this.editProductForm.value.price,
    categoryId: selectedCategory.id,
    isActive: this.editProductForm.value.isActive
  
    
  };
    const formData = new FormData();
  formData.append('dishDTO', new Blob([JSON.stringify(dishDTO)], { type: 'application/json' }));
    
    formData.append('name', this.editProductForm.value.name);
    formData.append('description', this.editProductForm.value.description);
    formData.append('price', this.editProductForm.value.price.toString());
    formData.append('categoryId', selectedCategory.id!.toString());
    formData.append('active', this.editProductForm.value.isActive.toString());

    this.productService.updateProduct(this.editingProduct.id!, formData).subscribe({
      next: (response) => {
        console.log('Product updated successfully:', response);
        this.loadProducts();
        this.closeEditProductModal();
        alert('Produit modifié avec succès');
      },
      error: (error) => {
        console.error('Error updating product:', error);
        let errorMessage = 'Erreur lors de la modification du produit';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'Données invalides. Veuillez vérifier tous les champs.';
        } else if (error.status === 404) {
          errorMessage = 'Produit non trouvé';
        } else if (error.status === 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        }
        alert(`Erreur: ${errorMessage}`);
      }
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.adminService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          alert('Catégorie supprimée avec succès');
        },
        error: (error) => {
          alert('Erreur lors de la suppression de la catégorie');
        }
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          alert('Produit supprimé avec succès');
        },
        error: (error) => {
          alert('Erreur lors de la suppression du produit');
        }
      });
    }
  }

  openEditModal(category: CategoryDto): void {
    this.editingCategory = category;
    this.editForm.patchValue({
      name: category.name,
      isActive: category.Active
    });
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingCategory = null;
    this.editForm.reset();
  }

  saveCategory(): void {
    if (this.editForm.invalid || !this.editingCategory) {
      return;
    }

    const updatedCategory: CategoryDto = {
      ...this.editingCategory,
      ...this.editForm.value
    };

    this.adminService.updateCategory(this.editingCategory.id!, updatedCategory).subscribe({
      next: () => {
        this.loadCategories();
        this.closeEditModal();
        alert('Catégorie modifiée avec succès');
      },
      error: (error) => {
        alert('Erreur lors de la modification de la catégorie');
      }
    });
  }
}
