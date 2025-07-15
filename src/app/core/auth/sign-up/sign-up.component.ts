import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { SharedPrimeNgModule } from '../../../shared/common/shared-prime-ng.module';
import { AuthService } from '../../../domain/services/auth-service/auth.service';
import { SignUp } from '../../../domain/models/auth/signup';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [AppFloatingConfigurator, SharedPrimeNgModule, LoadingComponent],
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
    signupForm!: FormGroup;
    loading: boolean = false;

    constructor(
        private messageService: MessageService,
        private router: Router,
        private authService: AuthService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.formValidator();
    }

    formValidator() {
        this.signupForm = this.fb.group(
            {
                company: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', Validators.required]
            },
            { validators: this.passwordMatchValidator }
        );
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordMismatch: true };
    }

    async SignUp() {
        if (this.signupForm.invalid) {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill all required fields correctly.' });
            this.signupForm.markAllAsTouched();
            return;
        }

        const data: SignUp = {
            id: 0,
            email: this.signupForm.value.email,
            name: this.signupForm.value.company,
            address: 'dhaka',
            phone: 12345,
            web: 'www.test.com',
            fax: 123456,
            logo: 'logo.png',
            entryUserID: 1,
            entryDate: new Date(),
            updateUserID: null,
            updateDate: null,
            userDto: {
                id: 0,
                companyID: 1,
                userID: '1223',
                fullName: this.signupForm.value.company,
                email: this.signupForm.value.email,
                password: this.signupForm.value.password,
                isActive: true,
                isAdmin: true,
                joinDate: new Date(),
                entryUserID: 1,
                entryDate: new Date(),
                updateUserID: null,
                updateDate: null
            }
        };
        try {
            this.loading = true;
            var response = await this.authService.signUp(data);
            if (response) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Signup successful!' });
                // this.router.navigate(['/auth/login']);
            }
            this.loading = false;
        } catch (error: any) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error?.message || 'Signup failed'
            });
        }
    }
}
