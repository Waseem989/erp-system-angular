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

  // APIs
  private ADMIN_API = 'https://687e1dc6c07d1a878c315c88.mockapi.io/Admin';
  private STUDENT_API = 'https://686ce46214219674dcc98cf2.mockapi.io/students';

  onLogin() {
    this.errorMsg = '';
    const u = this.username.trim();
    const p = this.password.trim();

    if (!u || !p) {
      this.errorMsg = 'Username and Password required!';
      return;
    }

    // Agar email hai toh admin check kare
    if (u.includes('@')) {
      this.loginAdmin(u, p);
    } else {
      // Otherwise student
      this.loginStudent(u, p);
    }
  }

  // ===================== ADMIN LOGIN =====================
  private loginAdmin(email: string, password: string) {
    this.http.get<any[]>(this.ADMIN_API).subscribe({
      next: (admins) => {
        const admin = admins.find(a => a.email === email && a.password === password);
        if (admin) {
          localStorage.setItem('user', JSON.stringify({
            role: 'admin',
            name: admin.adminName,
            email: admin.email
          }));
          this.router.navigate(['/admin']);
        } else {
          this.errorMsg = 'Invalid admin credentials!';
        }
      },
      error: (err) => {
        console.error('Admin API Error:', err);
        this.errorMsg = 'Unable to connect to admin API!';
      }
    });
  }

  // ===================== STUDENT LOGIN =====================
  private loginStudent(rollNo: string, password: string) {
    this.http.get<any[]>(this.STUDENT_API).subscribe({
      next: (students) => {
        const student = students.find(s => s.rollNo === rollNo && s.password === password);
        if (student) {
          localStorage.setItem('user', JSON.stringify({
            role: 'student',
            name: student.studentName,
            rollNo: student.rollNo
          }));
          this.router.navigate(['/student']);
        } else {
          this.errorMsg = 'Invalid student credentials!';
        }
      },
      error: (err) => {
        console.error('Student API Error:', err);
        this.errorMsg = 'Unable to connect to student API!';
      }
    });
  }
}
