// services/auth.service.ts

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // ✅ Save login session
  login(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // ✅ Logout and clear session
  logout() {
    localStorage.removeItem('user');
  }

  // ✅ Check if logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  // ✅ Get current user
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ✅ Get user role
  getUserRole(): string {
    const user = this.getUser();
    return user?.role || '';
  }
}
