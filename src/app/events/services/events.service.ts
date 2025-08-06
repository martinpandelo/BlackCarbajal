import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EventItem, EventsResponse } from '@events/interfaces/events.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const apiUrl = environment.productsApiUrl;

interface Options {
  limit?: number,
  offset?: number
}


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private http = inject(HttpClient);
  private eventsCache = new Map<string, EventsResponse>();
  private eventCache = new Map<string, EventItem>();


  getEvents( options: Options ):Observable<EventsResponse> {

    const { limit = 48, offset = 0 } = options;

    const key = `${limit}-${offset}`;

    if (this.eventsCache.has( key )) {
      return of(this.eventsCache.get(key)!);
    }

    return this.http.get<EventsResponse>(`${apiUrl}/events`, {
      params: {
        limit: limit,
        offset: offset,
      }
    }).pipe(
      tap( response => {
        this.eventsCache.set( key, response);
      })
    )

  }

  getEventBySlug( slug: string ): Observable<EventItem> {

    if (this.eventCache.has(slug)) {
      return of(this.eventCache.get(slug)!)
    }

    return this.http.get<EventItem>(`${ apiUrl }/events/${slug}`)
    .pipe(
      tap((response) => {
        this.eventCache.set( slug, response )
      })
    )
  }

}
