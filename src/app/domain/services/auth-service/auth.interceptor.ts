// import { HttpInterceptorFn } from '@angular/common/http';
// import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../../environments/environment';

// export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
//     // Get the token from localStorage
//     const token = localStorage.getItem('token');

//     // If token exists, clone the request and add the Authorization header
//     if (token) {
//         request = request.clone({
//             setHeaders: {
//                 Authorization: `Bearer ${token}`
//             }
//         });
//     } else {
//         window.location.href = `${environment.hrmUrl}/auth/login`;
//         // return throwError(() => error);
//     }

//     // Pass the request to the next handler
//     return next(request);
// };

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
    const token = authService.getToken();

    // Skip adding Authorization header for login and refresh endpoints
    if (request.url.includes('/api/auth/login') || request.url.includes('/api/auth/refresh')) {
        return next(request);
    }

    // Add Authorization header if token exists
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
                return authService.refreshToken().pipe(
                    switchMap((user: Login) => {
                        // Retry the original request with the new token
                        request = request.clone({
                            setHeaders: {
                                Authorization: `Bearer ${user.jwtToken}`
                            }
                        });
                        return next(request);
                    }),
                    catchError((refreshError) => {
                        // If refresh fails, log out and redirect to login
                        // authService.logout();
                        window.location.href = `${environment.hrmUrl}/auth/login`;
                        return throwError(() => refreshError);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};
