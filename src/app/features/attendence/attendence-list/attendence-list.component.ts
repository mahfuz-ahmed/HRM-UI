import { Component } from '@angular/core';
import { Attendance } from '../../../domain/models/attendence';
import { environment } from '../../../../environments/environment';
import { AttendanceService } from '../../../domain/services/attendance.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../domain/services/auth-service/auth.service';
import { Router } from '@angular/router';
import { Login } from '../../../domain/models/auth/login';
import { SharedPrimeNgModule } from '../../../shared/common/shared-prime-ng.module';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { AttendanceDto } from '../../../domain/models/attendanceDto';
import { AttendanceSummaryDto } from '../../../domain/models/attendanceSummaryDto';

@Component({
    selector: 'app-attendence-list',
    imports: [SharedPrimeNgModule, LoadingComponent],
    templateUrl: './attendence-list.component.html',
    styleUrl: './attendence-list.component.scss'
})
export class AttendenceListComponent {
    attendances: AttendanceDto[] | any;
    attendance: AttendanceDto | any;
    attendanceSummary: AttendanceSummaryDto | any;
    selectedAttendent: any;
    logedInUser: Login;
    loading: boolean = false;
    cols: any[] = [];
    startDate: Date | null = null;
    endDate: Date | null = null;
    apiUrl: string = environment.apiUrl;

    constructor(
        private attendanceService: AttendanceService,
        private messageService: MessageService,
        private authService: AuthService,
        private router: Router
    ) {
        this.logedInUser = this.authService.getAuthUser()!;
    }

    async ngOnInit() {
        await this.getAllAttendence();
        await this.getAttendenceSummary();
        console.log('Attendance Summary', this.attendanceSummary);
    }

    async getAllAttendence() {
        try {
            this.loading = true;
            this.attendances = await this.attendanceService.getAttendance(this.logedInUser.companyID);
        } catch (error) {
            throw new Error(`Error while getting all company employees ${error}`);
        } finally {
            this.loading = false;
        }
    }

    async getAttendenceSummary() {
        try {
            this.loading = true;
            this.attendanceSummary = await this.attendanceService.getAttendanceSummary(this.logedInUser.companyID);
        } catch (error) {
            throw new Error(`Error while getting all company employees ${error}`);
        } finally {
            this.loading = false;
        }
    }

    editAttendance(employee: any) {
        if (!employee.userDetails) {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'You can not edit company profile here.' });
            return;
        }
        this.router.navigate(['/features/employee-add-edit', employee.id]);
    }

    async loadAttendanceByDateRange() {
        if (!this.startDate || !this.endDate) return;

        try {
            this.loading = true;
            this.attendances = await this.attendanceService.getAttendance(this.logedInUser.companyID, this.startDate.toDateString(), this.endDate.toDateString());
            this.attendanceSummary = await this.attendanceService.getAttendanceSummary(this.logedInUser.companyID, this.startDate.toDateString(), this.endDate.toDateString());
        } catch (error) {
            throw new Error(`Error while getting all company employees ${error}`);
        } finally {
            this.loading = false;
        }
    }

    getStatusClass(status: string): string {
        switch (status?.toLowerCase()) {
            case 'present':
                return 'status-present';
            case 'absent':
                return 'status-absent';
            case 'leave':
                return 'status-leave';
            case 'late':
                return 'status-late';
            default:
                return '';
        }
    }
}
