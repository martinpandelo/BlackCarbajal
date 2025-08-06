import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { MainCarouselComponent } from '@website-front/components/main-carousel/main-carousel.component';
import { SlideEventosComponent } from '@events/components/home-events/home-events.component';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { CatalogsComponent } from '@catalogs/components/home-catalogs/home-catalogs.component';
import { SlicePipe } from '@angular/common';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';


@Component({
  selector: 'app-home-page',
  imports: [RouterLink, CatalogsComponent, MainCarouselComponent, SlideEventosComponent, ProductCardComponent, SlicePipe, pathImagePipe],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {

  productsService = inject(ProductsService);

  categoryResource = rxResource({
    loader: () => {
      return this.productsService.getCategories({ })
    }
  });

  productResource = rxResource({
    request: () => ({ novedad: true }),
    loader: ({ request }) => {
      return this.productsService.getProducts({ novedad: request.novedad })
    }
  });

}
