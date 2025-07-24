import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type Status = 'present' | 'absent' | '—';

interface Teacher {
  id: number;
  name: string;
  email: string;
  status?: Status; // Latest attendance status
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.css']
})
export class Attendanceteachers implements OnInit {

   adminName = '';
  adminPic = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  isSidebarOpen = false;

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  teachers: Teacher[] = [];
  today = new Date().toISOString().split('T')[0];

  private token = 'C3L613pL9SED0ab6mj3sQcVm8s1nZ2Jc0SiAvMtjaf875eb4';
  private teacherApi = 'http://192.168.1.107:8000/api/admin/teachers';
  private attendanceApi = 'http://192.168.1.107:8000/api/admin/teacher-attendance';


    toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  ngOnInit() {

   
    this.loadTeachers();
  }

  /** Auth Headers */
  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
  }

  /** Load teachers and their attendance status */
  loadTeachers() {
    this.http.get<any>(this.teacherApi, this.getHeaders()).subscribe({
      next: res => {
        const teachersList = res?.teachers || [];
        this.teachers = teachersList.map((t: Teacher) => ({
          ...t,
          status: '—'
        }));
        this.loadTodayAttendance(); // Load today's attendance for all teachers
        this.cdr.detectChanges();
      },
      error: err => console.error('Teacher API Error:', err)
    });
  }

  /** Load today's attendance from backend */
  loadTodayAttendance() {
    this.http.get<any>(`${this.attendanceApi}?date=${this.today}`, this.getHeaders()).subscribe({
      next: res => {
        const attendanceRecords = res?.records || res || [];
        this.teachers.forEach(teacher => {
          const record = attendanceRecords.find((a: any) => a.teacher_id === teacher.id);
          teacher.status = record ? record.status : '—';
        });
        this.cdr.detectChanges();
      },
      error: err => console.error('Attendance GET Error:', err)
    });
  }

  /** Mark attendance and save to backend */
  markAttendance(teacher: Teacher, status: Status) {
    const payload = {
      teacher_id: teacher.id,
      email: teacher.email,
      date: this.today,
      status
    };

    console.log('Sending Attendance:', payload);

    this.http.post(this.attendanceApi, payload, this.getHeaders()).subscribe({
      next: () => {
        teacher.status = status; // update UI
        this.cdr.detectChanges();
        alert(`${teacher.name} marked as ${status}`);
      },
      error: (err) => {
        console.error('Attendance POST Error:', err);
        alert('Failed to mark attendance: ' + JSON.stringify(err.error));
      }
    });
  }
}
