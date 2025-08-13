import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SlideService } from '@website-front/services/slide.service';
import { SlideTableComponent } from "@dashboard/components/slide-table/slide-table.component";
import { SlideOrderComponent } from "@dashboard/components/slide-order/slide-order.component";

@Component({
  selector: 'app-slides-list-admin-page',
  imports: [RouterLink, SlideTableComponent, SlideOrderComponent],
  templateUrl: './slides-list-admin-page.component.html'
})
export class SlidesListAdminPageComponent {

    slidesService = inject(SlideService);
    refreshSignal = signal(0);

    slideResource = rxResource({
      request: () => ({ refresh: this.refreshSignal() }),
      loader: () => this.slidesService.getSlides()
    });

    onDeleteSlide(id: number) {
      this.slidesService.deleteSlide(id).subscribe({
        next: () => {
          // Recargar después de borrar
          this.refreshSignal.update(n => n + 1);
        },
        error: (err) => {
          console.error('Error eliminando slide:', err);
        }
      });
    }

}
