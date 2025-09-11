import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginRequest } from '../../models/auth/login-request';
import { Login } from '../../models/auth/login';
import { SignUpDto } from '../../models/auth/signupDto';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenKey = 'token';
    private refreshTokenKey = 'refreshToken';
    private userKey = 'user';

    private currentUserSubject = new BehaviorSubject<Login | null>(this.getUserFromStorage());

    constructor(private http: HttpClient) {}

    // Login
    login(loginRequest: LoginRequest): Observable<Login> {
        return this.http.post<Login>(`${environment.apiUrl}/api/auth/login`, loginRequest).pipe(
            tap(() => this.clearSession()), // clear old session
            tap((user) => this.saveSession(user)) // save new session
        );
    }

    // Signup
    async signUp(signUp: SignUpDto) {
        return await firstValueFrom(this.http.post<any>(`${environment.apiUrl}/api/auth/signup`, signUp));
    }

    // Refresh token
    refreshToken(): Observable<Login> {
        const refreshToken = this.getRefreshToken();
        const token = this.getToken();

        if (!refreshToken || !token) {
            throw new Error('No refresh token available');
        }

        return this.http
            .post<Login>(`${environment.apiUrl}/api/auth/refresh`, {
                token,
                refreshToken
            })
            .pipe(
                tap((user) => this.saveSession(user)) // save new tokens
            );
    }

    // Save tokens and user
    saveSession(user: Login): void {
        localStorage.setItem(this.tokenKey, user.jwtToken);
        localStorage.setItem(this.refreshTokenKey, user.refreshToken);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    // Clear session
    clearSession(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUserSubject.next(null);
    }

    // Getters
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    getAuthUser(): Login | null {
        return this.currentUserSubject.value;
    }

    currentUser$(): Observable<Login | null> {
        return this.currentUserSubject.asObservable();
    }

    private getUserFromStorage(): Login | null {
        const userJson = localStorage.getItem(this.userKey);
        return userJson ? JSON.parse(userJson) : null;
    }
}
