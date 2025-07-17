import { Component ,OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-student-dashboard',
  imports: [],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboard implements OnInit{
  student: any;
  sidebarOpen: boolean = false;

  attendanceSummary = 'Present: 20, Absent: 2';
  gradeSummary = 'Average: 88%';
  testSummary = '3 Tests Attempted';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.student = this.auth.getUser(); // Assuming it returns current logged-in student
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
