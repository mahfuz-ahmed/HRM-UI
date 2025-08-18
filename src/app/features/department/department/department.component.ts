import { Component, ViewChild } from '@angular/core';
import { Department } from '../../../domain/models/department';
import { DepartmentService } from '../../../domain/services/department.service';
import { SharedPrimeNgModule } from '../../../shared/common/shared-prime-ng.module';
import { DepartmentAddComponent } from '../department-add/department-add.component';
import { MessageService } from 'primeng/api';
import { Login } from '../../../domain/models/auth/login';
import { AuthService } from '../../../domain/services/auth-service/auth.service';

@Component({
    selector: 'app-department',
    imports: [SharedPrimeNgModule, DepartmentAddComponent],
    templateUrl: './department.component.html',
    styleUrl: './department.component.scss'
})
export class DepartmentComponent {
    departments!: Department[];
    selectedDepartment!: Department[];
    clonedDepartments: { [s: string]: Department } = {};
    @ViewChild('addDialog') addDialog!: DepartmentAddComponent;
    loginUser!: Login;

    constructor(
        private departmentService: DepartmentService,
        private messageService: MessageService,
        private authService: AuthService
    ) {
        this.loginUser = authService.getAuthUser()!;
    }

    statusOptions = [
        { label: 'Active', value: true },
        { label: 'InActive', value: false }
    ];

    async ngOnInit() {
        await this.getallDepartment();
    }

    async getallDepartment() {
        this.departmentService.getDataByCompanyId(this.loginUser.companyID).then((data) => {
            this.departments = data;
            console.log('Departments', this.departments);
        });
    }

    openAddDialog() {
        this.addDialog.show();
    }

    async onDepartmentSaved() {
        // Refresh your department list or do other actions
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Department Save Successfully.', life: 3000 });
        await this.getallDepartment();
    }

    onRowEditInit(department: Department) {
        this.clonedDepartments[department.id] = { ...department };
    }

    async onRowEditSave(department: Department) {
        try {
            if (department.departmentName.trim()) {
                department.updateUserId = this.loginUser.id;
                department.updateDate = new Date();
                await this.departmentService.updateDepartment(department);

                delete this.clonedDepartments[department.id]; // remove backup after successful save

                // Optional toast
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department updated' });
            } else {
                // rollback if invalid
                Object.assign(department, this.clonedDepartments[department.id]);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Department name required' });
            }
        } catch (error) {
            // rollback if API fails
            Object.assign(department, this.clonedDepartments[department.id]);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update failed' });
        }
    }

    onRowEditCancel(department: Department, index: number) {
        this.departments[index] = this.clonedDepartments[department.id]; // restore backup
        delete this.clonedDepartments[department.id]; // cleanup
    }

    // departmentCreate() {}

    async departmentDelete() {
        try {
            for (let dept of this.selectedDepartment) {
                await this.departmentService.deleteDepartmentById(dept.id);
            }

            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Departments Deleted Successfully.',
                life: 3000
            });

            await this.getallDepartment();
            this.selectedDepartment = []; // clear selection
        } catch (error) {
            console.error('Error deleting departments:', error);
        }
    }
}
