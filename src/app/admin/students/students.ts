import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-students',
  standalone: true,
  templateUrl: './students.html',
  styleUrls: ['./students.css'],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class Students implements OnInit {

  // Lists
  students: any[] = [];
  filteredStudents: any[] = [];

  // UI
  showForm = false;
  editingId: string | null = null;
  searchText = '';

  // Form model (NOTE: class + sectionClass ALAG)
  formData: any = {
    studentName: '',
    fatherName: '',
    phone: '',
    email: '',
    class: '',
    sectionClass: '',
    rollNo: '',
    subjects: '',      // comma separated in form
    studentpic: '',
    password: ''
  };

  private apiUrl = 'https://686ce46214219674dcc98cf2.mockapi.io/students';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getStudents();
  }

  /* -------- GET All -------- */
  getStudents() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        // normalize subjects -> array
        this.students = data.map(s => ({
          ...s,
          subjects: Array.isArray(s.subjects)
            ? s.subjects
            : s.subjects
              ? Object.values(s.subjects)
              : []
        }));
        this.filteredStudents = [...this.students];
        console.log('Students loaded:', this.students);
      },
      error: (err) => console.error('GET error:', err)
    });
  }

  /* -------- Search -------- */
  searchStudent() {
    const term = this.searchText.toLowerCase().trim();
    if (!term) {
      this.filteredStudents = [...this.students];
      return;
    }
    this.filteredStudents = this.students.filter(s =>
      (s.studentName?.toLowerCase() ?? '').includes(term) ||
      (s.rollNo?.toLowerCase() ?? '').includes(term) ||
      (s.email?.toLowerCase() ?? '').includes(term) ||
      (s.phone?.toLowerCase() ?? '').includes(term) ||
      (s.class?.toLowerCase() ?? '').includes(term) ||
      (s.sectionClass?.toLowerCase() ?? '').includes(term)
    );
  }

  /* -------- Open / Close Form -------- */
  openForm(student?: any) {
    if (student) {
      this.editingId = student.id;
      this.formData = {
        studentName: student.studentName ?? '',
        fatherName: student.fatherName ?? '',
        phone: student.phone ?? '',
        email: student.email ?? '',
        class: student.class ?? '',
        sectionClass: student.sectionClass ?? '',
        rollNo: student.rollNo ?? '',
        subjects: (Array.isArray(student.subjects) ? student.subjects : []).join(', '),
        studentpic: student.studentpic ?? '',
        password: student.password ?? ''
      };
    } else {
      this.editingId = null;
      this.resetForm();
    }
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      studentName: '',
      fatherName: '',
      phone: '',
      email: '',
      class: '',
      sectionClass: '',
      rollNo: '',
      subjects: '',
      studentpic: '',
      password: ''
    };
  }

  /* -------- File Upload -> base64 -------- */
  onFileSelect(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.formData.studentpic = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /* -------- Save (POST/PUT) -------- */
  saveStudent() {
    const payload = {
      studentName: this.formData.studentName.trim(),
      fatherName: this.formData.fatherName.trim(),
      phone: this.formData.phone.trim(),
      email: this.formData.email.trim(),
      class: this.formData.class.trim(),
      sectionClass: this.formData.sectionClass.trim(),
      rollNo: this.formData.rollNo.trim(),
      password: this.formData.password,
      studentpic: this.formData.studentpic,
      subjects: this.formData.subjects
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
    };

    console.log(this.editingId ? 'PUT payload:' : 'POST payload:', payload);

    if (this.editingId) {
      this.http.put(`${this.apiUrl}/${this.editingId}`, payload).subscribe({
        next: (res) => {
          console.log('PUT ok:', res);
          this.closeForm();
          this.getStudents();
        },
        error: (err) => console.error('PUT error:', err)
      });
    } else {
      this.http.post(this.apiUrl, payload).subscribe({
        next: (res) => {
          console.log('POST ok:', res);
          this.closeForm();
          this.getStudents();
        },
        error: (err) => console.error('POST error:', err)
      });
    }
  }

  /* -------- Delete -------- */
  deleteStudent(id: string) {
    if (!confirm('Delete this student?')) return;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: (res) => {
        console.log('DELETE ok:', res);
        this.getStudents();
      },
      error: (err) => console.error('DELETE error:', err)
    });
  }
}