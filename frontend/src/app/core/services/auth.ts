import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../../core/models/auth.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http=inject(HttpClient);
  private apiUrl='http://localhost:3000/api/auth';

  login(data: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data, {
      withCredentials: true // This tells the browser to automatically include and accept cookies
    })
    .pipe(
      tap((response: LoginResponse) => {
        if (response.success && response.user) {
          // The token is now in an HttpOnly cookie managed by the browser. 
          // We only save the user data to localStorage (or state management).
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login failed:', error);
        return throwError(() => new Error('Invalid credentials'));
      })
    );

  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    // Making POST request to the Gateway proxy for user-service (/api/users)
    return this.http.post<RegisterResponse>('http://localhost:3000/api/users', data, {
      withCredentials: true // Extremely important to include admin's HttpOnly cookie!
    }).pipe(
      tap((response: RegisterResponse) => {
         console.log('Registration response:', response);
      }),
      catchError((error: HttpErrorResponse) => {
         console.error('Registration failed:', error);
         return throwError(() => error);
      })
    );
  }
} 