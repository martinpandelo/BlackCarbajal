import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Catalogs } from '@catalogs/interfaces/catalogs.interface';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const apiUrl = environment.productsApiUrl;

const emptyCatalog: Catalogs = {
  id: 0,
  title: '',
  link: '',
  image: '',
}

@Injectable({
  providedIn: 'root'
})
export class CatalogsService {

  private http = inject(HttpClient);
  private catalogsCache = new Map<string, Catalogs[]>();
  private catalogCacheById = new Map<number, Catalogs>();

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

  getCatalogById( id: number): Observable<Catalogs>{
      const idNum = Number(id);

      if (idNum === 0) {
        return of(emptyCatalog);
      }

      if (this.catalogCacheById.has(id)) {
        return of(this.catalogCacheById.get(id)!)
      }

      return this.http.get<Catalogs>(`${apiUrl}/catalogs/id/${id}`).pipe(
        tap( resp => {
          this.catalogCacheById.set(id,resp);
        })
      )
    }

    createCatalog(catalogLike: Partial<Catalogs>, imageFileList?: FileList): Observable<Catalogs> {
      const currentImage = catalogLike.image ?? '';

      return this.uploadImageFile(imageFileList).pipe(
        map(imageName => ({
          ...catalogLike,
          image: imageName || currentImage
        })),
        switchMap((catalogLike) =>
          this.http.post<Catalogs>(`${apiUrl}/catalogs`, catalogLike)
        ),
        tap((catalog) => {
          this.catalogsCache.clear();
          this.updateCatalogCache(catalog);
        })
      );
    }

    updateCatalog(id: number, data: Partial<Catalogs>, imageFileList?: FileList): Observable<Catalogs> {
      const currentImage = data.image ?? '';

      return this.uploadImageFile(imageFileList).pipe(
        map(imageName => ({
          ...data,
          image: imageName || currentImage
        })),
        switchMap((updatedCatalog) =>
          this.http.patch<Catalogs>(`${apiUrl}/catalogs/${id}`, updatedCatalog)
        ),
        tap((catalog) => this.updateCatalogCache(catalog))
      );
    }

    uploadImageFile(imageFileList?: FileList): Observable<string> {
      if (!imageFileList || imageFileList.length === 0) {
        return of('');
      }

      const file = imageFileList[0];
      return this.uploadImage(file);
    }

    uploadImage(imageFile: File): Observable<string> {
      const formData = new FormData();
      formData.append('file', imageFile);

      return this.http.post<{ fileName: string }>(`${apiUrl}/files/catalog`, formData).pipe(
        map((resp) => resp.fileName)
      );
    }

    deleteCatalog(id: number): Observable<void> {
        return this.http.delete<void>(`${apiUrl}/catalogs/${id}`).pipe(
          tap(() => {
            this.removeCatalogFromCache(id);
            this.catalogsCache.clear();
          })
        );
    }

    private removeCatalogFromCache(id: number) {
      this.catalogCacheById.delete(id);

      this.catalogsCache.forEach((catalogsArray, key) => {
        const filteredCatalogs = catalogsArray.filter(catalog => catalog.id !== id);
        this.catalogsCache.set(key, filteredCatalogs);
      });
    }

    private updateCatalogCache(catalog: Catalogs) {
        this.catalogCacheById.set(catalog.id, catalog);

        const catalogId = catalog.id;

        this.catalogsCache.forEach((catalogsArray, key) => {
          const updatedArray = catalogsArray.map(currentCatalog =>
            currentCatalog.id === catalogId ? catalog : currentCatalog
          );
          this.catalogsCache.set(key, updatedArray);
        });
    }


}
