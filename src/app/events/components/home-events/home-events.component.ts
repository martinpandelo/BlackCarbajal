import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { EventsService } from '@events/services/events.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { EventCardComponent } from "../event-card/event-card.component";
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';

// register Swiper custom elements
register();

@Component({
  selector: 'home-slide-events',
  imports: [RouterLink, EventCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-events.component.html'
})
export class SlideEventosComponent implements OnInit {

  eventsService = inject(EventsService);

  eventsResource = rxResource({
    loader: ({  }) => {
      return this.eventsService.getEvents({ }).pipe(
        map(res => ({
          events: res.events
            .slice(0, 9)
          }))
      );
    }
  });

  swiperElement = signal<SwiperContainer | null>(null);

  ngOnInit(): void {
    const swiperElementConstructor = document.querySelector('swiper-container');
    const swiperOptions: SwiperOptions = {
      slidesPerView: 3,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: false,
      navigation: {
        enabled: true,
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev',
        disabledClass: 'btn-disabled'
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40
        }
      }
    };

    Object.assign(swiperElementConstructor!, swiperOptions);
    this.swiperElement.set(swiperElementConstructor as SwiperContainer);
    this.swiperElement()?.initialize();
  }

}
