import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductEventService } from '../../core/services/product-event.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchQuery: string = '';

  constructor(private productEventService: ProductEventService) {}

  onSearch(): void {
    // Émettre l'événement de recherche avec la valeur actuelle
    this.productEventService.emitSearchQuery(this.searchQuery);
  }
}
