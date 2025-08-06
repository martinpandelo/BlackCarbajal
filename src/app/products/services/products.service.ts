import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CategoriesResponse } from '@products/interfaces/categories.interface';
import { MaterialsResponse } from '@products/interfaces/materials.interface';
import { Product, ProductsResponse } from '@products/interfaces/products.interface';
import { TypesResponse } from '@products/interfaces/types.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const apiUrl = environment.productsApiUrl;

interface Options {
  limit?: number,
  offset?: number,
  categoria?: string,
  tipo?: string;
  material?: string;
  novedad?: boolean,
  search?: string,
  sortBy?: string,
  direction?: 'asc' | 'desc'
}

const emptyProduct: Product = {
  id: 0,
  slug: '',
  cod: '',
  title: '',
  description: '',
  categories: [],
  type: {
    slug: '',
    name: ''
  },
  material: {
    slug: '',
    name: '',
    description: ''
  },
  images: [],
  novelty: false
}


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCacheById = new Map<number, Product>();
  private productCacheBySlug = new Map<string, Product>();
  private productCacheRelated = new Map<string, Product[]>();
  private categoriesCache = new Map<string, CategoriesResponse>();


  getProducts(options: Options): Observable<ProductsResponse> {
    const {
      limit = 50,
      offset = 0,
      categoria = '',
      tipo = '',
      material = '',
      novedad = false,
      search = '',
      sortBy = 'pd_id',
      direction = 'asc'
    } = options;

    const key = `${limit}-${offset}-${categoria}-${novedad}-${search}-${sortBy}-${direction}-${tipo}-${material}`;

    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http.get<ProductsResponse>(`${apiUrl}/products`, {
      params: {
        limit,
        offset,
        categoria,
        tipo,
        material,
        novedad,
        search,
        sortBy,
        direction,
      }
    }).pipe(
      tap(response => {
        this.productsCache.set(key, response);
      })
    );
  }


  getCategories( options: Options ):Observable<CategoriesResponse> {
    const { categoria = '' } = options;

    if (this.categoriesCache.has( categoria )) {
      return of(this.categoriesCache.get(categoria)!);
    }

    return this.http.get<CategoriesResponse>(`${apiUrl}/categories`, {
      params: {
        categoria: categoria,
      }
    }).pipe(
      tap( response => {
        this.categoriesCache.set( categoria, response);
      })
    )
  }

  getTypes(): Observable<TypesResponse> {
    return this.http.get<TypesResponse>(`${apiUrl}/types`);
  }

  getMaterials(): Observable<MaterialsResponse> {
    return this.http.get<MaterialsResponse>(`${apiUrl}/materials`);
  }

  getProductBySlug(slug: string): Observable<Product> {
    if (this.productCacheBySlug.has(slug)) {
      return of(this.productCacheBySlug.get(slug)!);
    }

    return this.http.get<Product>(`${apiUrl}/products/slug/${slug}`).pipe(
      tap(product => {
        this.productCacheBySlug.set(product.slug, product);
        this.productCacheById.set(product.id, product);
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    const idNum = Number(id);

    if (idNum === 0) {
      return of(emptyProduct);
    }

    if (this.productCacheById.has(idNum)) {
      return of(this.productCacheById.get(idNum)!);
    }

    return this.http.get<Product>(`${apiUrl}/products/id/${id}`).pipe(
      tap(product => {
        this.productCacheById.set(product.id, product);
        this.productCacheBySlug.set(product.slug, product);
      })
    );
  }

  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product>{
    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map(imageNames => ({
        ...productLike,
        images: [...currentImages, ...imageNames]
      })),
      switchMap((productLike) =>
        this.http.post<Product>(`${apiUrl}/products`, productLike)
      ),
      tap((product) => {
        this.productsCache.clear();
        this.updateProductCache(product);
      })
    );
  }

  updateProduct(id:number, data: any, imageFileList?: FileList): Observable<Product>{
    const currentImages = data.images ?? [];

    return this.uploadImages(imageFileList)
      .pipe(
        map(imageNames => ({
          ... data,
          images: [...currentImages, ...imageNames]
        })),
        switchMap( (updatedProduct) => this.http.patch<Product>(`${apiUrl}/products/${id}`, updatedProduct) ),
        tap(( product ) => this.updateProductCache(product))
      )
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${apiUrl}/products/${id}`).pipe(
      tap(() => {
        this.removeProductFromCache(id);
        this.productsCache.clear();
      })
    );
  }

  private removeProductFromCache(id: number) {
    // Borrar de los mapas individuales
    this.productCacheById.delete(id);

    // También eliminar del cache por slug
    for (const [slug, product] of this.productCacheBySlug.entries()) {
      if (product.id === id) {
        this.productCacheBySlug.delete(slug);
        break;
      }
    }

    // Limpiar el producto de todos los arrays de products en el cache
    this.productsCache.forEach((response, key) => {
      const filteredProducts = response.products.filter(product => product.id !== id);
      this.productsCache.set(key, {
        ...response,
        products: filteredProducts,
      });
    });
  }

  updateProductCache(product: Product) {
    this.productCacheById.set(product.id, product);
    this.productCacheBySlug.set(product.slug, product);

    const productId = product.id;

    this.productsCache.forEach(productsResponse => {
      productsResponse.products = productsResponse.products.map(currentProduct =>
        currentProduct.id === productId ? product : currentProduct
      );
    });
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

    return this.http.post<{ fileName: string}>(`${apiUrl}/files/product`, formData).pipe(
      map( (resp) => resp.fileName )
    )
  }

  getAllRelatedGroups() {
    return this.http.get<{ key: string, image: string }[]>(`${apiUrl}/products/relacionados`);
  }

  uploadRelatedGroupImage(formData: FormData) {
    return this.http.post(`${apiUrl}/products/relacionados`, formData);
  }

  deleteRelatedGroup(key: string) {
    return this.http.delete(`${apiUrl}/products/relacionados/${key}`);
  }

  getProductsByRelated(related: string): Observable<Product[]> {
    if (this.productCacheRelated.has(related)) {
      return of(this.productCacheRelated.get(related)!);
    }

    return this.http.get<Product[]>(`${apiUrl}/products/related/${related}`).pipe(
      tap(response => {
        this.productCacheRelated.set(related, response);
      })
    );;
  }

}
