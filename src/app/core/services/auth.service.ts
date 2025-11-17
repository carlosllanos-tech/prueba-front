import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { Usuario, UsuarioLogin } from '../models/usuario.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse } from '../models/auth-response.model';
import { ApiResponse } from '../models/api-response.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL base del API
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(response => response.data), // Extraer solo el data
        tap(data => {
          // Guardar token en localStorage
          this.storageService.setItem(environment.tokenKey, data.token);          
          // Guardar usuario en localStorage
          this.storageService.setItem(environment.userKey, data.usuario);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    // Limpiar todo el localStorage
    this.storageService.clear();  
    // Redirigir al login
    this.router.navigate(['/auth/login']);
  }

  getPerfil(): Observable<Usuario> {
    // Obtener el token actual
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/perfil`, { headers })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  // Obtiene el token actual guardado
  getToken(): string | null {
    return this.storageService.getItem<string>(environment.tokenKey);
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Verifica si el usuario tiene un rol específico
  hasRole(roles: string[]): boolean {
    const user: any = this.storageService.getItem(environment.userKey);
    if (!user || !user.rol) {
      return false;
    }
    return roles.includes(user.rol.nombre);
  }

  private handleError(error: HttpErrorResponse) {

    console.log('Error', error);
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.status === 400) {
      errorMessage = error.error.errors.map((err: any) => err.msg).join('\n') || 'Errores de validación';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#dc3545'
      });
    } else {
      errorMessage = error.error.message;
      if(error.status === 401) this.logout();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#dc3545'
      });
    }
    // Propagar el error para que el servicio pueda manejarlo si es necesario
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      errors: error.error?.errors
    }));
  }
  
}
