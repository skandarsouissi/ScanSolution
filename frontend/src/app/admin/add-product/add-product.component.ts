import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryDto } from '../categories';
import { ProductService } from '../product.service';
import { AdminService } from '../admin.service';
import { ProductEventService } from '../../core/services/product-event.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  categories: CategoryDto[] = [];
  submitted = false;
  loading = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private adminService: AdminService,
    private productEventService: ProductEventService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      active: [true]
    });
  }

  ngOnInit() {
    this.getAllCategories();
  }

  get f() {
    return this.productForm.controls;
  }

  getAllCategories() {
    this.adminService.getAllCategories().subscribe({
      next: (res: CategoryDto[]) => {
        this.categories = res;
        console.log('Catégories chargées :', res);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        alert('Erreur lors du chargement des catégories');
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price);
    formData.append('categoryId', this.productForm.value.category);
    formData.append('isActive', this.productForm.value.active);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.createProduct(formData).subscribe({
      next: (response) => {
        console.log('Produit ajouté avec succès:', response);
        alert('Produit ajouté avec succès!');
        
        // Emit event to notify client components
        this.productEventService.emitProductAdded(response);
        
        this.resetForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du produit:', error);
        alert(error.error?.message || 'Erreur lors de l\'ajout du produit');
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  resetForm() {
    this.productForm.reset();
    this.submitted = false;
    this.selectedFile = null;
    this.previewUrl = null;
  }
}
