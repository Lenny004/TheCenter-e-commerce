// ============================================================================
// The Center — Usuarios (API administración)
// ============================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserRole } from '../models';

const API = `${environment.apiUrl}/users`;

export interface UserCreatePayload {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  rol: UserRole;
}

export interface UserUpdatePayload {
  name: string;
  email: string;
  phone?: string | null;
  rol: UserRole;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(API);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${API}/${id}`);
  }

  create(data: UserCreatePayload): Observable<User> {
    return this.http.post<User>(API, data);
  }

  update(id: number, data: UserUpdatePayload): Observable<User> {
    return this.http.put<User>(`${API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`);
  }
}
