import { Component, effect, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { CatalogDetailsComponent } from './catalog-details/catalog-details.component';
import { CatalogsService } from '@catalogs/services/catalogs.service';

@Component({
  selector: 'app-catalog-admin-page',
  imports: [CatalogDetailsComponent],
  templateUrl: './catalog-admin-page.component.html'
})
export class CatalogAdminPageComponent {

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  catalogService = inject(CatalogsService);

    catalogId = toSignal(
      this.activatedRoute.params.pipe(
        map((params)=> params['id'])
      )
    );

    catalogResource = rxResource({
      request: () => ({
        id: this.catalogId()
      }),
      loader: ({ request }) => {
        return this.catalogService.getCatalogById( request.id );
      }
    });

    redirectEffect = effect(() => {
      if (this.catalogResource.error()) {
        this.router.navigateByUrl('/admin');
      }
    })


}
