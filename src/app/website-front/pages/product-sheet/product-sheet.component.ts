import { Component, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
import { catchError, map, of, switchMap, throwError } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RelatedProductsComponent } from '@products/components/related-products/related-products.component';
import { NotFoundPageComponent } from '../not-found-page/not-found-page.component';
import { ImageCarouselComponent } from '@shared/components/image-carousel/image-carousel.component';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';
import { NgClass } from '@angular/common';
import { Product } from '@products/interfaces/products.interface';

@Component({
  selector: 'app-product-sheet',
  imports: [RouterLink, RelatedProductsComponent, NotFoundPageComponent, ImageCarouselComponent, pathImagePipe, NgClass],
  templateUrl: './product-sheet.component.html'
})
export class ProductSheetComponent  {

  productService = inject(ProductsService);

  route = inject(ActivatedRoute);

  productSlug = toSignal(this.route.params.pipe(
    map( ({ idSlug }) => idSlug )
  ));

  productResource = rxResource({
    request: () => ({ idSlug: this.productSlug() }),
    loader: ({ request }) => {
      return this.productService.getProductBySlug( request.idSlug ).pipe(
      catchError((error) => {
      return throwError(() => error);
      })
    );
    }
  });

  relatedProductsResource = rxResource({
    request: () => this.productSlug(),
    loader: ({ request }) =>
      this.productService.getProductBySlug(request).pipe(
        switchMap(product => {
          const relatedKey = product.related;
          if (!relatedKey) return of([]); // sin relacionados
          return this.productService.getProductsByRelated(relatedKey);
        })
      )
  });

  // Productos vistos recientemente
  recentProducts = signal<Product[]>([]);

  constructor() {
    effect(() => {
      if (this.productResource.hasValue()) {
        const product = this.productResource.value() as Product;

        let stored: Product[] = JSON.parse(localStorage.getItem('recentProducts') || '[]');

        // Quitar duplicados por slug
        stored = stored.filter(p => p.slug !== product.slug);

        // Agregar al inicio
        stored.unshift(product);

        // Máximo 6
        if (stored.length > 6) stored = stored.slice(0, 6);

        localStorage.setItem('recentProducts', JSON.stringify(stored));

        this.recentProducts.set(stored);
      }
    });

    // Inicializar desde localStorage
    const initial = JSON.parse(localStorage.getItem('recentProducts') || '[]') as Product[];
    this.recentProducts.set(initial);
  }

}
