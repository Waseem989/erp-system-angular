import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username = '';
  password = '';
  errorMsg = '';

  private http = inject(HttpClient);
  private router = inject(Router);

  // REAL API ENDPOINTS (all POST; no token required at login)
  private ADMIN_API   = 'http://192.168.100.71:8000/api/admin/login';
  private TEACHER_API = 'http://192.168.100.71:8000/api/teacher/login';
  private STUDENT_API = 'http://192.168.100.71:8000/api/student/login';

  onLogin() {
    this.errorMsg = '';
    const email = this.username.trim();
    const p     = this.password.trim();

    if (!email || !p) {
      this.errorMsg = 'Email and Password required!';
      return;
    }

    // Try Admin → Teacher → Student
    this.loginAdmin(email, p);
  }

  /* ---------------- ADMIN ---------------- */
  private loginAdmin(email: string, password: string) {
    this.http.post<any>(this.ADMIN_API, { email, password }).subscribe({
      next: res => {
        if (this.isSuccess(res)) {
          this.setUserAndRedirect({
            role: 'admin',
            name: res?.user?.name || res?.adminName || email,
            email,
            token: res?.token || res?.access_token || null
          }, '/admin');
        } else {
          this.loginTeacher(email, password);
        }
      },
      error: _ => this.loginTeacher(email, password)
    });
  }

  /* ---------------- TEACHER ---------------- */
  private loginTeacher(email: string, password: string) {
    this.http.post<any>(this.TEACHER_API, { email, password }).subscribe({
      next: res => {
        if (this.isSuccess(res)) {
          this.setUserAndRedirect({
            role: 'teacher',
            id:   res?.user?.id   || res?.id   || null,
            name: res?.user?.name || res?.teacherName || 'Teacher',
            email,
            profilePic: res?.user?.profilePic || ''
          }, '/teacher');
        } else {
          this.loginStudent(email, password);
        }
      },
      error: _ => this.loginStudent(email, password)
    });
  }

  /* ---------------- STUDENT (email login) ---------------- */
  private loginStudent(email: string, password: string) {
    this.http.post<any>(this.STUDENT_API, { email, password }).subscribe({
      next: res => {
        if (this.isSuccess(res)) {
          this.setUserAndRedirect({
            role: 'student',
            name:   res?.user?.studentName || res?.user?.name || email,
            email,
            rollNo: res?.user?.rollNo || null
          }, '/student');
        } else {
          this.errorMsg = 'Invalid credentials!';
        }
      },
      error: err => {
        console.error('Student API Error:', err);
        this.errorMsg = 'Invalid credentials!';
      }
    });
  }

  /* ---------------- SUCCESS HELPER ---------------- */
  private isSuccess(res: any): boolean {
    if (!res) return false;
    if (res.success === true) return true;
    if (res.status === true) return true;
    if (res.token || res.access_token) return true;
    if (res.user) return true;
    if (res.data) return true;
    return false;
  }

  /* ---------------- SAVE & ROUTE ---------------- */
  private setUserAndRedirect(payload: any, route: string) {
    localStorage.setItem('user', JSON.stringify(payload));
    this.router.navigate([route]);
  }
}
