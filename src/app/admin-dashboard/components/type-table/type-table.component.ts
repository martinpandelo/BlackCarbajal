import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Type } from '@products/interfaces/types.interface';

@Component({
  selector: 'type-table',
  imports: [RouterLink],
  templateUrl: './type-table.component.html'
})
export class TypeTableComponent {

  @Input() types: Type[] = [];

  @Output() delete = new EventEmitter<number>();

  onDeleteType(typeId: number) {
    if (confirm('¿Estás seguro que querés eliminar este articulo?')) {
      this.delete.emit(typeId);
    }
  }

}
