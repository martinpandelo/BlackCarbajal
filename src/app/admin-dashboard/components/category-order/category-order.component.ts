import { Component, effect, inject, input, signal } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Category } from '@products/interfaces/categories.interface';
import { CategoriesService } from '@products/services/categories.service';

@Component({
  selector: 'category-order',
  imports: [DragDropModule, ScrollingModule],
  templateUrl: './category-order.component.html'
})
export class CategoryOrderComponent {

  categoryService = inject(CategoriesService);

  categoriesInput = input.required<Category[]>();
  categories = signal<Category[]>([]);
  wasSaved = signal(false);

  constructor() {
    effect(() => {
      this.categories.set([...this.categoriesInput()]);
    });
  }

  drop(event: CdkDragDrop<Category[]>) {
    const updated = [...this.categories()];
    moveItemInArray(updated, event.previousIndex, event.currentIndex);

    // Actualiza el orden temporalmente en el front
    updated.forEach((cat, index) => {
      cat.order = index + 1;
    });

    this.categories.set(updated);
  }

  saveOrder() {
    const orders = this.categories().map(cat => ({
      id: cat.id,
      order: cat.order
    }));

    this.categoryService.updateCategoriesOrder(orders).subscribe(() => {
      this.wasSaved.set(true);

      setTimeout(() => this.wasSaved.set(false), 3000);
    });
  }

}
