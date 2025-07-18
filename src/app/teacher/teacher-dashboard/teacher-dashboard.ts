import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-teacher-dashboard',
  imports: [CommonModule ],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.css'
})
export class TeacherDashboard {
 isSidebarOpen = false;
  teacherName = 'John Smith';
  teacherPic = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  totalClasses = 4;
  totalAttendance = 12;
  totalTests = 3;
  totalNotices = 5;

  constructor(private router: Router, private http: HttpClient) {}

    ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.teacherName = user.name || 'teacher';
   
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

    

  navigate(path: string) {
    this.router.navigate([`/teacher/${path}`]);
    this.toggleSidebar();
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
