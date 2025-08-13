import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialsService } from '@products/services/materials.service';
import { map } from 'rxjs';
import { ProductDetailsComponent } from "./material-details/material-details.component";

@Component({
  selector: 'app-material-admin-page',
  imports: [ProductDetailsComponent],
  templateUrl: './material-admin-page.component.html'
})
export class MaterialAdminPageComponent {

    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);
    materialService = inject(MaterialsService);

    materialId = toSignal(
      this.activatedRoute.params.pipe(
        map((params)=> params['id'])
      )
    )

    materialResource = rxResource({
      request: () => ({
        id: this.materialId()
      }),
      loader: ({ request }) => {
        return this.materialService.getMaterialById( request.id );
      }
    })

    redirectEffect = effect(() => {
      if (this.materialResource.error()) {
        this.router.navigateByUrl('/admin');
      }
    })

}
