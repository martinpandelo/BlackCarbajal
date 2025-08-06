import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EventsService } from '@events/services/events.service';
import { map, of } from 'rxjs';
import { EventCardComponent } from '../event-card/event-card.component';

@Component({
  selector: 'related-events',
  imports: [EventCardComponent],
  templateUrl: './related-events.component.html'
})
export class RelatedEventsComponent {

  eventExclude = input.required<string>();

  eventService = inject(EventsService);

  relatedEventsResource = rxResource({
    request: () => {
      return {
        exclude: this.eventExclude()
      };
    },
    loader: ({ request }) => {
      if (!request) return of({ events: [] });
      return this.eventService.getEvents({ }).pipe(
        map(res => ({
          events: res.events
          .filter(p => p.slug !== request.exclude)
          .slice(0, 12)
        }))
      );
    }
  });

}
