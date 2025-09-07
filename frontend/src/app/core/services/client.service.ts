import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id?: number;
  name: string;
  active?: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/api/categories'; // Corrected base URL

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/active`); // Fetch only active categories
  }

  createCategory(category: Category): Observable<Category> { // Updated to use Category interface
    const url = 'http://localhost:8080/api/categories';
    return this.http.post<Category>(url, category);
  }

  getProducts(): Observable<Product[]> { // Typed as Product[]
    const url = 'http://localhost:8080/api/products';
    return this.http.get<Product[]>(url);
  }
  
}