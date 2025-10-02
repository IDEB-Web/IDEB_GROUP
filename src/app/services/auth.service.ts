import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.darkModeSubject.next(savedTheme === 'true');
    }
  }

  get isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  toggleDarkMode(): void {
    const newMode = !this.darkModeSubject.value;
    this.darkModeSubject.next(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  }


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

  getProfile(): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/user`, { headers }).pipe(
      tap(response => {
        if (response) {
          localStorage.setItem('user', JSON.stringify(response));
        }
      })
    );
  }

  googleSignIn(idToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/google-signin`, { token: idToken }).pipe(
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

  // Verificar si hay sesión iniciada
  isAuthenticated(): boolean {
    return !!this.getToken();
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
        error: () => this.clearLocalData()
      })
    );
  }

  sendResetEmail(email: string) {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(email: string, password: string, password_confirmation: string, token: string) {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, {
      email,
      password,
      password_confirmation,
      token
    });
  }

  updateProfile(data: any): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.put(`${this.apiUrl}/user`, data, { headers }).pipe(
      tap(updatedUser => localStorage.setItem('user', JSON.stringify(updatedUser)))
    );
  }

  private clearLocalData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}
