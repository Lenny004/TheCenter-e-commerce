// ============================================================================
// The Center — Autenticación y sesión
// ============================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserRole } from '../models';

const API = '/api/auth';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  rol?: UserRole;
}

export interface UserSession {
  id: number;
  name: string;
  email: string;
  rol: UserRole;
}

interface LoginResponse {
  token: string;
  user: UserSession;
}

const USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  register(data: RegisterPayload): Observable<unknown> {
    return this.http.post(`${API}/register`, data);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API}/login`, { email, password });
  }

  saveSession(token: string, user: UserSession): void {
    localStorage.setItem('token', token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): UserSession | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserSession;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem(USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getUser()?.rol === 'admin';
  }
}
