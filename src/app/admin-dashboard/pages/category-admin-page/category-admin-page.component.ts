import { Component, effect, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '@products/services/categories.service';
import { map } from 'rxjs';
import { CategoryDetailsComponent } from "./category-details/category-details.component";

@Component({
  selector: 'app-category-admin-page',
  imports: [CategoryDetailsComponent],
  templateUrl: './category-admin-page.component.html'
})
export class CategoryAdminPageComponent {

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  categoryService = inject(CategoriesService);

    categoryId = toSignal(
      this.activatedRoute.params.pipe(
        map((params)=> params['id'])
      )
    );

    categoryResource = rxResource({
      request: () => ({
        id: this.categoryId()
      }),
      loader: ({ request }) => {
        return this.categoryService.getCategoryById( request.id );
      }
    });

    redirectEffect = effect(() => {
      if (this.categoryResource.error()) {
        this.router.navigateByUrl('/admin');
      }
    })

}
