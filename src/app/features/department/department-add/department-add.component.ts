import { Component, EventEmitter, Output } from '@angular/core';
import { SharedPrimeNgModule } from '../../../shared/common/shared-prime-ng.module';
import { Department } from '../../../domain/models/department';
import { DepartmentService } from '../../../domain/services/department.service';
import { AuthService } from '../../../domain/services/auth-service/auth.service';
import { Login } from '../../../domain/models/auth/login';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-department-add',
    imports: [SharedPrimeNgModule, LoadingComponent],
    templateUrl: './department-add.component.html',
    styleUrl: './department-add.component.scss'
})
export class DepartmentAddComponent {
    visible: boolean = false;
    logedInUser!: Login;
    department!: Department;
    loading: boolean = false;
    @Output() saved = new EventEmitter<void>();

    constructor(
        private departmentService: DepartmentService,
        private authService: AuthService,
        private messageService: MessageService
    ) {
        this.logedInUser = this.authService.getAuthUser()!;
        this.department = { id: 0, companyId: this.logedInUser.companyID, departmentCode: '', departmentName: '', isActive: true, entryUseId: this.logedInUser.id, entryDate: new Date() };
    }

    statusOptions = [
        { label: 'Active', value: true },
        { label: 'Inactive', value: false }
    ];

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
        this.department = { id: 0, companyId: 1, departmentCode: '', departmentName: '', isActive: true, entryUseId: 1, entryDate: new Date() };
    }

    async onSave() {
        if (this.department.departmentCode == '' || this.department.departmentName == '') {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Department Code and Name is required' });
            return;
        }

        try {
            this.loading = true;
            const result = await this.departmentService.createDepartment(this.department);
            this.loading = false;
            this.saved.emit(result); // Notify parent
            this.hide();
            // Reset form
            this.department = { id: 0, companyId: 1, departmentCode: '', departmentName: '', isActive: true, entryUseId: 1, entryDate: new Date() };
        } catch (error) {
            console.error('Error saving department', error);
        }
    }
}
