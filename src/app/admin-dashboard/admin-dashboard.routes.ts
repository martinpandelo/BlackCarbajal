import { Routes } from "@angular/router";
import { AdminDashboardLayoutComponent } from "./layout/admin-dashboard-layout/admin-dashboard-layout.component";
import { ProductsAdminPageComponent } from "./pages/products-admin-page/products-admin-page.component";
import { ProductAdminPageComponent } from "./pages/product-admin-page/product-admin-page.component";
import { IsAdminGuard } from "@auth/guards/is-admin.guard";
import { RelatedGroupsAdminPageComponent } from "./pages/related-groups-admin-page/related-groups-admin-page.component";
import { MaterialsAdminPageComponent } from "./pages/materials-admin-page/materials-admin-page.component";
import { MaterialAdminPageComponent } from "./pages/material-admin-page/material-admin-page.component";

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
        path: 'related',
        component: RelatedGroupsAdminPageComponent
      },
      {
        path: '**',
        redirectTo: 'products'
      }
    ]
  }
];

export default adminDashboardRoutes;
