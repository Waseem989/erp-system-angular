// guards/role.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.getUserRole() === 'admin') return true;
  router.navigate(['/login']);
  return false;
};

export const teacherGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.getUserRole() === 'teacher') return true;
  router.navigate(['/login']);
  return false;
};

export const studentGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.getUserRole() === 'student') return true;
  router.navigate(['/login']);
  return false;
};
