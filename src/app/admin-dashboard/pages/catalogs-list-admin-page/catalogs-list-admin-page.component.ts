import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CatalogsService } from '@catalogs/services/catalogs.service';
import { CatalogTableComponent } from "@dashboard/components/catalog-table/catalog-table.component";

@Component({
  selector: 'app-catalogs-list-admin-page',
  imports: [CatalogTableComponent, RouterLink],
  templateUrl: './catalogs-list-admin-page.component.html'
})
export class CatalogsListAdminPageComponent {

  catalogsService = inject(CatalogsService);
  refreshSignal = signal(0);

  catalogResource = rxResource({
    request: () => ({ refresh: this.refreshSignal() }),
    loader: () => this.catalogsService.getCatalogs()
  });

  onDeleteCatalog(id: number) {
    this.catalogsService.deleteCatalog(id).subscribe({
      next: () => {
        this.refreshSignal.update(n => n + 1);
      },
      error: (err) => {
        console.error('Error eliminando evento:', err);
      }
    });
  }

}
