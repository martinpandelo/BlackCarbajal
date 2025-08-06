import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Material } from '@products/interfaces/materials.interface';

@Component({
  selector: 'material-table',
  imports: [RouterLink],
  templateUrl: './material-table.component.html'
})
export class MaterialTableComponent {

  @Input() materials: Material[] = [];

  @Output() delete = new EventEmitter<number>();

  onDeleteMaterial(materialId: number) {
    if (confirm('¿Estás seguro que querés eliminar este material?')) {
      this.delete.emit(materialId);
    }
  }

}
