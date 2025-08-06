import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html'
})
export class RegisterPageComponent {

  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  formUtils = FormUtils;

  hasError = signal(false);
  isPosting = signal(false);

  registerForm: FormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.pattern( this.formUtils.namePattern )]],
      email: ['', [Validators.required, Validators.pattern( this.formUtils.emailPattern )]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]]
  },
  {
    validators: [
      this.formUtils.isFieldOneEqualFieldtwo('password', 'password2')
    ]
  })

  onSubmit() {
      if (this.registerForm.invalid) {
        this.hasError.set(true);
        this.registerForm.markAllAsTouched();

        setTimeout(() => {
          this.hasError.set(false);
        }, 2000);

        return;
      }

      const { name='', email='', password=''} = this.registerForm.value;

      this.authService.register(name, email, password).subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/');
          return;
        }

        this.hasError.set(true);
      })
  }

}
