// ============================================================================
// The Center — Servicio de Autenticación (Frontend)
// Maneja login, registro, tokens JWT y estado de sesión
// ============================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // TODO: Implementar
  // - login(email, password)   → POST /api/auth/login
  // - register(data)           → POST /api/auth/register
  // - logout()                 → Limpiar tokens
  // - refreshToken()           → POST /api/auth/refresh
  // - isAuthenticated()        → Verificar si hay sesión activa
  // - getUser()                → Obtener datos del usuario actual
  // - getToken()               → Obtener access token almacenado

  constructor(private http: HttpClient) {}
}
