import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  // Registro de usuario
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // Login de usuario
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.access_token) {
          localStorage.setItem('authToken', response.access_token);
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        }
      })
    );
  }

  // Obtener token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Obtener usuario desde localStorage
  getUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  // Verificar si el usuario es admin
  isAdmin(): boolean {
    const user = this.getUser();
    return !!user && user.role === 'admin';
  }

  // Crear headers con token
  private createAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // Obtener usuarios pendientes (solo admin)
  getPendingUsers(): Observable<User[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/admin/users/pending`, { headers });
  }

  // Aprobar usuario (solo admin)
  approveUser(id: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.patch(`${this.apiUrl}/admin/users/${id}/approve`, {}, { headers });
  }

  // Rechazar usuario (solo admin)
  rejectUser(id: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.patch(`${this.apiUrl}/admin/users/${id}/reject`, {}, { headers });
  }

  // Logout
  logout(): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers }).pipe(
      tap({
        next: () => this.clearLocalData(),
        error: () => this.clearLocalData() // Limpiar también si hay error
      })
    );
  }

  private clearLocalData(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
  }
}
