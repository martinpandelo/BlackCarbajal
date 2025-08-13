import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EventTableComponent } from '@dashboard/components/event-table/event-table.component';
import { EventsService } from '@events/services/events.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-events-list-admin-page',
  imports: [EventTableComponent, PaginationComponent, RouterLink],
  templateUrl: './events-list-admin-page.component.html'
})
export class EventsListAdminPageComponent {

    eventsService = inject(EventsService);
    paginationService = inject(PaginationService);

    eventsPerPage = signal(50);

    refreshSignal = signal(0);

    eventResource = rxResource({
      request: () => ({
        page: this.paginationService.currentPage() - 1,
        limit: this.eventsPerPage(),
        refresh: this.refreshSignal(),
      }),
      loader: ({ request }) => this.eventsService.getEvents({
        offset: request.page * request.limit,
        limit: request.limit
      })
    });


    onDeleteEvent(id: number) {
      this.eventsService.deleteEvent(id).subscribe({
        next: () => {
          // Recargar los eventos después de borrar
          this.refreshSignal.update(n => n + 1);
        },
        error: (err) => {
          console.error('Error eliminando evento:', err);
        }
      });
    }

}
