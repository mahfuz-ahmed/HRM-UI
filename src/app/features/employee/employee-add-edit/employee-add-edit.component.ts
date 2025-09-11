import { SharedPrimeNgModule } from '../../../shared/common/shared-prime-ng.module';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../domain/services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../domain/services/auth-service/auth.service';
import { Login } from '../../../domain/models/auth/login';
import { DepartmentService } from '../../../domain/services/department.service';
import { DesignationService } from '../../../domain/services/designation.service';
import { Department } from '../../../domain/models/department';
import { Designation } from '../../../domain/models/designation';
import { User } from '../../../domain/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { environment } from '../../../../environments/environment';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
    selector: 'app-employee-add-edit',
    imports: [SharedPrimeNgModule, LoadingComponent],
    templateUrl: './employee-add-edit.component.html',
    styleUrl: './employee-add-edit.component.scss'
})
export class EmployeeAddEditComponent implements OnInit {
    userForm!: FormGroup;
    logedInUser!: Login;
    user!: User;
    departments!: Department[];
    designations!: Designation[];
    employeeId: number | null = null;
    isUpdate: boolean = true;
    selectedImage!: File;
    selectedSignature!: File;
    loading: boolean = false;
    preview: { image?: string; signature?: string } = {};

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private userService: UserService,
        private departmentService: DepartmentService,
        private designationService: DesignationService,

        private messageService: MessageService,
        private authService: AuthService,
        private confirmationService: ConfirmationService,
        private routerService: Router
    ) {
        this.logedInUser = this.authService.getAuthUser()!;
    }

    genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ];

    ngOnInit(): void {
        this.initializeForm();

        // Check if edit mode
        this.route.paramMap.subscribe((params) => {
            const id = params.get('id');
            if (id) {
                this.employeeId = +id;
                this.isUpdate = false;
                this.loadEmployeeDetails(this.employeeId);
            } else {
                this.userForm.get('password')?.setValidators([Validators.required]);
                this.userForm.get('cPassword')?.setValidators([Validators.required]);
            }
        });
        this.getDepartment();
        this.getDesignation();
    }

    initializeForm() {
        this.userForm = this.fb.group(
            {
                userDetailsId: [0],
                userDetailsUserID: [0],
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                gender: ['', Validators.required],
                birthDate: [new Date(), Validators.required],
                nidNumber: ['', [Validators.required, Validators.maxLength(12), Validators.pattern(/^[0-9]*$/)]],
                email: ['', [Validators.required, Validators.email]],
                password: [''],
                cPassword: [''],
                departmentID: ['', Validators.required],
                designationID: ['', Validators.required],
                joinDate: [new Date(), Validators.required],
                presentAddress: [''],
                permanentAddress: [''],
                about: [''],
                image: [null],
                signature: [null],
                isActive: [true],
                isAdmin: [false]
            },
            {
                validators: CustomValidators.mustMatch('password', 'cPassword')
            }
        );
    }

    async getDepartment() {
        this.departments = await this.departmentService.getDataByCompanyId(this.logedInUser.companyID);
    }

    async getDesignation() {
        this.designations = await this.designationService.getDataByCompanyId(this.logedInUser.companyID);
    }

    async onSubmit() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        this.loading = true;

        try {
            const userObj = await this.prepareUser();

            if (this.employeeId != null) {
                userObj.id = this.employeeId;

                if (!this.selectedImage) {
                    userObj.userDetails.image = this.userForm.value.image;
                }
                if (!this.selectedSignature) {
                    userObj.userDetails.signature = this.userForm.value.signature;
                }

                await this.userService.updateEmployee(userObj, this.selectedImage, this.selectedSignature);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee updated successfully' });
            } else {
                await this.userService.createEmployee(userObj, this.selectedImage, this.userForm.value.signature);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee created successfully' });
            }

            // Redirect to list page after save
            this.routerService.navigate(['/features/employees']);
        } catch (error) {
            console.error(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save employee' });
        } finally {
            this.loading = false;
        }
    }

    async prepareUser() {
        this.user = {
            id: 0,
            companyID: this.logedInUser.companyID,
            fullName: this.userForm.value.firstName + ' ' + this.userForm.value.lastName,
            email: this.userForm.value.email,
            password: this.userForm.value.password,
            isActive: this.userForm.value.isActive,
            isAdmin: this.userForm.value.isAdmin,
            joinDate: this.userForm.value.joinDate,
            entryUserID: this.logedInUser.id,
            entryDate: new Date(),
            updateUserID: null,
            updateDate: null,

            userDetails: {
                id: this.userForm.value.userDetailsId ?? 0,
                userID: this.userForm.value.userDetailsUserID ?? 0,
                firstName: this.userForm.value.firstName,
                lastName: this.userForm.value.lastName,
                gender: this.userForm.value.gender,
                birthDate: this.userForm.value.birthDate,
                nidNumber: this.userForm.value.nidNumber,
                departmentID: this.userForm.value.departmentID,
                designationID: this.userForm.value.designationID,
                presentAddress: this.userForm.value.presentAddress,
                permanentAddress: this.userForm.value.permanentAddress,
                about: this.userForm.value.about,
                image: undefined, //this.userForm.value.image
                signature: undefined, // this.userForm.value.signature
                entryUserId: this.logedInUser.id,
                entryDate: new Date(),
                updateUserId: 0,
                updateDate: new Date()
            }
        };
        return this.user;
    }

    async loadEmployeeDetails(id: number) {
        try {
            const employee = await this.userService.getDataById(id);
            if (employee) {
                this.userForm.patchValue({
                    userDetailsId: employee.userDetails.id, //user Details id
                    userDetailsUserID: employee.userDetails.userID,
                    firstName: employee.userDetails.firstName,
                    lastName: employee.userDetails.lastName,
                    gender: employee.userDetails.gender,
                    birthDate: new Date(employee.userDetails.birthDate),
                    nidNumber: employee.userDetails.nidNumber,
                    email: employee.email,
                    // password: employee.password,
                    departmentID: employee.userDetails.departmentID,
                    designationID: employee.userDetails.designationID,
                    joinDate: new Date(employee.joinDate),
                    presentAddress: employee.userDetails.presentAddress,
                    permanentAddress: employee.userDetails.permanentAddress,
                    about: employee.userDetails.about,
                    isActive: employee.isActive,
                    isAdmin: employee.isAdmin,
                    // For image/signature you can show preview but file input cannot pre-fill
                    image: employee.userDetails.image,
                    signature: employee.userDetails.signature
                });
                if (employee.userDetails.image) {
                    this.preview.image = environment.apiUrl + '/' + employee.userDetails.image;
                }
                if (employee.userDetails.signature) {
                    this.preview.signature = environment.apiUrl + '/' + employee.userDetails.signature;
                }
            }
        } catch (error) {
            console.error('Failed to load employee details', error);
        }
    }

    onFileSelected(event: any, field: 'image' | 'signature') {
        const file = event.target.files[0];
        if (file) {
            this.userForm.patchValue({ [field]: file });

            const reader = new FileReader();
            reader.onload = () => {
                this.preview[field] = reader.result as string;
            };
            reader.readAsDataURL(file);

            if (field === 'image') {
                this.selectedImage = file;
            }
            if (field === 'signature') {
                this.selectedSignature = file;
            }
        }
    }
}
