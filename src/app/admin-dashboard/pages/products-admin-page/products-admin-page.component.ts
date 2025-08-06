import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTableComponent } from "@dashboard/components/product-table/product-table.component";
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/products.interface';


    const sortFieldMap: Record<keyof Product, string> = {
      id: 'pd_id',
      slug: 'pd_slug',
      cod: 'pd_codigo',
      title: 'pd_titulo',
      description: 'pd_descripcion',
      categories: 'cat_titulo',
      type: 'tipo_nombre',
      material: 'mat_nombre',
      related: 'pd_relacionados',
      images: 'images',
      novelty: 'pd_novedad'
    };


@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html'
})
export class ProductsAdminPageComponent {

    productsService = inject(ProductsService);
    paginationService = inject(PaginationService);

    productsPerPage = signal(50);

    searchQuery = signal('');
    sortBy = signal<keyof Product | null>(null);
    sortDirection = signal<'asc' | 'desc'>('asc');

    refreshSignal = signal(0);

    productResource = rxResource({
      request: () => ({
        page: this.paginationService.currentPage() - 1,
        limit: this.productsPerPage(),
        search: this.searchQuery(),
        sortBy: this.sortBy(),
        direction: this.sortDirection(),
        refresh: this.refreshSignal(),
      }),
      loader: ({ request }) => this.productsService.getProducts({
        offset: request.page * request.limit,
        limit: request.limit,
        search: request.search,
        sortBy: request.sortBy ? sortFieldMap[request.sortBy] : undefined,
        direction: request.direction,
      })
    });


    onSort({ field }: { field: keyof Product }) {
      if (this.sortBy() === field) {
        // Toggle asc/desc
        this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
      } else {
        this.sortBy.set(field);
        this.sortDirection.set('asc');
      }
    }

    onDeleteProduct(id: number) {
      this.productsService.deleteProduct(id).subscribe({
        next: () => {
          // Recargar los productos después de borrar
          this.refreshSignal.update(n => n + 1);
        },
        error: (err) => {
          console.error('Error eliminando producto:', err);
        }
      });
    }

}
