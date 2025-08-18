import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Designation } from '../models/designation';

@Injectable({
    providedIn: 'root'
})
export class DesignationService {
    constructor(private http: HttpClient) {}

    async getDataByCompanyId(Id: number): Promise<Designation[]> {
        const url = `${environment.apiUrl}/api/designation/getDataByCompanyId/${Id}`;
        return firstValueFrom(this.http.get<Designation[]>(url));
    }

    async getAllDesigantion(): Promise<Designation[]> {
        return firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/api/designation/getallDesignation`));
    }

    async deleteDesignationByID(id: number): Promise<any> {
        const url = `${environment.apiUrl}api/designation/DeleteDesignationById/${id}`;
        return firstValueFrom(this.http.delete(url));
    }

    async createDesignation(designation: Designation): Promise<any> {
        return firstValueFrom(this.http.post<any>(`${environment.apiUrl}/api/designation/addDesignation`, designation));
    }

    async updateDesignation(designation: Designation): Promise<any> {
        return firstValueFrom(this.http.put<any>(`${environment.apiUrl}/api/designation/UpdateDesignation/${designation.id}`, designation));
    }

    deleteDesigantionById(id: number): Promise<any> {
        const url = `${environment.apiUrl}/api/designation/DeleteDesignationById/${id}`;
        return firstValueFrom(this.http.delete(url));
    }
}
