import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Asegúrate de que esta URL coincida con la de tu backend Laravel
  private apiUrl = 'http://127.0.0.1:8000/api';


  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.access_token) {
          localStorage.setItem('authToken', response.access_token);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}