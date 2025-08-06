import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventsService } from '@events/services/events.service';
import { catchError, map, throwError } from 'rxjs';
import { NotFoundPageComponent } from '../not-found-page/not-found-page.component';
import { ImageCarouselComponent } from '@shared/components/image-carousel/image-carousel.component';
import { RelatedEventsComponent } from '@events/components/related-events/related-events.component';

@Component({
  selector: 'app-event-page',
  imports: [RouterLink, NotFoundPageComponent, ImageCarouselComponent, RelatedEventsComponent],
  templateUrl: './event-page.component.html'
})
export class EventPageComponent {

  eventService = inject(EventsService);

  route = inject(ActivatedRoute);

  eventSlug = toSignal(this.route.params.pipe(
      map( ({ idSlug }) => idSlug )
  ));

  eventResource = rxResource({
    request: () => ({ idSlug: this.eventSlug() }),
    loader: ({ request }) => {
      return this.eventService.getEventBySlug( request.idSlug ).pipe(
      catchError((error) => {
      return throwError(() => error);
      })
    );
    }
  })

}
