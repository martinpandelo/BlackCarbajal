import { Component, inject, input, signal, Type } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormErrorLabelComponent } from '@dashboard/components/form-error-label/form-error-label.component';
import { EventItem } from '@events/interfaces/events.interface';
import { EventsService } from '@events/services/events.service';
import { ImageCarouselComponent } from '@shared/components/image-carousel/image-carousel.component';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';
import { firstValueFrom } from 'rxjs';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
  selector: 'admin-event-details',
  imports: [ReactiveFormsModule, FormErrorLabelComponent, ImageCarouselComponent, pathImagePipe],
  templateUrl: './event-details.component.html'
})
export class EventDetailsComponent {

  router = inject(Router);
  formUtils = FormUtils;

  event = input.required<EventItem>();

  fb = inject(FormBuilder);
  eventService = inject(EventsService);

  wasSaved = signal(false);
  successMessage = signal('');
  isLoading = signal(false);

  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);

  eventForm: FormGroup = this.fb.group({
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    title: ['', Validators.required],
    description: ['', Validators.required],
    images: [[]]
  })


  ngOnInit(): void {
    this.setFormValue(this.event());
  }

  setFormValue(formLike: Partial<EventItem>) {
    this.eventForm.reset();

    const normalizedImages = Array.isArray(formLike.images)
      ? formLike.images
      : formLike.images ? [formLike.images] : [];

    this.eventForm.patchValue({
      slug: formLike.slug,
      title: formLike.title,
      description: formLike.description,
      images: normalizedImages
    });
  }


  async onSubmit() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.eventForm.value;

    const cleanedImages: string[] = Array.from(
      new Set(
        (formValue.images ?? []).map((img: string) => img.split('/').pop() || '')
      )
    );

    const eventLike = {
      slug: formValue.slug,
      titulo: formValue.title,
      descripcion: formValue.description,
      images: cleanedImages
    };

    try {
      if (this.event().id === 0) { //nuevo evento
        const event = await firstValueFrom(
          this.eventService.createEvent(eventLike, this.imageFileList)
        )

        this.successMessage.set('Evento creado correctamente');
        this.wasSaved.set(true);

        setTimeout(() => {
          this.wasSaved.set(false);
          this.successMessage.set('');
          this.router.navigate(['/admin/event', event.id]);
        }, 1000);

      } else { //actualiza evento

        await firstValueFrom(
          this.eventService.updateEvent(this.event().id ,eventLike, this.imageFileList)
        )

        this.successMessage.set('Evento actualizado correctamente');
        this.wasSaved.set(true);

        setTimeout(() => {
          this.wasSaved.set(false);
          this.successMessage.set('');
        }, 3000);

      }
    } catch (err) {
      // manejo de errores aquí
    } finally {
      this.isLoading.set(false);
    }
  }

  //images
  onFilesChanged( event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined;

    const imageUrls = Array.from( fileList ?? []).map( file => URL.createObjectURL(file));

    this.tempImages.set(imageUrls)
  }

  removeExistingImage(imageUrl: string) {
    const currentImages = this.eventForm.value.images as string[];

    const fileNameToRemove = imageUrl.split('/').pop();

    const updatedImages = currentImages.filter(img => {
      const imgName = img.split('/').pop();
      return imgName !== fileNameToRemove;
    });

    this.eventForm.patchValue({ images: updatedImages });
  }

  removeTempImage(index: number) {
    const tempList = [...this.tempImages()];
    tempList.splice(index, 1);
    this.tempImages.set(tempList);

    // También quitamos del FileList
    const dt = new DataTransfer();
    Array.from(this.imageFileList ?? []).forEach((file, i) => {
      if (i !== index) dt.items.add(file);
    });
    this.imageFileList = dt.files;
  }

}
