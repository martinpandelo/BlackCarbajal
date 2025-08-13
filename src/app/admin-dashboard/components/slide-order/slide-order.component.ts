import { Component, effect, inject, input, signal } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SlideService } from '@website-front/services/slide.service';
import { Slides } from '@website-front/interfaces/slide.interface';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';

@Component({
  selector: 'slide-order',
  imports: [DragDropModule, ScrollingModule, pathImagePipe],
  templateUrl: './slide-order.component.html'
})
export class SlideOrderComponent {

  slideService = inject(SlideService);

  slidesInput = input.required<Slides[]>();
  slides = signal<Slides[]>([]);
  wasSaved = signal(false);

  constructor() {
    effect(() => {
      this.slides.set([...this.slidesInput()]);
    });
  }

  drop(event: CdkDragDrop<Slides[]>) {
    const updated = [...this.slides()];
    moveItemInArray(updated, event.previousIndex, event.currentIndex);

    // Actualiza el orden temporalmente en el front
    updated.forEach((slide, index) => {
      slide.order = index + 1;
    });

    this.slides.set(updated);
  }

  saveOrder() {
    const orders = this.slides().map(slide => ({
      id: slide.id,
      order: slide.order
    }));

    this.slideService.updateSlidesOrder(orders).subscribe(() => {
      this.wasSaved.set(true);

      setTimeout(() => this.wasSaved.set(false), 3000);
    });
  }

}
