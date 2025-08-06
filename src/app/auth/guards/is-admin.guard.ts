import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const IsAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isValid = await firstValueFrom(authService.checkSatus())

  const roles = authService.user()?.roles ?? [];
  const isAdmin = roles.includes('admin');

  if (!isValid || !isAdmin) {
    router.navigateByUrl('/auth');
    return false;
  }

  return true;
};
