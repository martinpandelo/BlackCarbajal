import { Routes } from "@angular/router";
import { WebsiteFrontLayoutsComponent } from "./layouts/website-front-layouts/website-front-layouts.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { ProductsPageComponent } from "./pages/products-page/products-page.component";
import { ProductSheetComponent } from "./pages/product-sheet/product-sheet.component";
import { EventsPageComponent } from "./pages/events-page/events-page.component";
import { EventPageComponent } from "./pages/event-page/event-page.component";
import { CatalogsPageComponent } from "./pages/catalogs-page/catalogs-page.component";


export const productRoutes: Routes = [
  {
    path: '',
    component: WebsiteFrontLayoutsComponent,
    children: [
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'productos',
        component: ProductsPageComponent
      },
      {
        path: 'productos/:categoria',
        component: ProductsPageComponent
      },
      {
        path: 'producto/:idSlug',
        component: ProductSheetComponent
      },
      {
        path: 'eventos',
        component: EventsPageComponent
      },
      {
        path: 'evento/:idSlug',
        component: EventPageComponent
      },
      {
        path: 'catalogos',
        component: CatalogsPageComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

export default productRoutes;

