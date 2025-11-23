import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { StorageService } from '../../../core/services/storage.service';
import { AuthService } from '../../../core/services/auth.service';
import { catchError, Observable, throwError } from 'rxjs';
import { TablaPosicionesResponse } from '../models/reporte.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = `${environment.apiUrl}/reportes`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  private getAuthHeaders() {
    const token = this.storageService.getItem<string>(environment.tokenKey);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Obtener tabla de posiciones en JSON
  getTablaPosiciones(torneoId: number): Observable<TablaPosicionesResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<TablaPosicionesResponse>(`${this.apiUrl}/tabla-posiciones/torneo/${torneoId}`, { headers })
      .pipe(catchError(this.handleError.bind(this)));
  }

  // Descargar reporte de equipos por torneo
  descargarEquiposPorTorneo(torneoId: number, formato: 'pdf' | 'excel'): void {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/equipos/torneo/${torneoId}/${formato}`;
    
    this.http.get(url, { 
      headers, 
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        this.descargarArchivo(response.body!, `equipos_torneo_${torneoId}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`);
      },
      error: (error) => this.handleError(error)
    });
  }

  // Descargar reporte de jugadores por equipo
  descargarJugadoresPorEquipo(equipoId: number, formato: 'pdf' | 'excel'): void {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/jugadores/equipo/${equipoId}/${formato}`;
    
    this.http.get(url, { 
      headers, 
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        this.descargarArchivo(response.body!, `jugadores_equipo_${equipoId}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`);
      },
      error: (error) => this.handleError(error)
    });
  }

  // Descargar reporte de fixture por torneo
  descargarFixturePorTorneo(torneoId: number, formato: 'pdf' | 'excel'): void {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/fixture/torneo/${torneoId}/${formato}`;
    
    this.http.get(url, { 
      headers, 
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        this.descargarArchivo(response.body!, `fixture_torneo_${torneoId}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`);
      },
      error: (error) => this.handleError(error)
    });
  }

  // Descargar tabla de posiciones
  descargarTablaPosiciones(torneoId: number, formato: 'pdf' | 'excel'): void {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/tabla-posiciones/torneo/${torneoId}/${formato}`;
    
    this.http.get(url, { 
      headers, 
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        this.descargarArchivo(response.body!, `tabla_posiciones_${torneoId}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`);
      },
      error: (error) => this.handleError(error)
    });
  }

  // Método auxiliar para descargar archivos
  private descargarArchivo(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
    
    Swal.fire({
      icon: 'success',
      title: 'Descarga exitosa',
      text: 'El reporte se ha descargado correctamente',
      timer: 1500,
      showConfirmButton: false
    });
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.log('Error', error);
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.status === 400) {
      errorMessage = error.error.errors?.map((err: any) => err.msg).join('\n') || 'Errores de validación';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#dc3545'
      });
    } else {
      errorMessage = error.error.message || errorMessage;
      if (error.status === 401) this.authService.logout();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#dc3545'
      });
    }
    
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      errors: error.error?.errors
    }));
  }
}
