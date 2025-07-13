import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Employee } from '../models/employee';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  async getDataById(Id: number): Promise<Employee> {
    const url = `${environment.apiUrl}/employee/GetDataByID/${Id}`;
    return firstValueFrom(this.http.get<Employee>(url));
  }

  async getAllEmployee(): Promise<Employee[]> {
    return firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/api/employee/getallemployee`));
  }

  async getAllCompanyEmployeeAsync(companyId: number): Promise<Employee[]> {
    return firstValueFrom(
      this.http.get<Employee[]>(`${environment.apiUrl}/employee/getallcompanyemployee?companyId=${companyId}`)
    ).catch(error => {
      throw error;
    });
  }

  async getDataByEmail(email: string): Promise<Employee> {
    const url = `${environment.apiUrl}/employee/GetDataByEmail/${email}`;
    return firstValueFrom(this.http.get<Employee>(url));
  }

  async deleteEmployeeByID(id: number): Promise<any> {
    const url = `${environment.apiUrl}/employee/DeleteEmployeeById/${id}`;
    return firstValueFrom(this.http.delete(url));
  }

  async createEmployee(employee: Employee): Promise<any> {
    return firstValueFrom(this.http.post<any>(`${environment.apiUrl}/employee/addemployee`, employee));
  }
}
