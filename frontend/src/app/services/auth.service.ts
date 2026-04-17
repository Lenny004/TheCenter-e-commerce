// ============================================================================
// The Center — Autenticación y sesión
// ============================================================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { UserRole } from '../models';
import { environment } from '../../environments/environment';

const API = '/api/auth';

export interface SetupStatusResponse {
  needsAdminSetup: boolean;
}

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

  private directAuthUrl(path: string): string | null {
    const direct = environment.apiDirectBase?.trim();
    if (!direct) return null;
    return `${direct.replace(/\/$/, '')}/api/auth/${path}`;
  }

  /** POST a /api/auth/... con reintento al backend directo si falla el proxy. */
  private authPostWithFallback<T>(path: string, body: unknown): Observable<T> {
    const primary$ = this.http.post<T>(`${API}/${path}`, body);
    const fb = this.directAuthUrl(path);
    if (!fb) return primary$;
    return primary$.pipe(catchError(() => this.http.post<T>(fb, body)));
  }

  /**
   * Sin autenticación: indica si hace falta crear el primer usuario como administrador.
   * Reintenta contra `environment.apiDirectBase` si `/api` no responde (proxy no configurado).
   */
  getSetupStatus(): Observable<SetupStatusResponse> {
    const params = new HttpParams().set('_t', String(Date.now()));
    const opts = {
      params,
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }
    };
    const primary$ = this.http.get<SetupStatusResponse>(`${API}/setup-status`, opts);
    const fb = this.directAuthUrl('setup-status');
    if (!fb) {
      return primary$;
    }
    return primary$.pipe(
      catchError(() => this.http.get<SetupStatusResponse>(fb, opts))
    );
  }

  register(data: RegisterPayload): Observable<unknown> {
    return this.authPostWithFallback<unknown>('register', data);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.authPostWithFallback<LoginResponse>('login', { email, password });
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
