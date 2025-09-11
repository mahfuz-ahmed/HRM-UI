import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) {}

    async getDataById(Id: number): Promise<User> {
        const url = `${environment.apiUrl}/api/user/GetUserId/${Id}`;
        return firstValueFrom(this.http.get<User>(url));
    }

    async getAllEmployee(): Promise<User[]> {
        return firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/api/user/GetAllUser`));
    }

    async getAllCompanyEmployeeAsync(companyId: number): Promise<User[]> {
        const url = `${environment.apiUrl}/api/user/GetDataByCompanyId/${companyId}`;
        return firstValueFrom(this.http.get<User[]>(url));
    }

    async getDataByEmail(email: string): Promise<User> {
        const url = `${environment.apiUrl}/api/user/GetDataByEmail/${email}`;
        return firstValueFrom(this.http.get<User>(url));
    }

    async deleteEmployeeByID(id: number): Promise<any> {
        const url = `${environment.apiUrl}/api/user/DeleteUserById/${id}`;
        return firstValueFrom(this.http.delete(url));
    }

    // async updateEmployee(employee: User): Promise<any> {
    //     return firstValueFrom(this.http.put<any>(`${environment.apiUrl}/api/user/UpdateUser/${employee.id}`, employee));
    // }

    // async createEmployee(userObj: User, image: any, signature: any): Promise<any> {
    //     const formData = new FormData();
    //     formData.append('user', JSON.stringify(userObj)); // append JSON as string
    //     formData.append('image', image); // append image file
    //     formData.append('signature', signature); // append signature file

    //     return firstValueFrom(this.http.post<any>(`${environment.apiUrl}/api/user/AddUser`, formData));
    // }

    async updateEmployee(userObj: any, image: File, signature: File): Promise<any> {
        const formData = new FormData();
        formData.append('jsonData', JSON.stringify(userObj)); // JSON string only
        if (image) formData.append('image', image);
        if (signature) formData.append('signature', signature);

        return firstValueFrom(this.http.put<any>(`${environment.apiUrl}/api/user/UpdateUser`, formData));
    }

    async createEmployee(userObj: any, image: File, signature: File): Promise<any> {
        const formData = new FormData();
        formData.append('jsonData', JSON.stringify(userObj)); // JSON string only
        if (image) formData.append('image', image);
        if (signature) formData.append('signature', signature);

        return firstValueFrom(this.http.post<any>(`${environment.apiUrl}/api/user/AddUser`, formData));
    }
}
