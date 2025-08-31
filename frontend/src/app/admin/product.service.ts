import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDTO, ProductResponse } from './product.dto';

const API_URL = 'http://localhost:8080/api/dishes';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  // GET all products
  getAllProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(API_URL);
  }

  // GET product by ID
  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${API_URL}/${id}`);
  }

  // POST new product
  createProduct(productData: FormData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(API_URL, productData);
  }

  // PUT update product
  updateProduct(id: number, productData: FormData): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${API_URL}/${id}`, productData);
  }

  // DELETE product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }

  // GET products by category
  getProductsByCategory(categoryId: number): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${API_URL}/category/${categoryId}`);
  }
  
}
