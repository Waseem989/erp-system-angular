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

  students: any[] = [];
  teachers: any[] = [];
  matchedStudents: any[] = [];

  showPopup = false;
  selectedClass: string = '';
  selectedTeacherId: string = '';
  selectedStudentIds: number[] = [];

  savedClasses: { class: string, teacher: string, subject: string, students: any[] }[] = [];

  private studentUrl = 'http://192.168.1.107:8000/api/admin/students';
  private teacherUrl = 'http://192.168.1.107:8000/api/admin/teachers';
  private token = 'C3L613pL9SED0ab6mj3sQcVm8s1nZ2Jc0SiAvMtjaf875eb4';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getStudents();
    this.getTeachers();
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`
      })
    };
  }

  getStudents() {
    this.http.get<any>(this.studentUrl, this.getHeaders()).subscribe({
      next: res => this.students = res?.students || [],
      error: err => console.error('Student fetch error', err)
    });
  }

  getTeachers() {
    this.http.get<any>(this.teacherUrl, this.getHeaders()).subscribe({
      next: res => this.teachers = res?.teachers || res || [],
      error: err => console.error('Teacher fetch error', err)
    });
  }

  openPopup(classNumber: string) {
    this.selectedClass = classNumber;
    this.showPopup = true;
    this.selectedTeacherId = '';
    this.matchedStudents = this.students.filter(s => s.class == classNumber);
    this.selectedStudentIds = this.matchedStudents.map(s => s.id); // Select all by default
  }

  saveClass() {
    if (!this.selectedTeacherId) return;

    const teacher = this.teachers.find(t => t.id == this.selectedTeacherId);
    const selectedStudents = this.students.filter(s => this.selectedStudentIds.includes(s.id));

    const newClass = {
      class: this.selectedClass,
      teacher: teacher.name,
      subject: teacher.subject,
      students: selectedStudents
    };

    this.savedClasses.push(newClass);
    this.closePopup();
  }

  closePopup() {
    this.showPopup = false;
    this.selectedClass = '';
    this.selectedTeacherId = '';
    this.matchedStudents = [];
    this.selectedStudentIds = [];
  }

  deleteClass(index: number) {
    this.savedClasses.splice(index, 1);
  }

  getClassesByNumber(classNo: string) {
    return this.savedClasses.filter(c => c.class === classNo);
  }
}
