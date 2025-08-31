import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDto } from '../categories';

@Component({
  selector: 'app-add-categories',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.css']
})
export class AddCategoriesComponent implements OnInit {
  categoryForm!: FormGroup;
  isLoading = false;
  isEditMode = false;
  categoryId?: number;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      Active: [true]
    });

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.categoryId = +id;
        this.loadCategory();
      }
    });

    // Alternative: Check for category data in navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['category']) {
      const category = navigation.extras.state['category'] as CategoryDto;
      this.isEditMode = true;
      this.categoryId = category.id;
      this.categoryForm.patchValue({
        name: category.name,
        isActive: category.Active
      });
    }
  }

  loadCategory(): void {
    if (this.categoryId) {
      this.isLoading = true;
      this.http.get<CategoryDto[]>('http://localhost:8080/api/categories').subscribe({
        next: (categories) => {
          const category = categories.find(c => c.id === this.categoryId);
          if (category) {
            this.categoryForm.patchValue({
              name: category.name,
              isActive: category.Active
            });
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement de la catégorie:', error);
          alert('Erreur lors du chargement de la catégorie');
          this.isLoading = false;
        }
      });
    }
  }

  postCategory(): void {
    if (this.categoryForm.invalid) {
      alert('Veuillez remplir correctement le formulaire');
      return;
    }

    this.isLoading = true;
    const categoryData: CategoryDto = this.categoryForm.value;
      categoryData.Active = true;

    if (this.isEditMode && this.categoryId) {
      // Update existing category
      this.http.put(`http://localhost:8080/api/categories/${this.categoryId}`, categoryData).subscribe({
        next: (res: any) => {
          alert('Catégorie modifiée avec succès');
          this.router.navigate(['/admin/dashboard']);
          this.isLoading = false;
        },
        error: (err: any) => {
          alert(err.error?.message || 'Erreur lors de la modification de la catégorie');
          this.isLoading = false;
        }
      });
    } else {
      // Add new category
      this.http.post('http://localhost:8080/api/categories', categoryData).subscribe({
        next: (res: any) => {
          alert('Catégorie ajoutée avec succès');
          this.categoryForm.reset({ isActive: true });
          this.router.navigate(['/admin/dashboard']);
          this.isLoading = false;
        },
        error: (err: any) => {
          alert(err.error?.message || 'Erreur lors de l\'ajout de la catégorie');
          this.isLoading = false;
        }
      });
    }
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Modifier la catégorie' : 'Ajouter une catégorie';
  }

  get buttonText(): string {
    return this.isLoading ? 'En cours...' : (this.isEditMode ? 'Modifier' : 'Ajouter');
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
