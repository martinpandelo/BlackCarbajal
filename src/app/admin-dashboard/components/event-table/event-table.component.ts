import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventItem } from '@events/interfaces/events.interface';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';

@Component({
  selector: 'event-table',
  imports: [RouterLink, pathImagePipe],
  templateUrl: './event-table.component.html'
})
export class EventTableComponent {

  @Input() events: EventItem[] = [];

  @Output() delete = new EventEmitter<number>();

  onDeleteEvent(productId: number) {
    if (confirm('¿Estás seguro que querés eliminar esta noticia?')) {
      this.delete.emit(productId);
    }
  }

}
