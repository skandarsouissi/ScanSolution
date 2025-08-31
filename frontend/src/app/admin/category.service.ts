import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Category } from '../core/models/category.model'; // Adjust the import path as needed

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/active`).pipe(
      catchError((error) => {
        console.error('Error fetching categories:', error);
        throw error; // Re-throw to be handled by the subscriber
      })
    );
  }
}