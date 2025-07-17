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
import { Component } from '@angular/compiler';
import path from 'path';
import { NotFound } from './shared/not-found/not-found';



export const routes: Routes = [
{ path:'',redirectTo:'login', pathMatch:'full'},
{path:'login', component: Login},
//admin path and their subpages
{path:'admin', canActivate: [authGuard, adminGuard], component:AdminDashboard},
{path:'admin/attandance', canActivate: [authGuard, adminGuard], component:Attendance},
{path:'admim/classes', canActivate: [authGuard, adminGuard], component:Classes},
{path:'admin/notices', canActivate: [authGuard, adminGuard], component:Notices},
{path:'admin/students', canActivate: [authGuard, adminGuard], component:Students},
{path:'admin/teachers', canActivate: [authGuard, adminGuard],component:Teachers},

//teacher path and their subpages
{path:'teacher',canActivate: [authGuard, teacherGuard], component:TeacherDashboard},
{path:'teacher/attendance',canActivate: [authGuard, teacherGuard],component:Attendance},
{path:'teacher/my-classes',canActivate: [authGuard, teacherGuard],component:MyClasses},
{path:'teacher/tests',canActivate: [authGuard, teacherGuard],component:Tests},

// student path and their subpages
{path:'student',canActivate: [authGuard, studentGuard],component:StudentDashboard},
{path:'student/attendance',canActivate: [authGuard, studentGuard],component:Attendance},
{path:'student/marks',canActivate: [authGuard, studentGuard],component:Marks},

{path: '404', component:NotFound },
{path: '**', redirectTo: '404' }
];
