import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeAddEditComponent } from './employee/employee-add-edit/employee-add-edit.component';
import { AuthGuard } from '../_helpers/auth.gaurd';
import { DepartmentComponent } from './department/department/department.component';
import { DesignationListComponent } from './designation/designation-list/designation-list.component';

export default [
    { path: 'list', component: EmployeeListComponent, canActivate: [AuthGuard] },
    { path: 'add-edit', component: EmployeeAddEditComponent, canActivate: [AuthGuard] },
    { path: 'department', component: DepartmentComponent, canActivate: [AuthGuard] },
    { path: 'designation', component: DesignationListComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
