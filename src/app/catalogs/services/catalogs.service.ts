import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Catalogs } from '@catalogs/interfaces/catalogs.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const apiUrl = environment.productsApiUrl;

@Injectable({
  providedIn: 'root'
})
export class CatalogsService {

  private http = inject(HttpClient);
  private catalogsCache = new Map<string, Catalogs[]>();

  getCatalogs():Observable<Catalogs[]> {

      const cacheKey = 'catalogs';

      if (this.catalogsCache.has( cacheKey )) {
        return of(this.catalogsCache.get(cacheKey)!);
      }

      return this.http.get<Catalogs[]>(`${apiUrl}/catalogs`).pipe(
        tap( response => {
          console.log({response});
          this.catalogsCache.set( cacheKey, response);
        })
      )

  }


}
