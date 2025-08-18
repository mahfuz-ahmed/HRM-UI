import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Department } from '../models/department';

@Injectable({
    providedIn: 'root'
})
export class DepartmentService {
    constructor(private http: HttpClient) {}

    async getDataById(Id: number): Promise<Department> {
        const url = `${environment.apiUrl}/api/department/GetDataByID/${Id}`;
        return firstValueFrom(this.http.get<Department>(url));
    }

    async getDataByCompanyId(Id: number): Promise<Department[]> {
        const url = `${environment.apiUrl}/api/department/getDataByCompanyId/${Id}`;
        return firstValueFrom(this.http.get<Department[]>(url));
    }

    async getAllDepartment(): Promise<Department[]> {
        return firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/api/department/getalldepartment`));
    }

    async deleteDepartmentByID(id: number): Promise<any> {
        const url = `${environment.apiUrl}api/department/DeleteDepartmentById/${id}`;
        return firstValueFrom(this.http.delete(url));
    }

    async createDepartment(department: Department): Promise<any> {
        return firstValueFrom(this.http.post<any>(`${environment.apiUrl}/api/department/adddepartment`, department));
    }

    async updateDepartment(department: Department): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${environment.apiUrl}/api/department/UpdateDepartment/${department.id}`, department));
    }

    deleteDepartmentById(id: number): Promise<any> {
        const url = `${environment.apiUrl}/api/department/DeleteDepartmentById/${id}`;
        return firstValueFrom(this.http.delete(url));
    }
}
