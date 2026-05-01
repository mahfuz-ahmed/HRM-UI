import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeAddEditComponent } from './employee/employee-add-edit/employee-add-edit.component';
import { AuthGuard } from '../_helpers/auth.gaurd';
import { DepartmentComponent } from './department/department/department.component';
import { DesignationListComponent } from './designation/designation-list/designation-list.component';
import { AttendenceListComponent } from './attendence/attendence-list/attendence-list.component';
import { AttendenceDetailsComponent } from './attendence/attendence-details/attendence-details.component';
import { CheckinCheckoutComponent } from './attendence/checkin-checkout/checkin-checkout.component';

export default [
    { path: 'employees', component: EmployeeListComponent, canActivate: [AuthGuard] },
    { path: 'employee-add-edit', component: EmployeeAddEditComponent, canActivate: [AuthGuard] },
    { path: 'employee-add-edit/:id', component: EmployeeAddEditComponent, canActivate: [AuthGuard] },
    { path: 'department', component: DepartmentComponent, canActivate: [AuthGuard] },
    { path: 'designation', component: DesignationListComponent, canActivate: [AuthGuard] },
    { path: 'attendence-list', component: AttendenceListComponent, canActivate: [AuthGuard] },
    { path: 'attendence-details', component: AttendenceDetailsComponent, canActivate: [AuthGuard] },
    { path: 'checkin-checkout', component: CheckinCheckoutComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
