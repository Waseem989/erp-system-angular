import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './teachers.html',
  styleUrl: './teachers.css'
})
export class Teachers implements OnInit {
  showForm = false;
  editIndex: number | null = null;
  teachers: any[] = [];
  filteredTeachers: any[] = [];
  searchTerm = '';

  apiURL = 'https://687e1dc6c07d1a878c315c88.mockapi.io/Teachers';

  formData: any = {
    name: '',
    fatherName: '',
    phone: '',
    email: '',
    address: '',
    subjects: '',
    class: '',
    profilePic: '',
    password: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getTeachers();
  }

  getTeachers() {
    this.http.get<any[]>(this.apiURL).subscribe(data => {
      this.teachers = data;
      this.filteredTeachers = data;
    });
  }

  searchTeachers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredTeachers = this.teachers.filter(t =>
      t.name.toLowerCase().includes(term) ||
      t.phone.includes(term) ||
      t.email.toLowerCase().includes(term)
    );
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editIndex = null;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      name: '',
      fatherName: '',
      phone: '',
      email: '',
      address: '',
      subjects: '',
      class: '',
      profilePic: '',
      password: ''
    };
  }

  onSubmit() {
    if (this.editIndex !== null) {
      // Update existing teacher
      const teacherId = this.filteredTeachers[this.editIndex].id;
      this.http.put(`${this.apiURL}/${teacherId}`, this.formData).subscribe(() => {
        this.getTeachers();
        this.closeForm();
      });
    } else {
      // Add new teacher
      this.http.post(this.apiURL, this.formData).subscribe(() => {
        this.getTeachers();
        this.closeForm();
      });
    }
  }

  editTeacher(teacher: any) {
    this.formData = { ...teacher };
    this.editIndex = this.filteredTeachers.indexOf(teacher);
    this.openForm();
  }

  deleteTeacher(id: string) {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.http.delete(`${this.apiURL}/${id}`).subscribe(() => {
        this.getTeachers();
      });
    }
  }
}
