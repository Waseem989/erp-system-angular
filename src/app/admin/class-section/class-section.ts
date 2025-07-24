import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-class-section',
  imports: [CommonModule],
  templateUrl: './class-section.html',
  styleUrl: './class-section.css'
})
export class ClassSection implements OnInit {
 classId: string = '';
  students: any[] = [];
  teacher: any = null;
  className = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.classId = this.route.snapshot.paramMap.get('id') || '';

    // Fetch class details
    this.http.get(`/api/classes/${this.classId}`).subscribe((res: any) => {
      this.className = res.name;
      this.teacher = res.teacher;
      this.students = res.students;
    });
  }
}
