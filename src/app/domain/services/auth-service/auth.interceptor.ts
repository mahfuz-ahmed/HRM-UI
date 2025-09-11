import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Login } from '../../models/auth/login';
import { environment } from '../../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const authService = inject(AuthService);
    let token = authService.getToken();

    // Skip login and refresh calls
    if (request.url.includes('/api/auth/login') || request.url.includes('/api/auth/refresh')) {
        return next(request);
    }

    // Add Authorization header
    if (token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Try refreshing token
                return authService.refreshToken().pipe(
                    switchMap((user: Login) => {
                        token = user.jwtToken;
                        const clonedRequest = request.clone({
                            setHeaders: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        return next(clonedRequest);
                    }),
                    catchError((refreshError) => {
                        // Refresh failed → logout + redirect
                        authService.clearSession();
                        window.location.href = `${environment.hrmUrl}/auth/login`;
                        return throwError(() => refreshError);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};
