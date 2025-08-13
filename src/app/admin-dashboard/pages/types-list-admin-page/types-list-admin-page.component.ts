import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TypesService } from '@products/services/types.service';
import { RouterLink } from '@angular/router';
import { TypeTableComponent } from '@dashboard/components/type-table/type-table.component';

@Component({
  selector: 'app-types-admin-page',
  imports: [TypeTableComponent, RouterLink],
  templateUrl: './types-list-admin-page.component.html'
})
export class TypesListAdminPageComponent {

  typesService = inject(TypesService);
  refreshSignal = signal(0);

  typeResource = rxResource({
    request: () => ({ refresh: this.refreshSignal() }),
    loader: () => this.typesService.getTypes()
  });

  onDeleteType(id: number) {
    this.typesService.deleteType(id).subscribe({
      next: () => {
        // Recargar los productos después de borrar
        this.refreshSignal.update(n => n + 1);
      },
      error: (err) => {
        console.error('Error eliminando type:', err);
      }
    });
  }

}
