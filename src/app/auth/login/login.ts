import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ Angular 19 standalone component
  imports: [CommonModule, FormsModule], // ✅ Forms ke liye zaroori
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  // ✅ Bindings for form
  username: string = '';
  password: string = '';
  errorMsg: string = '';

  constructor(private router: Router) {}

  // ✅ Mock Users
  private admins = [
    { email: 'admin@example.com', password: '12345', role: 'admin', name: 'Super Admin' }
  ];
  private teachers = [
    { email: 'teacher@example.com', password: '12345', role: 'teacher', name: 'Sir Ahmed' },
    { email: 'sana@example.com', password: '12345', role: 'teacher', name: 'Madam Sana' }
  ];
  private students = [
    { rollNo: 'SU001', password: '12345', role: 'student', name: 'Ali Khan' },
    { rollNo: 'SU002', password: '12345', role: 'student', name: 'Hina' }
  ];

  // ✅ Login function
  onLogin() {
    this.errorMsg = '';

    if (!this.username || !this.password) {
      this.errorMsg = 'Username and Password required!';
      return;
    }

    // Check Admin
    const admin = this.admins.find(a => a.email === this.username);
    if (admin && admin.password === this.password) {
      this.saveSession(admin);
      this.router.navigate(['/admin'], { replaceUrl: true });
      return;
    }

    // Check Teacher
    const teacher = this.teachers.find(t => t.email === this.username);
    if (teacher && teacher.password === this.password) {
      this.saveSession(teacher);
      this.router.navigate(['/teacher'], { replaceUrl: true });
      return;
    }

    // Check Student (username as rollNo)
    const student = this.students.find(s => s.rollNo === this.username);
    if (student && student.password === this.password) {
      this.saveSession(student);
     this.router.navigate(['/student'], { replaceUrl: true });
      return;
    }

    this.errorMsg = 'Invalid credentials!';
  }

  private saveSession(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
