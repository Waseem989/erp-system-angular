import { Component ,OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboard implements OnInit{
  isSidebarOpen = false;
  studentName = 'John Smith';
  studentPic = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
   const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.studentName = user.name || 'student';
  }

  toggleSidebar() {
     this.isSidebarOpen = !this.isSidebarOpen;
  }

   navigate(path: string) {
    this.router.navigate([`/student/${path}`]);
    this.toggleSidebar();
  }

  logout() {
 localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
