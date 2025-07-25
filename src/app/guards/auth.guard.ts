// src/app/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/*
  👉 authGuard: sirf check karega user login hai ya nahi.
  👉 Login hone ka matlab: localStorage me "user" object saved.
*/
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  // 🧠 SSR safe check (agar kabhi universal use karo)
  if (typeof window === 'undefined') return false;

  // 👉 session read
  const userStr = localStorage.getItem('user');

  // ⚠️ agar login nahi to login page bhejo
  if (!userStr) {
    router.navigate(['/login']);
    return false;
  }

  // ✅ logged in -> allow route (role baad me check hoga)

  return true;
};
