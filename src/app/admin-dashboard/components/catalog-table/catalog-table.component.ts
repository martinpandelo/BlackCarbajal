import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Catalogs } from '@catalogs/interfaces/catalogs.interface';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';

@Component({
  selector: 'catalog-table',
  imports: [RouterLink, pathImagePipe],
  templateUrl: './catalog-table.component.html'
})
export class CatalogTableComponent {

  @Input() catalogs: Catalogs[] = [];

  @Output() delete = new EventEmitter<number>();

  onDeleteCatalog(catalogId: number) {
    if (confirm('¿Estás seguro que querés eliminar este catálogo?')) {
      this.delete.emit(catalogId);
    }
  }

}
