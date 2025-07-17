import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { Attendance } from './admin/attendance/attendance';
import { Classes } from './admin/classes/classes';
import { Notices } from './admin/notices/notices';
import { Students } from './admin/students/students';
import { Teachers } from './admin/teachers/teachers';

import { TeacherDashboard } from './teacher/teacher-dashboard/teacher-dashboard';
import { MyClasses } from './teacher/my-classes/my-classes';
import { Tests } from './teacher/tests/tests';

import { StudentDashboard } from './student/student-dashboard/student-dashboard';
import { Marks } from './student/marks/marks';

import { authGuard } from './guards/auth.guard';
import { adminGuard, teacherGuard, studentGuard } from './guards/role.guard';

import { NotFound } from './shared/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },

  // ------------------ Admin Routes ------------------
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', component: AdminDashboard },
      { path: 'attendance', component: Attendance },
      { path: 'classes', component: Classes },
      { path: 'notices', component: Notices },
      { path: 'students', component: Students },
      { path: 'teachers', component: Teachers }
    ]
  },

  // ------------------ Teacher Routes ------------------
  {
    path: 'teacher',
    canActivate: [authGuard, teacherGuard],
    children: [
      { path: '', component: TeacherDashboard },
      { path: 'attendance', component: Attendance },
      { path: 'my-classes', component: MyClasses },
      { path: 'tests', component: Tests }
    ]
  },

  // ------------------ Student Routes ------------------
  {
    path: 'student',
    canActivate: [authGuard, studentGuard],
    children: [
      { path: '', component: StudentDashboard },
      { path: 'attendance', component: Attendance },
      { path: 'marks', component: Marks }
    ]
  },

  // ------------------ Not Found ------------------
  { path: '404', component: NotFound },
  { path: '**', redirectTo: '404' }
];
