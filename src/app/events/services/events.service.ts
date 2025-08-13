import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EventItem, EventsResponse } from '@events/interfaces/events.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const apiUrl = environment.productsApiUrl;

interface Options {
  limit?: number,
  offset?: number
}

const emptyEvent: EventItem = {
  id: 0,
  slug: '',
  title: '',
  description: '',
  images: []
}


@Injectable({
  providedIn: 'root'
})
export class EventsService {

    private http = inject(HttpClient);
    private eventsCache = new Map<string, EventsResponse>();
    private eventCache = new Map<string, EventItem>();
    private eventCacheById = new Map<number, EventItem>();

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

      return this.http.get<EventItem>(`${ apiUrl }/events/slug/${slug}`)
      .pipe(
        tap((event) => {
          this.eventCache.set( event.slug, event );
          this.eventCacheById.set(event.id, event);
        })
      )
    }

    getEventById(id: string): Observable<EventItem> {
      const idNum = Number(id);

      if (idNum === 0) {
        return of(emptyEvent);
      }

      if (this.eventCacheById.has(idNum)) {
        return of(this.eventCacheById.get(idNum)!);
      }

      return this.http.get<EventItem>(`${apiUrl}/events/id/${id}`).pipe(
        tap(event => {
          this.eventCacheById.set(event.id, event);
          this.eventCache.set(event.slug, event);
        })
      );
    }

    createEvent(eventLike: Partial<EventItem>, imageFileList?: FileList): Observable<EventItem>{
      const currentImages = eventLike.images ?? [];

      return this.uploadImages(imageFileList).pipe(
        map(imageNames => ({
          ...eventLike,
          images: [...currentImages, ...imageNames]
        })),
        switchMap((eventLike) =>
          this.http.post<EventItem>(`${apiUrl}/events`, eventLike)
        ),
        tap((event) => {
          this.eventsCache.clear();
          this.updateEventCache(event);
        })
      );
    }

    updateEvent(id:number, data: any, imageFileList?: FileList): Observable<EventItem>{
      const currentImages = data.images ?? [];

      return this.uploadImages(imageFileList)
        .pipe(
          map(imageNames => ({
            ... data,
            images: [...currentImages, ...imageNames]
          })),
          switchMap( (updatedEvent) => this.http.patch<EventItem>(`${apiUrl}/events/${id}`, updatedEvent) ),
          tap(( event ) => this.updateEventCache(event))
        )
    }

    deleteEvent(id: number): Observable<void> {
      return this.http.delete<void>(`${apiUrl}/events/${id}`).pipe(
        tap(() => {
          this.removeEventFromCache(id);
          this.eventsCache.clear();
        })
      );
    }

    uploadImages(images?: FileList): Observable<string[]>{
      if(!images) return of([]);

      const uploadObservables = Array.from(images).map(imageFile => this.uploadImage(imageFile));

      return forkJoin(uploadObservables).pipe(
        tap( (imagesName) => console.log({imagesName}))
      )
    }

    uploadImage(imageFile: File): Observable<string>{
      const formData = new FormData();
      formData.append('file', imageFile);

      return this.http.post<{ fileName: string}>(`${apiUrl}/files/event`, formData).pipe(
        map( (resp) => resp.fileName )
      )
    }

    private removeEventFromCache(id: number) {
      this.eventCacheById.delete(id);

      for (const [slug, event] of this.eventCache.entries()) {
        if (event.id === id) {
          this.eventCache.delete(slug);
          break;
        }
      }

      this.eventsCache.forEach((response, key) => {
        const filteredEvents = response.events.filter(event => event.id !== id);
        this.eventsCache.set(key, {
          ...response,
          events: filteredEvents,
        });
      });
    }

    private updateEventCache(event: EventItem) {
      this.eventCacheById.set(event.id, event);
      this.eventCache.set(event.slug, event);

      const eventId = event.id;

      this.eventsCache.forEach(eventsResponse => {
        eventsResponse.events = eventsResponse.events.map(currentEvent =>
          currentEvent.id === eventId ? event : currentEvent
        );
      });
    }

}
