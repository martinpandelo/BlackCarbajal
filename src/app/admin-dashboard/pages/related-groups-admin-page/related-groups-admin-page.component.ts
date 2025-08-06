import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '@products/services/products.service';
import { CommonModule } from '@angular/common';
import { pathImagePipe } from '@shared/pipes/path-image.pipe';
import { FormUtils } from 'src/app/utils/form-utils';
import { FormErrorLabelComponent } from "@dashboard/components/form-error-label/form-error-label.component";

@Component({
  selector: 'app-related-groups-admin-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, pathImagePipe, FormErrorLabelComponent],
  templateUrl: './related-groups-admin-page.component.html'
})
export class RelatedGroupsAdminPageComponent implements OnInit {

  private fb = inject(FormBuilder);
  private productService = inject(ProductsService);
  formUtils = FormUtils;

  relatedGroups = signal<{ key: string; image: string }[]>([]);
  imageFile: File | null = null;

  wasSaved = signal(false);
  successMessage = signal('');

  form: FormGroup = this.fb.group({
    key: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    image: [null, Validators.required]
  });

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.productService.getAllRelatedGroups().subscribe({
      next: (data) => this.relatedGroups.set(data),
      error: () => this.relatedGroups.set([])
    });
  }

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length) {
      this.imageFile = fileInput.files[0];
      this.form.get('image')?.setValue(this.imageFile);
    }
  }

  async onSubmit() {

    if (this.form.invalid || !this.imageFile) {
      this.form.markAllAsTouched();
      return;
    }


    const key = this.form.value.key;
    const ext = this.imageFile.name.split('.').pop();
    const renamedFile = new File([this.imageFile], `${key}.${ext}`, { type: this.imageFile.type });

    const formData = new FormData();
    formData.append('key', key);
    formData.append('image', renamedFile);

    this.productService.uploadRelatedGroupImage(formData).subscribe({
      next: () => {
        this.form.reset();
        this.imageFile = null;
        this.loadGroups();
        this.successMessage.set('Grupo creado correctamente');
        this.wasSaved.set(true);

        setTimeout(() => {
          this.wasSaved.set(false);
          this.successMessage.set('');
        }, 3000);
      },
      error: err => console.error(err)
    });
  }

  deleteGroup(key: string) {
    if (!confirm('¿Estás seguro de eliminar este grupo?')) return;

    this.productService.deleteRelatedGroup(key).subscribe({
      next: () => this.loadGroups(),
      error: err => console.error(err)
    });
  }
}

