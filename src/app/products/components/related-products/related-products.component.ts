import { Component, inject, input } from '@angular/core';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'related-products',
  imports: [ProductCardComponent],
  templateUrl: './related-products.component.html'
})
export class RelatedProductsComponent {

  categorySlug = input.required<string>();
  categoryName = input.required<string>();
  productExclude = input.required<string>();
  typeSlug = input.required<string>();
  materialSlug = input.required<string>();


  productService = inject(ProductsService);

  relatedProductsResource = rxResource({
    request: () => {
      return {
        categoria: this.categorySlug(),
        tipo: this.typeSlug(),
        material: this.materialSlug(),
        exclude: this.productExclude()
      };
    },
    loader: ({ request }) => {
      if (!request) return of({ products: [] });
      return this.productService.getProducts({
        categoria: request.categoria,
        tipo: request.tipo,
        material: request.material,
      }).pipe(
        map(res => ({
          products: res.products
          .filter(p => p.slug !== request.exclude)
          .slice(0, 12)
        }))
      );
    }
  });


}
