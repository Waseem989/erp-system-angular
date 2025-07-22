import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

type Status = 'present' | 'absent';

interface Teacher {
  id: string;
  teacherNane?: string;   // your API’s typo field
  teacherName?: string;
  name?: string;
  email?: string;
}

interface AttendanceRec {
  id?: string;
  teacherId: string;
  teacherName?: string;
  email?: string;
  date: string; // YYYY-MM-DD
  status: Status;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.css'],
})
export class Attendanceteachers implements OnInit {

  private http = inject(HttpClient);
  private cdr  = inject(ChangeDetectorRef);

  teachers: Teacher[] = [];
  attendanceRecords: AttendanceRec[] = [];
  attendanceMap: Record<string, Status | undefined> = {};

  // MockAPI endpoints
  teacherApi    = 'https://687e1dc6c07d1a878c315c88.mockapi.io/Teachers';
  attendanceApi = 'https://687e7ea1efe65e520086db7e.mockapi.io/tattendance';

  today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  ngOnInit() {
    this.loadTeachers();
  }

  /* ---------------- Load Teachers ---------------- */
  loadTeachers() {
    this.http.get<Teacher[]>(this.teacherApi).subscribe({
      next: (data) => {
        this.teachers = (data ?? []).map(t => this.normalizeTeacher(t));
        this.cdr.detectChanges();   // 🔥 force view update (zoneless)
        this.loadAttendance();
      },
      error: (err) => {
        console.error('Teachers API Error:', err);
        this.teachers = [];
        this.cdr.detectChanges();
      },
    });
  }

  private normalizeTeacher(t: Teacher): Teacher {
    // guarantee we always have a name + id string
    return {
      ...t,
      id: t.id?.toString() ?? '',
      teacherNane: t.teacherNane ?? t.teacherName ?? t.name ?? '(no name)',
      email: t.email ?? '',
    };
  }

  /* ---------------- Load Attendance ---------------- */
  loadAttendance() {
    this.http.get<AttendanceRec[]>(this.attendanceApi).subscribe({
      next: (records) => {
        this.attendanceRecords = records ?? [];
        this.buildAttendanceMap();
        this.cdr.detectChanges();   // 🔥 update view
      },
      error: (err) => console.error('Attendance API Error:', err),
    });
  }

  private buildAttendanceMap() {
    this.attendanceMap = {};
    for (const t of this.teachers) {
      const rec = this.attendanceRecords.find(
        r => r.teacherId == t.id && r.date == this.today
      );
      if (rec) this.attendanceMap[t.id] = rec.status;
    }
  }

  /* ---------------- Mark Attendance ---------------- */
  markAttendance(teacher: Teacher, status: Status) {
    const teacherId = teacher.id;
    const today = this.today;

    // Find if today's record exists in memory
    const existing = this.attendanceRecords.find(
      r => r.teacherId == teacherId && r.date == today
    );

    if (existing?.id) {
      // Update
      const payload: AttendanceRec = { ...existing, status };
      this.http.put<AttendanceRec>(`${this.attendanceApi}/${existing.id}`, payload)
        .subscribe({
          next: () => this.afterMarkSuccess(teacherId, status),
          error: err => console.error('Attendance update failed:', err),
        });
    } else {
      // Create
      const payload: AttendanceRec = {
        teacherId,
        teacherName: teacher.teacherNane ?? teacher.teacherName ?? teacher.name ?? '',
        email: teacher.email ?? '',
        date: today,
        status,
      };
      this.http.post<AttendanceRec>(this.attendanceApi, payload)
        .subscribe({
          next: () => this.afterMarkSuccess(teacherId, status),
          error: err => console.error('Attendance create failed:', err),
        });
    }
  }

  private afterMarkSuccess(teacherId: string, status: Status) {
    // optimistic update
    this.attendanceMap[teacherId] = status;
    this.cdr.detectChanges();
    // reload full attendance to stay in sync (optional but safer)
    this.loadAttendance();
  }

  /* ---------------- % Helper ---------------- */
  getPercentage(teacherId: string) {
    const recs = this.attendanceRecords.filter(r => r.teacherId == teacherId);
    if (!recs.length) return 0;
    const present = recs.filter(r => r.status === 'present').length;
    return ((present / recs.length) * 100).toFixed(0);
  }
}
