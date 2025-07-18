import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { SharedPrimeNgModule } from '../../../shared/common/shared-prime-ng.module';
import { UserService } from '../../../domain/services/user.service';
import { User } from '../../../domain/models/user';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [SharedPrimeNgModule,LoadingComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {

  employees: User[] | any;
  employee: User | any;
  selectedEmployee: any;
  loading: boolean = false;

  constructor(private userService: UserService, private messageService: MessageService,private router: Router, private confirmationService: ConfirmationService){}

  async ngOnInit(){
    this.getAllTest();
  }

  async getAllEmployees() {
   try {
    this.loading = true;
     this.employees = await this.userService.getAllCompanyEmployeeAsync(1);
   } catch (error) {
     this.loading = false;
     throw new Error(`Error while getting all company employees ${error}`)
   }
   this.loading = false;
 }

  async getAllTest() {
   try {
    this.loading = true;
     this.employees = await this.userService.getAllEmployee();
   } catch (error) {
     this.loading = false;
     throw new Error(`Error while getting all company employees ${error}`)
   }
   this.loading = false;
 }

 confirmEmployeeDelete() {
   if (!this.selectedEmployee) {
     this.messageService.add({
       severity: 'warn',
       summary: 'Warning',
       detail: 'No employee selected for deletion.',
     });
     return;
   }

   this.confirmationService.confirm({
     message: 'Are you sure you want to delete this employee? All documents and data will also be permanently deleted.',
     header: 'Confirm Deletion',
     icon: 'pi pi-exclamation-triangle',
     accept: async () => {
       this.loading = true;
       await this.employeeDelete(); // Called on confirmation
     },
     reject: () => {
       this.messageService.add({
         severity: 'info',
         summary: 'Cancelled',
         detail: 'Employee deletion cancelled.',
         life: 3000
       });
     }
   });
 }

 async employeeDelete() {
   try {
     const isDeleted: boolean = await this.userService.deleteEmployeeByID(this.selectedEmployee.id);
     if (isDeleted) {
       this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee Deleted Successfully.', life: 3000 });
       await this.getAllEmployees();
       this.selectedEmployee = null;
       this.loading = false;
     }
   } catch (error) {
     this.loading = false;
     console.error('Error deleting employee:', error);
   }
 }

 employeeCreate() {
   this.router.navigate(['/employee-management-add']);
 }

 employeeEdit(employee: any) {
   this.router.navigate(['/employee-management-edit', employee.id, 'employee']);
 }
}
