import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { CatalogsService } from '@catalogs/services/catalogs.service';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';

@Component({
  selector: 'app-catalogs-page',
  imports: [RouterLink, pathImagePipe],
  templateUrl: './catalogs-page.component.html'
})
export class CatalogsPageComponent {

  catalogsService = inject(CatalogsService);

  catalogsResource = rxResource({
    loader: () => {
      return this.catalogsService.getCatalogs()
    }
  });

}
