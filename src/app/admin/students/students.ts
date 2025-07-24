import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  isSaving = false;
  isLoading = true;
  selectedFile: File | null = null;

  formData: any = {
    name: '',
    father_name: '',
    phone_number: '',
    email: '',
    address: '',
    class: '',
    roll_number: '',
    profile_pic: '',
    password: ''
  };

  private listUrl = 'http://192.168.1.107:8000/api/admin/students';
  private itemUrl = 'http://192.168.1.107:8000/api/admin/student';
  private token = 'C3L613pL9SED0ab6mj3sQcVm8s1nZ2Jc0SiAvMtjaf875eb4';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getStudents();
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`
      })
    };
  }

  getStudents() {
    this.isLoading = true;
    this.http.get<any>(this.listUrl, this.getHeaders()).subscribe({
      next: res => {
        this.students = res?.students || [];
        this.filteredStudents = [...this.students];
        this.isLoading = false;
        this.cdr.detectChanges(); // Force Angular to detect changes
      },
      error: err => {
        console.error('GET error:', err);
        this.isLoading = false;
      }
    });
  }

  searchStudent() {
    const term = this.searchText.toLowerCase().trim();
    this.filteredStudents = this.students.filter(s =>
      (s.name ?? '').toLowerCase().includes(term) ||
      (s.email ?? '').toLowerCase().includes(term) ||
      (s.roll_number ?? '').toLowerCase().includes(term)
    );
  }

  openForm(student?: any) {
    if (student) {
      this.editingId = student.id;
      this.formData = { ...student, password: '' };
      this.selectedFile = null;
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
      roll_number: '',
      profile_pic: '',
      password: ''
    };
    this.selectedFile = null;
    this.editingId = null;
  }

  onFileSelect(event: any) {
    const file: File | undefined = event.target?.files?.[0];
    this.selectedFile = file || null;
  }

  saveStudent() {
    if (this.isSaving) return;
    this.isSaving = true;
    this.showForm = false;

    const fd = new FormData();
    Object.keys(this.formData).forEach(key => {
      if (key !== 'profile_pic' && this.formData[key]) {
        fd.append(key, this.formData[key]);
      }
    });

    if (this.selectedFile) {
      fd.append('profile_pic', this.selectedFile);
    }

    const url = this.editingId
      ? `${this.itemUrl}/${this.editingId}?_method=PUT`
      : this.itemUrl;

    this.http.post(url, fd, this.getHeaders()).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeForm();
        this.getStudents();
        alert(this.editingId ? 'Student updated!' : 'Student added!');
      },
      error: err => {
        this.isSaving = false;
        console.error('Save error:', err);
        alert('Save failed: ' + JSON.stringify(err.error));
      }
    });
  }

  deleteStudent(id: number) {
    if (!confirm('Delete this student?')) return;
    this.http.delete(`${this.itemUrl}/${id}`, this.getHeaders())
      .subscribe({
        next: () => this.getStudents(),
        error: err => console.error('DELETE error:', err)
      });
  }
}
