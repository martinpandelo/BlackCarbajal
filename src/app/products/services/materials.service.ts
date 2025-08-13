import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Material, MaterialsResponse } from '@products/interfaces/materials.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiUrl = environment.productsApiUrl;

const emptyMaterial: Material = {
  id: 0,
  slug: '',
  name: '',
  description: ''
}

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {

  private http = inject(HttpClient);

  private materialsCache = new Map<string, MaterialsResponse>();
  private materialCacheById = new Map<number, Material>();

  getMaterials(): Observable<MaterialsResponse> {
    const cacheKey = 'all';

    if (this.materialsCache.has(cacheKey)) {
      return of(this.materialsCache.get(cacheKey)!)
    }
    return this.http.get<MaterialsResponse>(`${apiUrl}/materials`).pipe(
      tap( resp => {
        this.materialsCache.set(cacheKey, resp);
      })
    );
  }

  getMaterialById( id: number): Observable<Material>{
    const idNum = Number(id);

    if (idNum === 0) {
      return of(emptyMaterial);
    }

    if (this.materialCacheById.has(id)) {
      return of(this.materialCacheById.get(id)!)
    }

    return this.http.get<Material>(`${apiUrl}/materials/id/${id}`).pipe(
      tap( resp => {
        this.materialCacheById.set(id,resp);
      })
    )
  }

  createMaterial(materialLike: Partial<Material>): Observable<Material>{
      return this.http.post<Material>(`${apiUrl}/materials`, materialLike).pipe(
        tap((material) => {
          this.materialsCache.clear();
          this.updateMaterialCache(material);
        })
      )
  }

  updateMaterial(id:number, materialLike: Partial<Material>): Observable<Material>{
    return this.http.patch<Material>(`${apiUrl}/materials/${id}`, materialLike).pipe(
      tap(( material ) => this.updateMaterialCache(material))
    )
  }

  deleteMaterial(id: number): Observable<void> {
      return this.http.delete<void>(`${apiUrl}/materials/${id}`).pipe(
        tap(() => {
          this.removeMaterialFromCache(id);
          this.materialsCache.clear();
        })
      );
  }

  private removeMaterialFromCache(id: number) {
    this.materialCacheById.delete(id);

    this.materialsCache.forEach((response, key) => {
      const filteredMaterials = response.materials.filter(material => material.id !== id);
      this.materialsCache.set(key, {
        ...response,
        materials: filteredMaterials,
      });
    });
  }

  private updateMaterialCache(material: Material) {
      this.materialCacheById.set(material.id, material);

      const materialId = material.id;

      this.materialsCache.forEach(materialsResponse => {
        materialsResponse.materials = materialsResponse.materials.map(currentMaterial =>
          currentMaterial.id === materialId ? material : currentMaterial
        );
      });
  }

}
