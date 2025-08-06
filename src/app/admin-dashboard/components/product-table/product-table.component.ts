import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/products.interface';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';

@Component({
  selector: 'product-table',
  imports: [
    pathImagePipe,
    RouterLink,
    NgIf
],
  templateUrl: './product-table.component.html'
})
export class ProductTableComponent {

  @Input() products: Product[] = [];

  @Output() search = new EventEmitter<string>();
  @Output() sort = new EventEmitter<{ field: keyof Product }>();

  @Input() sortBy: keyof Product | null = null;
  @Input() sortDirection: 'asc' | 'desc' = 'asc';

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.search.emit(target.value);
  }

  setSort(field: keyof Product) {
    this.sort.emit({ field });
  }

  @Output() delete = new EventEmitter<number>();

  onDeleteProduct(productId: number) {
    if (confirm('¿Estás seguro que querés eliminar este producto?')) {
      this.delete.emit(productId);
    }
  }

  getCategoryNames(product: { categories?: { name: string }[] }): string {
    return product.categories?.map(c => c.name).join(', ') || '';
  }

}
