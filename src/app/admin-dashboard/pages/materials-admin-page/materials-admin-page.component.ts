import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MaterialsService } from '@products/services/materials.service';
import { MaterialTableComponent } from "@dashboard/components/material-table/material-table.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-materials-admin-page',
  imports: [MaterialTableComponent, RouterLink],
  templateUrl: './materials-admin-page.component.html'
})
export class MaterialsAdminPageComponent {

  materialsService = inject(MaterialsService);
  refreshSignal = signal(0);

  materialResource = rxResource({
    request: () => ({ refresh: this.refreshSignal() }),
    loader: () => this.materialsService.getMaterials()
  });

  onDeleteMaterial(id: number) {
    this.materialsService.deleteMaterial(id).subscribe({
      next: () => {
        // Recargar después de borrar
        this.refreshSignal.update(n => n + 1);
      },
      error: (err) => {
        console.error('Error eliminando material:', err);
      }
    });
  }

}
