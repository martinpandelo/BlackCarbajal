import { NgClass } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FrontService } from '@website-front/services/front.service';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';

@Component({
  selector: 'home-main-carousel',
  imports: [NgClass, pathImagePipe],
  templateUrl: './main-carousel.component.html'
})
export class MainCarouselComponent implements OnInit, OnDestroy {

  slideService = inject(FrontService);

  slideResource = rxResource({
    loader: () => {
      return this.slideService.getSlides()
    }
  });

  get slides() {
    return this.slideResource.value() ?? [];
  }


  currentIndex = 0;
  intervalId: any;
  resumeTimeoutId: any;

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.clearTimers();
  }

  startAutoplay() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  pauseAutoplay(temp = false) {
    clearInterval(this.intervalId);
    this.intervalId = null;

    if (temp) {
      clearTimeout(this.resumeTimeoutId);
      this.resumeTimeoutId = setTimeout(() => {
        this.startAutoplay();
      }, 6000); // vuelve a activar después de 5s sin interacción
    }
  }

  clearTimers() {
    clearInterval(this.intervalId);
    clearTimeout(this.resumeTimeoutId);
  }

  isTransitioning = false;

  nextSlide() {
    if (this.isTransitioning) return;

    this.isTransitioning = true;
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;

    setTimeout(() => {
      this.isTransitioning = false;
    }, 700); // coincide con duration-700 de Tailwind
  }

  nextSlideManual() {
    this.pauseAutoplay(true);
    this.nextSlide();
  }

  prevSlide() {
    if (this.isTransitioning) return;

    this.isTransitioning = true;
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;

    setTimeout(() => {
      this.isTransitioning = false;
    }, 700);
  }

  prevSlideManual() {
    this.pauseAutoplay(true);
    this.prevSlide();
  }

  onMouseEnter() {
    this.pauseAutoplay();
  }

  onMouseLeave() {
    this.startAutoplay();
  }

}
