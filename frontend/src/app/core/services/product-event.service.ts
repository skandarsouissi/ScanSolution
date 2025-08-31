import { importProvidersFrom, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductResponse } from '../../admin/product.dto';



@Injectable({
  providedIn: 'root'
})
export class ProductEventService {
  private productAddedSubject = new Subject<ProductResponse>();
  public productAdded$ = this.productAddedSubject.asObservable();

   private searchQuerySubject = new Subject<string>();
  public searchQuery$ = this.searchQuerySubject.asObservable();
  emitProductAdded(product: ProductResponse): void {
    this.productAddedSubject.next(product);
  }

  emitSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }
}
