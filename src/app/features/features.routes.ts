import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeAddEditComponent } from './employee/employee-add-edit/employee-add-edit.component';
import { AuthGuard } from '../_helpers/auth.gaurd';

export default [
    { path: 'list', component: EmployeeListComponent, canActivate:[AuthGuard] },
    { path: 'add-edit', component: EmployeeAddEditComponent, canActivate:[AuthGuard] },
    { path: '**', redirectTo: '/notfound' }
] as Routes;