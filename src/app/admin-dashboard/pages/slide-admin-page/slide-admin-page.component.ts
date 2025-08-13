import { Component, effect, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SlideService } from '@website-front/services/slide.service';
import { map } from 'rxjs';
import { SlideDetailsComponent } from "./slide-details/slide-details.component";

@Component({
  selector: 'app-slide-admin-page',
  imports: [SlideDetailsComponent],
  templateUrl: './slide-admin-page.component.html'
})
export class SlideAdminPageComponent {

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  slideService = inject(SlideService);

    slideId = toSignal(
      this.activatedRoute.params.pipe(
        map((params)=> params['id'])
      )
    );

    slideResource = rxResource({
      request: () => ({
        id: this.slideId()
      }),
      loader: ({ request }) => {
        return this.slideService.getSlideById( request.id );
      }
    });

    redirectEffect = effect(() => {
      if (this.slideResource.error()) {
        this.router.navigateByUrl('/admin');
      }
    })

}
