import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { FormErrorLabelComponent } from "@dashboard/components/form-error-label/form-error-label.component";
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Material } from '@products/interfaces/materials.interface';
import { MaterialsService } from '@products/services/materials.service';

@Component({
  selector: 'admin-material-details',
  imports: [ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './material-details.component.html'
})
export class ProductDetailsComponent  implements OnInit{

  router = inject(Router);
  formUtils = FormUtils;
  material = input.required<Material>();

  fb = inject(FormBuilder);
  materialService = inject(MaterialsService);
  wasSaved = signal(false);
  successMessage = signal('');
  isLoading = signal(false);

  materialForm: FormGroup = this.fb.group({
    slug: ['',[Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    name: ['', Validators.required],
    description: ['', Validators.required]
  })


  setFormValue(formLike: Partial<Material>) {
    this.materialForm.reset();

    this.materialForm.patchValue({
      slug: formLike.slug,
      name: formLike.name,
      description: formLike.description
    });
  }

  ngOnInit(): void {
    this.setFormValue(this.material())
  }


  async onSubmit() {
    if (this.materialForm.invalid) {
      this.materialForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.materialForm.value;

    const materialLike = {
      slug: formValue.slug,
      nombre: formValue.name,
      descripcion: formValue.description
    };

    try {
      if (this.material().id === 0) { //nuevo
        const material = await firstValueFrom(
          this.materialService.createMaterial(materialLike)
        )

        this.successMessage.set('Material creado correctamente');
        this.wasSaved.set(true);

        setTimeout(() => {
          this.wasSaved.set(false);
          this.successMessage.set('');
          this.router.navigate(['/admin/material', material.id]);
        }, 1000);

      } else { //actualiza

        await firstValueFrom(
          this.materialService.updateMaterial(this.material().id ,materialLike)
        )

        this.successMessage.set('Material actualizado correctamente');
        this.wasSaved.set(true);

        setTimeout(() => {
          this.wasSaved.set(false);
          this.successMessage.set('');
        }, 3000);

      }
    } catch (err) {
      // podrías agregar manejo de errores aquí si querés mostrar feedback
    } finally {
      this.isLoading.set(false);
    }
  }

}
