import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { SignUp } from '../../models/auth/signup';
import { LoginRequest } from '../../models/auth/login-request';
import { Login } from '../../models/auth/login';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenKey = 'token';
    private refreshTokenKey = 'refreshToken';
    private userKey = 'user';
    private currentUserSubject = new BehaviorSubject<Login | null>(this.getUserFromStorage());
    constructor(private http: HttpClient) {}

    // async login(loginRequest: LoginRequest): Promise<Login> {
    //     return firstValueFrom(this.http.post<Login>(`${environment.apiUrl}/api/auth/login`, loginRequest));
    // }

    // login(loginRequest: LoginRequest): Observable<Login> {
    //     return this.http.post<Login>(`${environment.apiUrl}/api/auth/login`, loginRequest);
    // }

    async signUp(signUp: SignUp) {
        return await firstValueFrom(this.http.post<any>(`${environment.apiUrl}/api/auth/signup`, signUp));
    }

    login(loginRequest: LoginRequest): Observable<Login> {
        return this.http.post<Login>(`${environment.apiUrl}/api/auth/login`, loginRequest).pipe(
            tap(() => this.clearSession()), // clear old session
            tap((user) => this.saveSession(user)) // save new session
        );
    }
    // Save tokens and user info in localStorage & update BehaviorSubject
    saveSession(user: Login): void {
        localStorage.setItem(this.tokenKey, user.jwtToken);
        localStorage.setItem(this.refreshTokenKey, user.refreshToken);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    // Clear all auth data
    clearSession(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUserSubject.next(null);
    }

    // Get token from localStorage
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    // Get refresh token
    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    // Get user from BehaviorSubject (current value)
    getAuthUser(): Login | null {
        return this.currentUserSubject.value;
    }

    // Observable to subscribe to user changes
    currentUser$(): Observable<Login | null> {
        return this.currentUserSubject.asObservable();
    }

    // Private helper to load user from localStorage on service init
    private getUserFromStorage(): Login | null {
        const userJson = localStorage.getItem(this.userKey);
        return userJson ? JSON.parse(userJson) : null;
    }
}
