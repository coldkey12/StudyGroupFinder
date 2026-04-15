import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserProfile
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/auth';

  login(data: { username: string; password: string }) {
  return this.http.post<any>('http://127.0.0.1:8000/api/accounts/login/', data);
}

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register/`, data);
  }

  logout(refresh: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/logout/`, { refresh });
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile/`);
  }

  saveTokens(access: string, refresh: string): void {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
  }

  saveUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  clearAuth(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
  }
}