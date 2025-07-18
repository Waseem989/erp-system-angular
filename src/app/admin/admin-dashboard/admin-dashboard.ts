import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
 adminName = '';
  adminPic = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  isSidebarOpen = false;

  studentsCount = 210;
  teachersCount = 20;
  classesCount = 120;
  noticesCount = 5;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.adminName = user.name || 'Admin';
    this.fetchStats();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  fetchStats() {
    this.http.get<any[]>('http://localhost:3000/students').subscribe(data => this.studentsCount = data.length);
    this.http.get<any[]>('http://localhost:3000/teachers').subscribe(data => this.teachersCount = data.length);
    this.http.get<any[]>('http://localhost:3000/classes').subscribe(data => this.classesCount = data.length);
    this.http.get<any[]>('http://localhost:3000/notices').subscribe(data => this.noticesCount = data.length);
  }

  goTo(page: string) {
    this.router.navigate([`/admin/${page}`]);
    this.toggleSidebar();
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
