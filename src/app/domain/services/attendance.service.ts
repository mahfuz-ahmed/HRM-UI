import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Attendance } from '../models/attendence';
import { AttendanceDto } from '../models/attendanceDto';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {
    constructor(private http: HttpClient) {}

    async getDataById(Id: number): Promise<Attendance> {
        const url = `${environment.apiUrl}/api/UserAttendance/GetUserAttendanceById/${Id}`;
        return firstValueFrom(this.http.get<Attendance>(url));
    }

    async getDataByCompanyId(Id: number): Promise<Attendance[]> {
        const url = `${environment.apiUrl}/api/UserAttendance/getDataByCompanyId/${Id}`;
        return firstValueFrom(this.http.get<Attendance[]>(url));
    }

    async getAttendance(companyId: number, startDate?: string, endDate?: string) {
        let params = new HttpParams();
        if (startDate) params = params.set('startDate', startDate);
        if (endDate) params = params.set('endDate', endDate);

        return firstValueFrom(this.http.get<AttendanceDto[]>(`${environment.apiUrl}/api/UserAttendance/GetDataByDate/${companyId}`, { params }));
    }

    async getAttendanceSummary(companyId: number, startDate?: string, endDate?: string) {
        let params = new HttpParams();
        if (startDate) params = params.set('startDate', startDate);
        if (endDate) params = params.set('endDate', endDate);

        return firstValueFrom(this.http.get<AttendanceDto>(`${environment.apiUrl}/api/UserAttendance/GetUserAttendanceSummary/${companyId}`, { params }));
    }

    async updateAttendace(attendence: Attendance): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${environment.apiUrl}/api/UserAttendance/UpdateUserAttendance/${attendence.id}`, attendence));
    }
}
