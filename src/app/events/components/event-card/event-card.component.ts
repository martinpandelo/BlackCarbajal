import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventItem } from '@events/interfaces/events.interface';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';
import { TruncateTextPipe } from '@shared/pipes/truncate-text.pipe';

@Component({
  selector: 'event-card',
  imports: [RouterLink, pathImagePipe, TruncateTextPipe],
  templateUrl: './event-card.component.html'
})
export class EventCardComponent {

  event = input.required<EventItem>();

}
