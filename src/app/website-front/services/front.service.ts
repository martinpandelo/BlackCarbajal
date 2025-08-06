import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Slides } from '@website-front/interfaces/slide.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const apiUrl = environment.productsApiUrl;

@Injectable({
  providedIn: 'root'
})
export class FrontService {

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


}
