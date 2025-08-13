import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Slides } from '@website-front/interfaces/slide.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiUrl = environment.productsApiUrl;

const emptySlide: Slides = {
  id: 0,
  image_desktop: '',
  image_mobile: '',
  order: 0
}


@Injectable({
  providedIn: 'root'
})
export class SlideService {

      private http = inject(HttpClient);
      private slideCache = new Map<string, Slides[]>();

      getSlides():Observable<Slides[]> {

        const cacheKey = 'slides';

        if (this.slideCache.has( cacheKey )) {
          return of(this.slideCache.get(cacheKey)!);
        }

        return this.http.get<Slides[]>(`${apiUrl}/slide`).pipe(
          tap( response => {
            console.log({response});
            this.slideCache.set( cacheKey, response);
          })
        )
      }

      getSlideById( id: number): Observable<Slides>{
        const idNum = Number(id);

        if (idNum === 0) {
          return of(emptySlide);
        }

        return this.http.get<Slides>(`${apiUrl}/slide/id/${id}`)
      }

      uploadImage(file: File): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ fileName: string }>(`${apiUrl}/files/slide`, formData)
          .pipe(map(resp => resp.fileName));
      }

      createSlide(slide: Partial<Slides>, desktopFile?: File, mobileFile?: File): Observable<Slides> {
        return forkJoin({
          desktop: desktopFile ? this.uploadImage(desktopFile) : of(slide.image_desktop || ''),
          mobile: mobileFile ? this.uploadImage(mobileFile) : of(slide.image_mobile || '')
        }).pipe(
          switchMap(images =>
            this.http.post<Slides>(`${apiUrl}/slide`, {
              ...slide,
              image_desktop: images.desktop,
              image_mobile: images.mobile
            })
          ),
          tap((slide) => {
            this.slideCache.clear();
            this.updateSlideCache(slide);
          })
        );
      }

      updateSlide(id: number, slide: Partial<Slides>, desktopFile?: File, mobileFile?: File): Observable<Slides> {
        return forkJoin({
          desktop: desktopFile ? this.uploadImage(desktopFile) : of(slide.image_desktop || ''),
          mobile: mobileFile ? this.uploadImage(mobileFile) : of(slide.image_mobile || '')
        }).pipe(
          switchMap(images =>
            this.http.patch<Slides>(`${apiUrl}/slide/${id}`, {
              ...slide,
              image_desktop: images.desktop,
              image_mobile: images.mobile
            })
          ),
          tap((slide) => this.updateSlideCache(slide))
        );
      }

      deleteSlide(id: number): Observable<void> {
        return this.http.delete<void>(`${apiUrl}/slide/${id}`).pipe(
          tap(() => {
            this.removeSlideFromCache(id);
            this.slideCache.clear();
          })
        );
      }

      updateSlidesOrder(orders: { id: number; order: number }[]) {
        return this.http.patch(`${apiUrl}/update-order-slides`, { orders }).pipe(
          tap(() => {
            this.slideCache.clear();
          })
        );
      }

      private removeSlideFromCache(id: number) {
        this.slideCache.forEach((slidesArray, key) => {
          const filteredSlides = slidesArray.filter(slide => slide.id !== id);
          this.slideCache.set(key, filteredSlides);
        });
      }

      updateSlideCache(slide: Slides) {
        const slideId = slide.id;

        this.slideCache.forEach((slidesArray, key) => {
            const updatedArray = slidesArray.map(currentSlide =>
              currentSlide.id === slideId ? slide : currentSlide
            );
            this.slideCache.set(key, updatedArray);
        });
      }

}
