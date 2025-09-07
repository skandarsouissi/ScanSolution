import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {                  
  private categorySubject = new BehaviorSubject<string>('All');
  selectedCategory$ = this.categorySubject.asObservable();

  setCategory(category: string) {
    this.categorySubject.next(category);
    }
}
  