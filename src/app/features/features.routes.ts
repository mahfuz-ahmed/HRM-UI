import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeAddEditComponent } from './employee/employee-add-edit/employee-add-edit.component';

export default [
    { path: 'list', component: EmployeeListComponent },
    { path: 'add-edit', component: EmployeeAddEditComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;