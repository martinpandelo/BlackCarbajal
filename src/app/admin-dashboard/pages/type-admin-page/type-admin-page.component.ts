import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TypesService } from '@products/services/types.service';
import { map } from 'rxjs';
import { TypeDetailsComponent } from './type-details/type-details.component';

@Component({
  selector: 'app-type-admin-page',
  imports: [TypeDetailsComponent],
  templateUrl: './type-admin-page.component.html'
})
export class TypeAdminPageComponent {

    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);
    typeService = inject(TypesService);

    typeId = toSignal(
      this.activatedRoute.params.pipe(
        map((params)=> params['id'])
      )
    )

    typeResource = rxResource({
      request: () => ({
        id: this.typeId()
      }),
      loader: ({ request }) => {
        return this.typeService.getTypeById( request.id );
      }
    })

    redirectEffect = effect(() => {
      if (this.typeResource.error()) {
        this.router.navigateByUrl('/admin');
      }
    })

}
