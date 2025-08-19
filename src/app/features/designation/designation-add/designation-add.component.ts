import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Login } from '../../../domain/models/auth/login';
import { Designation } from '../../../domain/models/designation';
import { DesignationService } from '../../../domain/services/designation.service';
import { AuthService } from '../../../domain/services/auth-service/auth.service';
import { MessageService } from 'primeng/api';
import { SharedPrimeNgModule } from '../../../shared/common/shared-prime-ng.module';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { Department } from '../../../domain/models/department';
import { DepartmentService } from '../../../domain/services/department.service';

@Component({
    selector: 'app-designation-add',
    imports: [SharedPrimeNgModule, LoadingComponent],
    templateUrl: './designation-add.component.html',
    styleUrl: './designation-add.component.scss'
})
export class DesignationAddComponent implements OnInit {
    visible: boolean = false;
    logedInUser!: Login;
    designation!: Designation;
    departments!: Department[];
    loading: boolean = false;
    @Output() saved = new EventEmitter<void>();

    constructor(
        private designationService: DesignationService,
        private departmentService: DepartmentService,
        private authService: AuthService,
        private messageService: MessageService
    ) {
        this.logedInUser = this.authService.getAuthUser()!;
        this.designation = { id: 0, companyID: this.logedInUser.companyID, departmentID: 14, designationCode: '', designationName: '', isActive: true, entryUserID: this.logedInUser.id, entryDate: new Date() };
    }

    statusOptions = [
        { label: 'Active', value: true },
        { label: 'Inactive', value: false }
    ];

    async ngOnInit() {
        await this.getallDepartment();
    }

    async getallDepartment() {
        this.departmentService.getDataByCompanyId(this.logedInUser.companyID).then((data) => {
            this.departments = data;
        });
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
        this.designation = { id: 0, companyID: this.logedInUser.companyID, departmentID: 14, designationCode: '', designationName: '', isActive: true, entryUserID: this.logedInUser.id, entryDate: new Date() };
    }

    async onSave() {
        if (this.designation.designationCode == '' || this.designation.designationName == '') {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Designation Code and Name is required' });
            return;
        }

        try {
            this.loading = true;
            const result = await this.designationService.createDesignation(this.designation);
            this.loading = false;
            this.saved.emit(result); // Notify parent
            this.hide();
            // Reset form
            this.designation = { id: 0, companyID: this.logedInUser.companyID, departmentID: 1, designationCode: '', designationName: '', isActive: true, entryUserID: this.logedInUser.id, entryDate: new Date() };
        } catch (error) {
            console.error('Error saving department', error);
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Designation save failed' });
        }
    }
}
