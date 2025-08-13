import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Type, TypesResponse } from '@products/interfaces/types.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiUrl = environment.productsApiUrl;

const emptyType: Type = {
  id: 0,
  slug: '',
  name: ''
}

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  private http = inject(HttpClient);
  private typesCache = new Map<string, TypesResponse>();
  private typeCacheById = new Map<number, Type>();

  getTypes(): Observable<TypesResponse> {
    const cacheKey = 'all';

    if (this.typesCache.has(cacheKey)) {
      return of(this.typesCache.get(cacheKey)!)
    }
    return this.http.get<TypesResponse>(`${apiUrl}/types`).pipe(
      tap( resp => {
        this.typesCache.set(cacheKey, resp);
      })
    );
  }

  getTypeById( id: number): Observable<Type>{
    const idNum = Number(id);

    if (idNum === 0) {
      return of(emptyType);
    }

    if (this.typeCacheById.has(id)) {
      return of(this.typeCacheById.get(id)!)
    }

    return this.http.get<Type>(`${apiUrl}/types/id/${id}`).pipe(
      tap( resp => {
        this.typeCacheById.set(id,resp);
      })
    )
  }

  createType(typeLike: Partial<Type>): Observable<Type>{
      return this.http.post<Type>(`${apiUrl}/types`, typeLike).pipe(
        tap((type) => {
          this.typesCache.clear();
          this.updateTypeCache(type);
        })
      )
  }

  updateType(id:number, typeLike: Partial<Type>): Observable<Type>{
    return this.http.patch<Type>(`${apiUrl}/types/${id}`, typeLike).pipe(
      tap(( type ) => this.updateTypeCache(type))
    )
  }

  deleteType(id: number): Observable<void> {
      return this.http.delete<void>(`${apiUrl}/types/${id}`).pipe(
        tap(() => {
          this.removeTypeFromCache(id);
          this.typesCache.clear();
        })
      );
  }

  private removeTypeFromCache(id: number) {
    this.typeCacheById.delete(id);

    this.typesCache.forEach((response, key) => {
      const filteredTypes = response.types.filter(type => type.id !== id);
      this.typesCache.set(key, {
        ...response,
        types: filteredTypes,
      });
    });
  }

  private updateTypeCache(type: Type) {
      this.typeCacheById.set(type.id, type);

      const typeId = type.id;

      this.typesCache.forEach(TypesResponse => {
        TypesResponse.types = TypesResponse.types.map(currentType =>
          currentType.id === typeId ? type : currentType
        );
      });
  }

}
