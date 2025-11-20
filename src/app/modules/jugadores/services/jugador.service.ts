import { Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { StorageService } from '../../../core/services/storage.service';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Jugador, JugadorForm, JugadorListado, JugadorResponse } from '../models/jugador.model';
import { ApiResponse } from '../../../core/models/api-response.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class JugadorService {
  private apiUrl = `${environment.apiUrl}/jugadores`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router,
    private authService: AuthService
  ) {}

  private getAuthHeaders() {
    const token = this.storageService.getItem<string>(environment.tokenKey);
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Obtener todos los jugadores
  getJugadores(): Observable<{ jugadores: JugadorListado[]; total: number }> {
    return this.http.get<ApiResponse<JugadorListado[]>>(this.apiUrl).pipe(
      map((response) => ({
        jugadores: response.data,
        total: response.total || 0,
      })),
      catchError(this.handleError.bind(this))
    );
  }

  // obtener jugador por id
  getJugadorPorId(id: number): Observable<Jugador> {
    return this.http.get<ApiResponse<Jugador>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data),
      catchError(this.handleError.bind(this))
    );
  }

  // Crear jugador (requiere autenticación)
  crearJugador(jugador: JugadorForm): Observable<JugadorResponse> {
    const headers = this.getAuthHeaders();

    return this.http
      .post<ApiResponse<JugadorResponse>>(this.apiUrl, jugador, { headers })
      .pipe(
        map((response) => response.data),
        catchError(this.handleError.bind(this))
      );
  }

  // Actualizar jugador (requiere autenticación)
  actualizarJugador(id: number, jugador: JugadorForm): Observable<JugadorResponse> {
    const headers = this.getAuthHeaders();

    return this.http
      .put<ApiResponse<JugadorResponse>>(`${this.apiUrl}/${id}`, jugador, {
        headers,
      })
      .pipe(
        map((response) => response.data),
        catchError(this.handleError.bind(this))
      );
  }

  // Eliminar jugador (requiere autenticación)
  eliminarJugador(id: number): Observable<void> {
    const headers = this.getAuthHeaders();

    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        map(() => undefined),
        catchError(this.handleError.bind(this))
      );
  }

  // Manejo de errores HTTP
  private handleError(error: HttpErrorResponse) {
    console.log('Error', error);
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.status === 400) {
      errorMessage =
        error.error.errors.map((err: any) => err.msg).join('\n') ||
        'Errores de validación';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#dc3545',
      });
    } else {
      errorMessage = error.error.message;
      if (error.status === 401) this.authService.logout();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#dc3545',
      });
    }

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      errors: error.error?.errors,
    }));
  }
}
