import { AfterViewInit, Component, ElementRef, input, OnDestroy, viewChild } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Fancybox } from '@fancyapps/ui';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';


@Component({
  selector: 'image-carousel',
  imports: [pathImagePipe],
  templateUrl: './image-carousel.component.html',
  styles: `

    .swiper-button-next,
    .swiper-button-prev {
      color: black
    }

  `,
})
export class ImageCarouselComponent implements AfterViewInit, OnDestroy {

  imagesCarousel = input.required<string | string[]>();
  imageType = input<'productos' | 'eventos'>('productos');

  // Normaliza a array para que el template no falle
  get images(): string[] {
    const val = this.imagesCarousel();
    if (!val || (Array.isArray(val) && val.length === 0)) {
      return ['no-image.jpg'];
    }
    return Array.isArray(val) ? val : [val];
  }

  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  ngAfterViewInit(): void {

    const element = this.swiperDiv().nativeElement;

    if( !element ) return;

    const swiper = new Swiper( element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      modules: [
        Navigation, Pagination
      ],
      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });

    Fancybox.bind('[data-fancybox]', {});

  }

  ngOnDestroy(): void {
    Fancybox.close();
  }

}
