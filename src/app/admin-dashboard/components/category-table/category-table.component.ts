import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '@products/interfaces/categories.interface';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';

@Component({
  selector: 'category-table',
  imports: [RouterLink, pathImagePipe],
  templateUrl: './category-table.component.html'
})
export class CategoryTableComponent {

  @Input() categories: Category[] = [];

  @Output() delete = new EventEmitter<number>();

  onDeleteCategory(categoryId: number) {
    if (confirm('¿Estás seguro que querés eliminar este evento?')) {
      this.delete.emit(categoryId);
    }
  }

}
