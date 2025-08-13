import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';
import { Slides } from '@website-front/interfaces/slide.interface';

@Component({
  selector: 'slide-table',
  imports: [RouterLink, pathImagePipe],
  templateUrl: './slide-table.component.html'
})
export class SlideTableComponent {

  @Input() slides: Slides[] = [];

  @Output() delete = new EventEmitter<number>();

  onDeleteSlide(slideId: number) {
    if (confirm('¿Estás seguro que querés eliminar este slide?')) {
      this.delete.emit(slideId);
    }
  }

}
