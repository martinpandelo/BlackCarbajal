import { Component, effect, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '@events/services/events.service';
import { map } from 'rxjs';
import { EventDetailsComponent } from "./event-details/event-details.component";

@Component({
  selector: 'app-event-admin-page',
  imports: [EventDetailsComponent],
  templateUrl: './event-admin-page.component.html'
})
export class EventAdminPageComponent {

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  eventService = inject(EventsService);

  eventId = toSignal(
    this.activatedRoute.params.pipe(
      map((params)=> params['id'])
    )
  );

  eventResource = rxResource({
    request: () => ({
      id: this.eventId()
    }),
    loader: ({ request }) => {
      return this.eventService.getEventById( request.id );
    }
  });

  redirectEffect = effect(() => {
    if (this.eventResource.error()) {
      this.router.navigateByUrl('/admin');
    }
  })

}
