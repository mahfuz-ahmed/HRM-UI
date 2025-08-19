import { Component, ViewChild } from '@angular/core';
import { DesignationAddComponent } from '../designation-add/designation-add.component';
import { SharedPrimeNgModule } from '../../../shared/common/shared-prime-ng.module';
import { Designation } from '../../../domain/models/designation';
import { Login } from '../../../domain/models/auth/login';
import { DesignationService } from '../../../domain/services/designation.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../domain/services/auth-service/auth.service';
import { Department } from '../../../domain/models/department';
import { DepartmentService } from '../../../domain/services/department.service';

@Component({
    selector: 'app-designation-list',
    imports: [SharedPrimeNgModule, DesignationAddComponent],
    templateUrl: './designation-list.component.html',
    styleUrl: './designation-list.component.scss'
})
export class DesignationListComponent {
    designations!: Designation[];
    selectedDesignation!: Designation[];
    departments!: Department[];
    clonedDesignations: { [s: string]: Designation } = {};
    @ViewChild('addDialog') addDialog!: DesignationAddComponent;
    loginUser!: Login;

    constructor(
        private designationService: DesignationService,
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
        await this.getallDesignation();
        await this.getallDepartment();
    }

    async getallDesignation() {
        this.designationService.getDataByCompanyId(this.loginUser.companyID).then((data) => {
            this.designations = data;
        });
    }

    async getallDepartment() {
        this.departmentService.getDataByCompanyId(this.loginUser.companyID).then((data) => {
            this.departments = data;
        });
    }

    openAddDialog() {
        this.addDialog.show();
    }

    async onDesignationSaved() {
        // Refresh your department list or do other actions
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Designation Save Successfully.', life: 3000 });
        await this.getallDesignation();
    }

    onRowEditInit(designation: Designation) {
        this.clonedDesignations[designation.id] = { ...designation };
    }

    async onRowEditSave(designation: Designation) {
        try {
            if (designation.designationName.trim()) {
                designation.updateUserID = this.loginUser.id;
                designation.updateDate = new Date();
                await this.designationService.updateDesignation(designation);

                delete this.clonedDesignations[designation.id]; // remove backup after successful save

                // Optional toast
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Designation updated' });
            } else {
                // rollback if invalid
                Object.assign(designation, this.clonedDesignations[designation.id]);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Designation name required' });
            }
        } catch (error) {
            // rollback if API fails
            Object.assign(designation, this.clonedDesignations[designation.id]);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update failed' });
        }
    }

    onRowEditCancel(designation: Designation, index: number) {
        this.designations[index] = this.clonedDesignations[designation.id]; // restore backup
        delete this.clonedDesignations[designation.id]; // cleanup
    }

    async designationDelete() {
        try {
            for (let desig of this.selectedDesignation) {
                await this.designationService.deleteDesigantionById(desig.id);
            }

            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Departments Deleted Successfully.',
                life: 3000
            });

            await this.getallDesignation();
            this.selectedDesignation = []; // clear selection
        } catch (error) {
            console.error('Error deleting departments:', error);
        }
    }
}
