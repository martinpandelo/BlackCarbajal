import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormErrorLabelComponent } from '@dashboard/components/form-error-label/form-error-label.component';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';
import { Slides } from '@website-front/interfaces/slide.interface';
import { SlideService } from '@website-front/services/slide.service';
import { firstValueFrom } from 'rxjs';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
  selector: 'admin-slide-details',
  imports: [ReactiveFormsModule, FormErrorLabelComponent, pathImagePipe],
  templateUrl: './slide-details.component.html'
})
export class SlideDetailsComponent {

  router = inject(Router);
  formUtils = FormUtils;

  slide = input.required<Slides>();

  fb = inject(FormBuilder);
  slideService = inject(SlideService);

  wasSaved = signal(false);
  successMessage = signal('');
  isLoading = signal(false);

  // Archivos separados
  desktopFile?: File;
  mobileFile?: File;

  // Previews
  previewDesktop?: string;
  previewMobile?: string;

  slideForm: FormGroup = this.fb.group({
    image_desktop: [null, Validators.required],
    image_mobile: [null, Validators.required]
  });

  ngOnInit(): void {
    this.setFormValue(this.slide());
  }

  setFormValue(formLike: Partial<Slides>) {
    this.slideForm.reset();
    this.slideForm.patchValue({
      image_desktop: formLike.image_desktop,
      image_mobile: formLike.image_mobile
    });
  }

  async onSubmit() {
    if (this.slideForm.invalid) {
      this.slideForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.slideForm.value;

    const slideLike = {
      image_desktop: formValue.image_desktop,
      image_mobile: formValue.image_mobile
    };

    try {
      if (this.slide().id === 0) {
        // Nuevo slide
        const slide = await firstValueFrom(
          this.slideService.createSlide(slideLike, this.desktopFile, this.mobileFile)
        );
        this.successMessage.set('Slide creado correctamente');
        this.wasSaved.set(true);

        setTimeout(() => {
          this.wasSaved.set(false);
          this.successMessage.set('');
          this.router.navigate(['/admin/slide', slide.id]);
        }, 1000);

      } else {
        // Actualizar
        await firstValueFrom(
          this.slideService.updateSlide(this.slide().id, slideLike, this.desktopFile, this.mobileFile)
        );
        this.successMessage.set('Slide actualizado correctamente');
        this.wasSaved.set(true);

        setTimeout(() => {
          this.wasSaved.set(false);
          this.successMessage.set('');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  onDesktopFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.desktopFile = file;
      this.previewDesktop = URL.createObjectURL(file);
      this.slideForm.patchValue({ image_desktop: this.previewDesktop });
    }
  }

  onMobileFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.mobileFile = file;
      this.previewMobile = URL.createObjectURL(file);
      this.slideForm.patchValue({ image_mobile: this.previewMobile });
    }
  }

  removeDesktopImage() {
    this.desktopFile = undefined;
    this.previewDesktop = undefined;
    this.slideForm.patchValue({ image_desktop: null });
  }

  removeMobileImage() {
    this.mobileFile = undefined;
    this.previewMobile = undefined;
    this.slideForm.patchValue({ image_mobile: null });
  }

}
