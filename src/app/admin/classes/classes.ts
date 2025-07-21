import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classes',
  imports: [],
  templateUrl: './classes.html',
  styleUrl: './classes.css'
})
export class Classes {
constructor(private router: Router) {}
    goTo(page: string) {
    this.router.navigate([`/admin/${page}`]);
  }
}
