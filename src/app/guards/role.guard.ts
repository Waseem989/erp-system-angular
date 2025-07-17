// src/app/guards/role.guard.ts
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

/*
  👉 LocalStorage se user read karenge (temporary session store).
  👉 expectRole == jis route ko access kar rahe (admin / teacher / student)
  👉 Agar match nahi -> user ko uske apne dashboard pe redirect.

  Why return UrlTree? Angular me recommended hai redirect ke liye.
*/
function getStrictRoleGuard(expectRole: 'admin' | 'teacher' | 'student'): CanActivateFn {
  return (): boolean | UrlTree => {
    const router = inject(Router);

    if (typeof window === 'undefined') return false;

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      // ⚠️ logged in hi nahi -> login bhejo
      return router.parseUrl('/login');
    }

    let user: any;
    try {
      user = JSON.parse(userStr);
    } catch {
      // ⚠️ corrupt session -> logout + login bhejo
      localStorage.removeItem('user');
      return router.parseUrl('/login');
    }

    // 👉 user.role exactly same hona chahiye
    if (user.role === expectRole) {
      return true; // ✅ allow
    }

    // ⚠️ mismatch -> apne dashboard bhejo
    switch (user.role) {
      case 'admin':   return router.parseUrl('/admin');
      case 'teacher': return router.parseUrl('/teacher');
      case 'student': return router.parseUrl('/student');
      default:        return router.parseUrl('/login');
    }
  };
}

/* 👉 Export ready guards */
export const adminGuard:   CanActivateFn = getStrictRoleGuard('admin');
export const teacherGuard: CanActivateFn = getStrictRoleGuard('teacher');
export const studentGuard: CanActivateFn = getStrictRoleGuard('student');
