import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CategoryTableComponent } from "@dashboard/components/category-table/category-table.component";
import { CategoriesService } from '@products/services/categories.service';
import { CategoryOrderComponent } from "@dashboard/components/category-order/category-order.component";

@Component({
  selector: 'app-categories-admin-page',
  imports: [RouterLink, CategoryTableComponent, CategoryOrderComponent],
  templateUrl: './categories-admin-page.component.html'
})
export class CategoriesAdminPageComponent {

  categoriesService = inject(CategoriesService);
  refreshSignal = signal(0);

  categoryResource = rxResource({
    request: () => ({ refresh: this.refreshSignal() }),
    loader: () => this.categoriesService.getCategories({ })
  });

  onDeleteCategory(id: number) {
    this.categoriesService.deleteCategory(id).subscribe({
      next: () => {
        // Recargar después de borrar
        this.refreshSignal.update(n => n + 1);
      },
      error: (err) => {
        console.error('Error eliminando evento:', err);
      }
    });
  }

}
