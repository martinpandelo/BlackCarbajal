import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
import { catchError, map, of, switchMap, throwError } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RelatedProductsComponent } from '@products/components/related-products/related-products.component';
import { NotFoundPageComponent } from '../not-found-page/not-found-page.component';
import { ImageCarouselComponent } from '@shared/components/image-carousel/image-carousel.component';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';
import { NgClass } from '@angular/common';

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

}
