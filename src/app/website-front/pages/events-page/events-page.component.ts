import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { EventCardComponent } from '@events/components/event-card/event-card.component';
import { EventsService } from '@events/services/events.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-events-page',
  imports: [RouterLink, PaginationComponent, EventCardComponent],
  templateUrl: './events-page.component.html'
})
export class EventsPageComponent {

  eventsService = inject(EventsService);
  paginationService = inject(PaginationService);


  eventResource = rxResource({
    request: () => ({ page: this.paginationService.currentPage() - 1 }),
    loader: ({ request }) => {
      return this.eventsService.getEvents({ offset: request.page * this.paginationService.productsPerPage })
    }
  });

}
