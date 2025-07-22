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

  private ADMIN_API   = 'https://687e1dc6c07d1a878c315c88.mockapi.io/Admin';
  private STUDENT_API = 'https://686ce46214219674dcc98cf2.mockapi.io/students';
  private TEACHER_API = 'https://687e1dc6c07d1a878c315c88.mockapi.io/Teachers';

  onLogin() {
    this.errorMsg = '';
    const u = this.username.trim();
    const p = this.password.trim();

    if (!u || !p) {
      this.errorMsg = 'Username and Password required!';
      return;
    }

    if (u.includes('@')) {
      // Email → Check Admin then Teacher
      this.loginAdminOrTeacher(u, p);
    } else {
      // RollNo → Student
      this.loginStudent(u, p);
    }
  }

  // ===================== ADMIN THEN TEACHER =====================
  private loginAdminOrTeacher(email: string, password: string) {
    this.http.get<any[]>(this.ADMIN_API).subscribe({
      next: admins => {
        const admin = admins.find(a => a.email === email && a.password === password);
        if (admin) {
          this.setUserAndRedirect({
            role: 'admin',
            name: admin.adminName,
            email: admin.email
          }, '/admin');
          return;
        }
        this.loginTeacher(email, password);
      },
      error: err => {
        console.error('Admin API Error:', err);
        this.loginTeacher(email, password);
      }
    });
  }

  // ===================== TEACHER LOGIN =====================
  private loginTeacher(email: string, password: string) {
    this.http.get<any[]>(this.TEACHER_API).subscribe({
      next: teachers => {
        const teacher = teachers.find(t => t.email === email && t.password === password);
        if (teacher) {
          this.setUserAndRedirect({
            role: 'teacher',
            id: teacher.id,
            name: teacher.teacherNane || teacher.teacherName || teacher.name || 'Teacher',
            email: teacher.email
          }, '/teacher');
        } else {
          this.errorMsg = 'Invalid teacher credentials!';
        }
      },
      error: err => {
        console.error('Teacher API Error:', err);
        this.errorMsg = 'Unable to connect to teacher API!';
      }
    });
  }

  // ===================== STUDENT LOGIN =====================
  private loginStudent(rollNo: string, password: string) {
    this.http.get<any[]>(this.STUDENT_API).subscribe({
      next: students => {
        const student = students.find(s => s.rollNo === rollNo && s.password === password);
        if (student) {
          this.setUserAndRedirect({
            role: 'student',
            name: student.studentName,
            rollNo: student.rollNo
          }, '/student');
        } else {
          this.errorMsg = 'Invalid student credentials!';
        }
      },
      error: err => {
        console.error('Student API Error:', err);
        this.errorMsg = 'Unable to connect to student API!';
      }
    });
  }

  // ===================== SAVE USER & REDIRECT =====================
  private setUserAndRedirect(payload: any, route: string) {
    localStorage.setItem('user', JSON.stringify(payload));
    this.router.navigate([route]);
  }
}
