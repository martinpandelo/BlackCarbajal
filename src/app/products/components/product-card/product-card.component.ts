import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/products.interface';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';

@Component({
  selector: 'product-card',
  imports: [RouterLink, pathImagePipe],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {

  product = input.required<Product>();

}
