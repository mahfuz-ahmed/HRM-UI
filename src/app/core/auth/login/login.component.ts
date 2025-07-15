import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { LoginRequest } from '../../../domain/models/auth/login-request';
import { AuthService } from '../../../domain/services/auth-service/auth.service';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { SharedPrimeNgModule } from '../../../shared/common/shared-prime-ng.module';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    imports: [SharedPrimeNgModule, AppFloatingConfigurator, LoadingComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    signInForm!: FormGroup;
    checked: boolean = false;
    loading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.signInForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberme: [false]
        });
    }

    signIn() {
        if (this.signInForm.invalid) {
            this.signInForm.markAllAsTouched();
            return;
        }

        const loginData: LoginRequest = this.signInForm.value;

        this.loading = true;

        this.authService.login(loginData).subscribe({
            next: (user) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Login Successful',
                    detail: 'Welcome back!'
                });

                this.router.navigate(['']);
            },
            error: (error) => {
                if (error.status === 401 || error.status === 404) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Login Failed',
                        detail: 'Email and password do not match'
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Login Failed',
                        detail: 'Something went wrong'
                    });
                }
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    // async signIn() {
    //     if (this.signInForm.invalid) {
    //         this.signInForm.markAllAsTouched();
    //         return;
    //     }

    //     const loginData: LoginRequest = {
    //         email: this.signInForm.value.email,
    //         password: this.signInForm.value.password
    //     };

    //     try {
    //         this.loading = true;

    //         const user = await this.authService.login(loginData);

    //         // Store JWT token and optionally user data
    //         localStorage.setItem('token', user.jwtToken);
    //         localStorage.setItem('refreshToken', user.refreshToken);
    //         localStorage.setItem('user', JSON.stringify(user));

    //         this.messageService.add({
    //             severity: 'success',
    //             summary: 'Login Successful',
    //             detail: 'Welcome back!'
    //         });

    //         this.router.navigate(['']);
    //     } catch (error: any) {
    //         if (error.status === 401 || error.status === 404) {
    //             this.messageService.add({
    //                 severity: 'error',
    //                 summary: 'Login Failed',
    //                 detail: 'Email and password do not match'
    //             });
    //         } else {
    //             this.messageService.add({
    //                 severity: 'error',
    //                 summary: 'Login Failed',
    //                 detail: 'Something went wrong'
    //             });
    //         }
    //     } finally {
    //         this.loading = false;
    //     }
    // }
}
