import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  async getDataById(Id: number): Promise<User> {
    const url = `${environment.apiUrl}/employee/GetDataByID/${Id}`;
    return firstValueFrom(this.http.get<User>(url));
  }

  async getAllEmployee(): Promise<User[]> {
    return firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/api/user/getallemployee`));
  }

  async getAllCompanyEmployeeAsync(companyId: number): Promise<User[]> {
    return firstValueFrom(
      this.http.get<User[]>(`${environment.apiUrl}/employee/getallcompanyemployee?companyId=${companyId}`)
    ).catch(error => {
      throw error;
    });
  }

  async getDataByEmail(email: string): Promise<User> {
    const url = `${environment.apiUrl}/employee/GetDataByEmail/${email}`;
    return firstValueFrom(this.http.get<User>(url));
  }

  async deleteEmployeeByID(id: number): Promise<any> {
    const url = `${environment.apiUrl}/employee/DeleteEmployeeById/${id}`;
    return firstValueFrom(this.http.delete(url));
  }

  async createEmployee(employee: User): Promise<any> {
    return firstValueFrom(this.http.post<any>(`${environment.apiUrl}/employee/addemployee`, employee));
  }
}
