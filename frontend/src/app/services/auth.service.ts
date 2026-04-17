// ============================================================================
// The Center — Autenticación y sesión
// ============================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRole } from '../models';

const API = '/api/auth';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  rol?: UserRole;
}

/** 1 = usuario de tienda pública; 2 = usuario con acceso al área privada (admin / vendedor) */
export type UserType = 1 | 2;

export interface UserSession {
  id: number;
  name: string;
  email: string;
  rol: UserRole;
  userType: UserType;
}

interface LoginResponse {
  token: string;
  user: UserSession;
}

const USER_KEY = 'user';

/** Asegura userType numérico 1|2; si falta o es inválido, se infiere del rol. */
export function normalizeSessionUser(
  raw: Pick<UserSession, 'id' | 'name' | 'email' | 'rol'> & { userType?: unknown }
): UserSession {
  const rol = raw.rol;
  let userType = raw.userType != null ? Number(raw.userType) : NaN;
  if (userType !== 1 && userType !== 2) {
    userType = rol === 'cliente' ? 1 : 2;
  }
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    rol,
    userType: userType as UserType
  };
}

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
    const normalized = normalizeSessionUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): UserSession | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      const u = JSON.parse(raw) as UserSession;
      return normalizeSessionUser(u);
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

  /** Rol vendedor (gestión de catálogo propio en el panel) */
  isVendor(): boolean {
    return this.getUser()?.rol === 'vendedor';
  }

  /** Indica si el usuario debe usar el área privada (panel / gestión) */
  isPrivateAreaUser(): boolean {
    const u = this.getUser();
    if (!u) return false;
    return u.userType === 2 || (u.rol !== 'cliente' && u.rol != null);
  }
}
