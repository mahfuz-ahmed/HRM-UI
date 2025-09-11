import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { SharedPrimeNgModule } from '../../../shared/common/shared-prime-ng.module';
import { UserService } from '../../../domain/services/user.service';
import { User } from '../../../domain/models/user';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { Table } from 'primeng/table';
import { AuthService } from '../../../domain/services/auth-service/auth.service';
import { Login } from '../../../domain/models/auth/login';
import { environment } from '../../../../environments/environment.prod';

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-employee-list',
    standalone: true,
    imports: [SharedPrimeNgModule, LoadingComponent],
    templateUrl: './employee-list.component.html',
    styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
    employees: User[] | any;
    employee: User | any;
    selectedEmployee: any;
    logedInUser: Login;
    loading: boolean = false;
    cols: any[] = [];
    onrowDelete: boolean = false;
    exportColumns!: ExportColumn[];
    @ViewChild('dt') dt!: Table;
    apiUrl: string = environment.apiUrl;

    constructor(
        private userService: UserService,
        private messageService: MessageService,
        private authService: AuthService,
        private router: Router,
        private confirmationService: ConfirmationService
    ) {
        this.logedInUser = this.authService.getAuthUser()!;
    }

    async ngOnInit() {
        this.getAllEmployees();
        this.downloadDataFormat();
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    downloadDataFormat() {
        this.cols = [
            { field: 'email', header: 'Email' },
            { field: 'fullName', header: 'Full Name' },
            { field: 'isAdmin', header: 'Admin' },
            { field: 'isActive', header: 'Status' }
        ];

        this.exportColumns = this.cols.map((col) => ({
            title: col.header,
            dataKey: col.field
        }));
    }

    async getAllEmployees() {
        try {
            this.loading = true;
            this.employees = await this.userService.getAllCompanyEmployeeAsync(this.logedInUser.companyID);
        } catch (error) {
            throw new Error(`Error while getting all company employees ${error}`);
        } finally {
            this.loading = false;
        }
    }

    async getAllTest() {
        try {
            this.loading = true;
            this.employees = await this.userService.getAllEmployee();
        } catch (error) {
            this.loading = false;
            throw new Error(`Error while getting all company employees ${error}`);
        }
        this.loading = false;
    }

    confirmEmployeeDelete() {
        // if (!this.selectedEmployee) {
        //     this.messageService.add({
        //         severity: 'warn',
        //         summary: 'Warning',
        //         detail: 'No employee selected for deletion.'
        //     });
        //     return;
        // }

        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this employee? All documents and data will also be permanently deleted.',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                this.loading = true;
                if (this.onrowDelete) {
                }
                await this.employeeDelete(); // Called on confirmation
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelled',
                    detail: 'Employee deletion cancelled.',
                    life: 3000
                });
            }
        });
    }

    async employeeDelete() {
        try {
            //  if (this.onrowDelete) {
            //      isDeleted = await this.userService.deleteEmployeeByID(this.selectedEmployee.id);
            //  } else {
            //      isDeleted = await this.userService.deleteEmployeeByID(this.selectedEmployee[0].id);
            //  }

            let isDeleted: boolean = false;
            let idToDelete = this.onrowDelete ? this.selectedEmployee.id : this.selectedEmployee[0].id;
            isDeleted = await this.userService.deleteEmployeeByID(idToDelete);

            if (isDeleted) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Employee Deleted Successfully.',
                    life: 3000
                });
            } else {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Failed',
                    detail: 'Employee could not be deleted.',
                    life: 3000
                });
            }
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting employee',
                life: 3000
            });
        } finally {
            await this.getAllEmployees();
            this.selectedEmployee = null;
            this.onrowDelete = false;
            this.loading = false;
        }
    }

    employeeCreate() {
        this.router.navigate(['/features/employee-add-edit']);
        // this.employee = {};
    }

    employeeEdit(employee: any) {
        if (!employee.userDetails) {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'You can not edit company profile here.' });
            return;
        }

        this.router.navigate(['/features/employee-add-edit', employee.id]);
    }

    deleteEmployee(employee: any) {
        this.onrowDelete = true;

        this.selectedEmployee = employee;
        this.confirmEmployeeDelete();
    }
}
