import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
  selector: 'form-error-label',
  imports: [],
  templateUrl: './form-error-label.component.html'
})
export class FormErrorLabelComponent {

  control = input.required<AbstractControl>();
  fieldName = input<string>(); // opcional

  get errorMessage(): string | null {
    const errors: ValidationErrors = this.control().errors || {};
    return this.control().touched && Object.keys(errors).length > 0
      ? FormUtils.getTextError(errors, this.fieldName())
      : null;
  }

}
