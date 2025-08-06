import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";


export class FormUtils {

  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static slugPattern = '^[a-z0-9_]+(?:-[a-z0-9_]+)*$';


  static isValidField( form: FormGroup, fieldName: string ):boolean | null {
    return (
      form.controls[fieldName].errors &&
      form.controls[fieldName].touched
    )
  }


  static getFieldError( form: FormGroup, fieldName: string ): string | null {
    if( !form.controls[fieldName] ) return null;

    const errors = form.controls[fieldName].errors ?? {}

    return FormUtils.getTextError( errors, fieldName );
  }


  static isValidFieldInArray( formArray: FormArray, index: number ) {
    return ( formArray.controls[index].errors && formArray.controls[index].touched )
  }


  static getFieldArrayError( formArray: FormArray, index: number ): string | null {
    if( !formArray.controls[index] ) return null;

    const errors = formArray.controls[index].errors ?? {}

    return FormUtils.getTextError( errors );
  }


  static getTextError(errors: ValidationErrors, fieldName?: string): string | null {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return this.getCustomMessage(fieldName, 'required');

        case 'minlength':
          return this.getCustomMessage(fieldName, 'minlength', errors['minlength'].requiredLength);

        case 'min':
          return `Valor mayor a ${errors['min'].min}`;

        case 'pattern':
          return this.getCustomMessage(fieldName, 'pattern');

        case 'fieldsNotEqual':
          return this.getCustomMessage(fieldName, 'fieldsNotEqual');

        case 'notValidUsername':
          return 'Nombre de usuario no permitido';

        case 'emailTaken':
          return 'Este email está siendo usado por otro usuario';
      }
    }

    return null;
  }

  private static getCustomMessage(fieldName?: string, errorType?: string, data?: any): string {
    const messages: Record<string, Record<string, string>> = {
      name: {
        required: 'El nombre es obligatorio',
        pattern: 'Debe ingresar nombre y apellido'
      },
      email: {
        required: 'El email es obligatorio',
        pattern: 'El formato del email no es válido',
      },
      userName: {
        required: 'El nombre de usuario es obligatorio',
        minlength: 'El nombre de usuario debe tener al menos ' + data + ' caracteres',
        pattern: 'No se permiten espacios u otros caracteres especiales',
      },
      password: {
        required: 'La contraseña es obligatoria',
        minlength: 'La contraseña debe tener al menos ' + data + ' caracteres'
      },
      password2: {
        required: 'La confirmación es obligatoria',
        fieldsNotEqual: 'Las contraseñas no coinciden'
      },
      title: {
        required: 'El título es obligatorio'
      },
      description: {
        required: 'La descripción es obligatoria'
      },
      slug: {
        required: 'El Slug es obligatorio',
        pattern: 'Los caracteres del slug no son válidos'
      },
      key: {
        required: 'El Slug es obligatorio',
        pattern: 'Los caracteres del slug no son válidos'
      },
      categories: {
        required: 'Debes seleccionar una categoría'
      },
      image: {
        required: 'Seleccione una imagen'
      },
    };

    return messages[fieldName || '']?.[errorType || ''] || 'Campo inválido';
  }


  static isFieldOneEqualFieldtwo( field1: string, field2: string) {
    return ( formGroup: AbstractControl ) => {
      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return field1Value === field2Value ? null : { fieldsNotEqual: true };
    }
  }

  //validacion sincrona personalizada
  static usernameNotValid(control: AbstractControl):ValidationErrors | null {
    const formValue = control.value;
    return formValue === 'strider' ? { notValidUsername: true } : null;
  }

  //validacion asincrona personalizada
  static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {

    const formValue = control.value;

    if (formValue === 'hola@mundo.com') {
      return {
        emailTaken: true,
      }
    }

    return null
  }

  static requiredCategory(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (Array.isArray(value) && value.length > 0) {
      return null;
    }

    return { required: true };
  }

}
