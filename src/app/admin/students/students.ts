import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
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

  students: any[] = [];
  filteredStudents: any[] = [];
  showForm = false;
  editingId: number | null = null;
  searchText = '';

  formData: any = {
    name: '',
    father_name: '',
    phone_number: '',
    email: '',
    address: '',
    class: '',
    section: '',
    roll_number: '',
    profile_pic: '',
    password: ''
  };

  private listUrl = 'http://192.168.100.71:8000/api/admin/students';  // For GET
  private itemUrl = 'http://192.168.100.71:8000/api/admin/student';  // For POST/PUT/DELETE
  private token = 'C3L613pL9SED0ab6mj3sQcVm8s1nZ2Jc0SiAvMtjaf875eb4';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getStudents();
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      })
    };
  }

  /** GET Students */
  getStudents() {
    this.http.get<any>(this.listUrl, this.getHeaders()).subscribe({
      next: res => {
        this.students = res?.students || [];
        this.filteredStudents = [...this.students];
      },
      error: err => console.error('GET error:', err)
    });
  }

  /** Search */
  searchStudent() {
    const term = this.searchText.toLowerCase().trim();
    this.filteredStudents = this.students.filter(s =>
      (s.name ?? '').toLowerCase().includes(term) ||
      (s.email ?? '').toLowerCase().includes(term) ||
      (s.roll_number ?? '').toLowerCase().includes(term)
    );
  }

  /** Open Form */
  openForm(student?: any) {
    if (student) {
      this.editingId = student.id;
      this.formData = { ...student, password: '' };
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
      name: '',
      father_name: '',
      phone_number: '',
      email: '',
      address: '',
      class: '',
      section: '',
      roll_number: '',
      profile_pic: '',
      password: ''
    };
  }

  /** Save (POST/PUT) */
  saveStudent() {
    const payload = { ...this.formData };
    console.log('Payload:', payload);

    if (this.editingId) {
      // PUT (update student)
      this.http.put(`${this.itemUrl}/${this.editingId}`, payload, this.getHeaders())
        .subscribe({
          next: () => {
            this.closeForm();
            this.getStudents();
          },
          error: err => console.error('PUT error:', err)
        });
    } else {
      // POST (new student)
      this.http.post(this.itemUrl, payload, this.getHeaders())
        .subscribe({
          next: () => {
            this.closeForm();
            this.getStudents();
          },
          error: err => console.error('POST error:', err)
        });
    }
  }

  /** Delete */
  deleteStudent(id: number) {
    if (!confirm('Delete this student?')) return;
    this.http.delete(`${this.itemUrl}/${id}`, this.getHeaders())
      .subscribe({
        next: () => this.getStudents(),
        error: err => console.error('DELETE error:', err)
      });
  }
}
