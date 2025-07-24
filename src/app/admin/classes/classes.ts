import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './classes.html',
  styleUrls: ['./classes.css']
})
export class Classes implements OnInit {
  token = 'C3L613pL9SED0ab6mj3sQcVm8s1nZ2Jc0SiAvMtjaf875eb4';

  teachers: any[] = [];
  students: any[] = [];

  className = '';
  selectedClass = '';
  selectedTeacherId = '';
  matchedStudents: any[] = [];
  showPopup = false;
  savedClasses: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchTeachers();
    this.fetchStudents();
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`
      })
    };
  }

  fetchTeachers(): void {
    this.http.get<any>('http://192.168.1.107:8000/api/admin/teachers', this.getHeaders()).subscribe({
      next: res => {
        this.teachers = res.teachers || [];
      },
      error: err => console.error('Teacher fetch error:', err)
    });
  }

  fetchStudents(): void {
    this.http.get<any>('http://192.168.1.107:8000/api/admin/students', this.getHeaders()).subscribe({
      next: res => {
        this.students = res.students || [];
      },
      error: err => console.error('Student fetch error:', err)
    });
  }

  openPopup(): void {
    this.showPopup = true;
    this.className = '';
    this.selectedClass = '';
    this.selectedTeacherId = '';
    this.matchedStudents = [];
  }

  closePopup(): void {
    this.showPopup = false;
  }

  onClassChange(): void {
    this.matchedStudents = this.students.filter(s => s.class === this.selectedClass);
  }

  saveClass(): void {
    if (!this.className || !this.selectedClass || !this.selectedTeacherId || this.matchedStudents.length === 0) {
      alert('Fill all fields and make sure students exist for selected class.');
      return;
    }

    const teacher = this.teachers.find(t => t.id == this.selectedTeacherId);

    this.savedClasses.push({
      className: this.className,
      class: this.selectedClass,
      teacherName: teacher?.name,
      students: [...this.matchedStudents]
    });

    this.closePopup();
  }
  
}
