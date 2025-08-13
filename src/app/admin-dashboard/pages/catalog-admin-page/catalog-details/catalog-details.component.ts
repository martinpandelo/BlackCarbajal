import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Catalogs } from '@catalogs/interfaces/catalogs.interface';
import { CatalogsService } from '@catalogs/services/catalogs.service';
import { FormErrorLabelComponent } from '@dashboard/components/form-error-label/form-error-label.component';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';
import { firstValueFrom } from 'rxjs';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
  selector: 'admin-catalog-details',
  imports: [ReactiveFormsModule, FormErrorLabelComponent, pathImagePipe],
  templateUrl: './catalog-details.component.html'
})
export class CatalogDetailsComponent {

    router = inject(Router);
    formUtils = FormUtils;

    catalog = input.required<Catalogs>();

    fb = inject(FormBuilder);
    catalogService = inject(CatalogsService);

    wasSaved = signal(false);
    successMessage = signal('');
    isLoading = signal(false);

    imageFileList: FileList | undefined = undefined;
    tempImages = signal<string[]>([]);


    catalogForm: FormGroup = this.fb.group({
      title: ['', Validators.required],
      link: ['', Validators.required],
      image: [null]
    })


    ngOnInit(): void {
      this.setFormValue(this.catalog())
    }

    setFormValue(formLike: Partial<Catalogs>) {
      this.catalogForm.reset();

      this.catalogForm.patchValue({
        title: formLike.title,
        link: formLike.link,
        image: formLike.image || null
      });
    }

    async onSubmit() {
      if (this.catalogForm.invalid) {
        this.catalogForm.markAllAsTouched();
        return;
      }

      this.isLoading.set(true);

      const formValue = this.catalogForm.value;

      const imageName = formValue.image
      ? formValue.image.split('/').pop() || ''
      : '';

      const catalogLike = {
        titulo: formValue.title,
        link: formValue.link,
        image: imageName
      };

      try {
        if (this.catalog().id === 0) { //nuevo
          const catalog = await firstValueFrom(
            this.catalogService.createCatalog(catalogLike, this.imageFileList)
          )

          this.successMessage.set('Catálogo creado correctamente');
          this.wasSaved.set(true);

          setTimeout(() => {
            this.wasSaved.set(false);
            this.successMessage.set('');
            this.router.navigate(['/admin/catalog', catalog.id]);
          }, 1000);

        } else { //actualiza

          await firstValueFrom(
            this.catalogService.updateCatalog(this.catalog().id ,catalogLike, this.imageFileList)
          )

          this.successMessage.set('Catálogo actualizado correctamente');
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

    //image
    onFilesChanged(event: Event) {
      const fileList = (event.target as HTMLInputElement).files;
      this.imageFileList = fileList ?? undefined;

      if (fileList && fileList.length > 0) {
        const previewUrl = URL.createObjectURL(fileList[0]);
        this.catalogForm.patchValue({ image: previewUrl });
      }
    }

    removeImage() {
      this.catalogForm.patchValue({ image: null });
      this.imageFileList = undefined;
    }

}
