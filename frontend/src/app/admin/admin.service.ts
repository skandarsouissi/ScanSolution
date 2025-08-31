import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDto, CategoryResponse } from './categories';

const BASIC_URL = 'http://localhost:8080/api/categories';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  // POST nouvelle catégorie
  postCategory(categoryDto: CategoryDto): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(BASIC_URL, categoryDto);
  }

  // GET toutes les catégories
  getAllCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(BASIC_URL);
  }

  // PUT mise à jour catégorie
  updateCategory(id: number, categoryDto: CategoryDto): Observable<CategoryDto> {
    return this.http.put<CategoryDto>(`${BASIC_URL}/${id}`, categoryDto);
  }

  // DELETE catégorie
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${BASIC_URL}/${id}`);
  }
  
}
