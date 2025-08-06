import { Component, computed, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { map } from 'rxjs';
import { TruncateTextPipe } from '@shared/pipes/truncate-text.pipe';


@Component({
  selector: 'app-products-page',
  imports: [RouterLink, ProductCardComponent, PaginationComponent, TruncateTextPipe],
  templateUrl: './products-page.component.html'
})
export class ProductsPageComponent {

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  route = inject(ActivatedRoute);
  router = inject(Router);

  categoria = toSignal(this.route.params.pipe(
    map( ({ categoria }) => categoria )
  ));

  tipoQuery = toSignal(this.route.queryParams.pipe(
      map(params => params['tipo'] || '')
  ));

  materialQuery = toSignal(this.route.queryParams.pipe(
      map(params => params['material'] || '')
  ));

  novedadesActivas = computed(() => this.categoria() === 'novedades');

  searchQuery = toSignal(
    this.route.queryParams.pipe(map(params => params['buscar'] || ''))
  );

  productResource = rxResource({
    request: () => ({
      categoria: this.novedadesActivas() ? '' : this.categoria(),
      page: this.paginationService.currentPage() - 1,
      novedad: this.novedadesActivas(),
      search: this.searchQuery(),
      tipo: this.tipoQuery(),
      material: this.materialQuery()
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        categoria: request.categoria,
        offset: request.page * this.paginationService.productsPerPage,
        limit: this.paginationService.productsPerPage,
        novedad: request.novedad,
        search: request.search,
        tipo: request.tipo,
        material: request.material
      });
    }
  });

  //categorias
  categoryResource = rxResource({
    request: () => ({ }),
    loader: () => {
      return this.productsService.getCategories({ });
    }
  });

  categoriaNombre = computed(() => {
    const slug = this.categoria();

    if (!slug) return null;
    if (slug === 'novedades') return 'Novedades';

    const categorias = this.categoryResource.value()?.categories;
    const match = categorias?.find(cat => cat.slug === slug);
    return match ? match.title : slug;
  });

  categoriaInvalida = computed(() => {
    const slug = this.categoria();

    if (!slug || slug === 'novedades') return false;

    const categorias = this.categoryResource.value()?.categories;
    return !categorias?.some(cat => cat.slug === slug);
  });

  onCategoriaSelect(slug: string) {
    if (!slug) {
      this.router.navigate(['/productos'], {
        queryParamsHandling: 'merge',
        queryParams: {}
      });
    } else {
      this.router.navigate(['/productos', slug], {
        queryParamsHandling: 'merge'
      });
    }
    const active = document.activeElement as HTMLElement;
    active?.blur();
    this.closeDrawer();
  }

  //tipos de articulos
  typeResource = rxResource({
    request: () => ({}),
    loader: () => this.productsService.getTypes()
  });

  onTipoSelect(slug: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tipo: slug || null
      },
      queryParamsHandling: 'merge'
    });

    const active = document.activeElement as HTMLElement;
    active?.blur();
    this.closeDrawer();
  }

  tipoNombre = computed(() => {
    const slug = this.tipoQuery();
    if (!slug) return null;

    const tipos = this.typeResource.value()?.types;
    return tipos?.find(t => t.slug === slug)?.name || slug;
  });

  //materiales
  materialResource = rxResource({
    request: () => ({}),
    loader: () => this.productsService.getMaterials()
  });

  onMaterialSelect(slug: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        material: slug || null
      },
      queryParamsHandling: 'merge'
    });

    const active = document.activeElement as HTMLElement;
    active?.blur();
    this.closeDrawer();
  }

  materialNombre = computed(() => {
    const slug = this.materialQuery();
    if (!slug) return null;

    const materiales = this.materialResource.value()?.materials;
    return materiales?.find(m => m.slug === slug)?.name || slug;
  });


  invalidRoute = effect(() => {
    const categorias = this.categoryResource.value()?.categories;

    if (!categorias) return;

    if (this.categoriaInvalida()) {
      this.router.navigate(['/productos']);
    }
  });

  limpiarFiltro() {
    this.router.navigate(['/productos']);
  }

  closeDrawer() {
    const drawer = document.getElementById('drawer-filtros') as HTMLInputElement;
    if (drawer) drawer.checked = false;
  }

}
