import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './teachers.html',
  styleUrls: ['./teachers.css']
})
export class Teachers implements OnInit {
  teachers: any[] = [];
  filteredTeachers: any[] = [];
  searchTerm = '';
  showForm = false;
  editingId: number | null = null;
  isSaving = false;
  isLoading = true; // 👈 loader flag
  selectedFile: File | null = null;

  private listUrl = 'http://192.168.1.107:8000/api/admin/teachers';
  private itemUrl = 'http://192.168.1.107:8000/api/admin/teacher';
  private token = 'C3L613pL9SED0ab6mj3sQcVm8s1nZ2Jc0SiAvMtjaf875eb4';

  formData: any = {
    name: '',
    father_name: '',
    phone_number: '',
    email: '',
    address: '',
    subject: '',
    class: '',
    profile_pic: '',
    password: ''
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getTeachers();
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`
      })
    };
  }

  /** GET Teachers */
  getTeachers(): void {
    this.isLoading = true;
    this.http.get<any>(this.listUrl, this.getHeaders()).subscribe({
      next: res => {
        this.teachers = res?.teachers || [];
        this.filteredTeachers = [...this.teachers];
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('teachers:', this.teachers); // ✅ Force view update
      },
      error: err => {
        this.isLoading = false;
        console.error('GET error:', err);
      }
    });
    console.log('teachers:', this.teachers);
  }

  /** Search */
  searchTeachers(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredTeachers = this.teachers.filter(t =>
      (t.name ?? '').toLowerCase().includes(term) ||
      (t.email ?? '').toLowerCase().includes(term) ||
      (t.phone_number ?? '').toLowerCase().includes(term) ||
      (t.subject ?? '').toLowerCase().includes(term) ||
      (t.class ?? '').toLowerCase().includes(term)
    );
  }

  /** Open Form */
  openForm(teacher?: any): void {
    if (teacher) {
      this.editingId = teacher.id;
      this.formData = { ...teacher, password: '' };
      this.selectedFile = null;
    } else {
      this.editingId = null;
      this.resetForm();
    }
    this.showForm = true;
  }

  /** Close Form */
  closeForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  /** Reset Form */
  resetForm(): void {
    this.formData = {
      name: '',
      father_name: '',
      phone_number: '',
      email: '',
      address: '',
      subject: '',
      class: '',
      profile_pic: '',
      password: ''
    };
    this.selectedFile = null;
    this.editingId = null;
  }

  /** File Picker */
  onFileSelect(event: any): void {
    const file = event?.target?.files?.[0];
    this.selectedFile = file || null;
  }

  /** Save Teacher (POST/PUT) */
  saveTeacher(): void {
    if (this.isSaving) return;
    this.isSaving = true;

    const fd = new FormData();
    Object.entries(this.formData).forEach(([key, val]) => {
      if (key === 'profile_pic') return;
      if (key === 'password' && this.editingId && !val) return;
      if (val !== undefined && val !== null && val !== '') {
        fd.append(key, String(val));
      }
    });
    if (this.selectedFile) fd.append('profile_pic', this.selectedFile);

    const url = this.editingId
      ? `${this.itemUrl}/${this.editingId}?_method=PUT`
      : this.itemUrl;

    this.http.post(url, fd, this.getHeaders()).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeForm();
        this.getTeachers();
        alert(this.editingId ? 'Teacher updated!' : 'Teacher added!');
      },
      error: err => {
        this.isSaving = false;
        console.error('Save error:', err);
        alert('Save failed: ' + JSON.stringify(err?.error ?? err));
      }
    });
  }

  /** Delete Teacher */
  deleteTeacher(id: number): void {
    if (!confirm('Delete this teacher?')) return;
    this.http.delete(`${this.itemUrl}/${id}`, this.getHeaders()).subscribe({
      next: () => this.getTeachers(),
      error: err => console.error('DELETE error:', err)
    });
  }
}
