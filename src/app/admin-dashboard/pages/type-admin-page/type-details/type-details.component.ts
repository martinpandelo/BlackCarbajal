import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { FormErrorLabelComponent } from "@dashboard/components/form-error-label/form-error-label.component";
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Type } from '@products/interfaces/types.interface';
import { TypesService } from '@products/services/types.service';

@Component({
  selector: 'admin-type-details',
  imports: [ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './type-details.component.html'
})
export class TypeDetailsComponent  implements OnInit{

  router = inject(Router);
  formUtils = FormUtils;
  type = input.required<Type>();

  fb = inject(FormBuilder);
  typeService = inject(TypesService);
  wasSaved = signal(false);
  successMessage = signal('');
  isLoading = signal(false);

  typeForm: FormGroup = this.fb.group({
    slug: ['',[Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    name: ['', Validators.required]
  })


  setFormValue(formLike: Partial<Type>) {
    this.typeForm.reset();

    this.typeForm.patchValue({
      slug: formLike.slug,
      name: formLike.name
    });
  }

  ngOnInit(): void {
    this.setFormValue(this.type())
  }


  async onSubmit() {
    if (this.typeForm.invalid) {
      this.typeForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.typeForm.value;

    const typeLike = {
      slug: formValue.slug,
      nombre: formValue.name
    };

    try {
      if (this.type().id === 0) { //nuevo
        const type = await firstValueFrom(
          this.typeService.createType(typeLike)
        )

        this.successMessage.set('Articulo creado correctamente');
        this.wasSaved.set(true);

        setTimeout(() => {
          this.wasSaved.set(false);
          this.successMessage.set('');
          this.router.navigate(['/admin/type', type.id]);
        }, 1000);

      } else { //actualiza

        await firstValueFrom(
          this.typeService.updateType(this.type().id ,typeLike)
        )

        this.successMessage.set('Articulo actualizado correctamente');
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
