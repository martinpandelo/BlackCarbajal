import { Routes } from "@angular/router";
import { AdminDashboardLayoutComponent } from "./layout/admin-dashboard-layout/admin-dashboard-layout.component";
import { ProductsAdminPageComponent } from "./pages/products-admin-page/products-admin-page.component";
import { ProductAdminPageComponent } from "./pages/product-admin-page/product-admin-page.component";
import { IsAdminGuard } from "@auth/guards/is-admin.guard";
import { RelatedGroupsAdminPageComponent } from "./pages/related-groups-admin-page/related-groups-admin-page.component";
import { MaterialsAdminPageComponent } from "./pages/materials-admin-page/materials-admin-page.component";
import { MaterialAdminPageComponent } from "./pages/material-admin-page/material-admin-page.component";
import { TypesListAdminPageComponent } from "./pages/types-list-admin-page/types-list-admin-page.component";
import { TypeAdminPageComponent } from "./pages/type-admin-page/type-admin-page.component";
import { CategoriesAdminPageComponent } from "./pages/categories-admin-page/categories-admin-page.component";
import { CategoryAdminPageComponent } from "./pages/category-admin-page/category-admin-page.component";
import { EventAdminPageComponent } from "./pages/event-admin-page/event-admin-page.component";
import { EventsListAdminPageComponent } from "./pages/events-list-admin-page/events-list-admin-page.component";
import { CatalogsListAdminPageComponent } from "./pages/catalogs-list-admin-page/catalogs-list-admin-page.component";
import { CatalogAdminPageComponent } from "./pages/catalog-admin-page/catalog-admin-page.component";
import { SlidesListAdminPageComponent } from "./pages/slides-list-admin-page/slides-list-admin-page.component";
import { SlideAdminPageComponent } from "./pages/slide-admin-page/slide-admin-page.component";

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    canMatch: [
          IsAdminGuard
    ],
    children: [
      {
        path: 'products',
        component: ProductsAdminPageComponent
      },
      {
        path: 'product/:id',
        component: ProductAdminPageComponent
      },
      {
        path: 'materials',
        component: MaterialsAdminPageComponent
      },
      {
        path: 'material/:id',
        component: MaterialAdminPageComponent
      },
      {
        path: 'types',
        component: TypesListAdminPageComponent
      },
      {
        path: 'type/:id',
        component: TypeAdminPageComponent
      },
      {
        path: 'categories',
        component: CategoriesAdminPageComponent
      },
      {
        path: 'category/:id',
        component: CategoryAdminPageComponent
      },
      {
        path: 'related',
        component: RelatedGroupsAdminPageComponent
      },
      {
        path: 'events',
        component: EventsListAdminPageComponent
      },
      {
        path: 'event/:id',
        component: EventAdminPageComponent
      },
      {
        path: 'catalogs',
        component: CatalogsListAdminPageComponent
      },
      {
        path: 'catalog/:id',
        component: CatalogAdminPageComponent
      },
      {
        path: 'slides',
        component: SlidesListAdminPageComponent
      },
      {
        path: 'slide/:id',
        component: SlideAdminPageComponent
      },
      {
        path: '**',
        redirectTo: 'products'
      }
    ]
  }
];

export default adminDashboardRoutes;
