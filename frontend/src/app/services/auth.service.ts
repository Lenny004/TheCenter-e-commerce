import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { User, UserRole } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string; user: User }> {
    // TODO: POST /api/auth/login
    const mockUser: User = { id: 1, name: 'Adrián', phone: '+503 7890-1234', email, rol: 'cliente' };
    return of({ token: 'mock-jwt-token', user: mockUser });
  }

  register(data: { name: string; email: string; phone?: string; password: string; rol: UserRole }): Observable<User> {
    // TODO: POST /api/auth/register
    return of({ id: Date.now(), name: data.name, email: data.email, phone: data.phone || null, rol: data.rol });
  }

  logout(): void {
    this.currentUser$.next(null);
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
