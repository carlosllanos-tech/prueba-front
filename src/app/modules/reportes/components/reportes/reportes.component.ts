import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TorneoListado } from '../../../torneos/models/torneo.model';
import { EquipoListado } from '../../../equipos/models/equipo.model';
import { TablaPosicionesResponse } from '../../models/reporte.model';
import { ReporteService } from '../../services/reporte.service';
import { TorneoService } from '../../../torneos/services/torneo.service';
import { EquipoService } from '../../../equipos/services/equipo.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  tipoReporte: 'equipos' | 'jugadores' | 'fixture' | 'tabla' = 'equipos';
  torneos: TorneoListado[] = [];
  equipos: EquipoListado[] = [];
  torneoSeleccionado: number | null = null;
  equipoSeleccionado: number | null = null;
  tablaPosiciones: TablaPosicionesResponse | null = null;
  descargando = false;
  loadingTabla = false;

  constructor(
    private reporteService: ReporteService,
    private torneoService: TorneoService,
    private equipoService: EquipoService
  ) {}

  ngOnInit(): void {
    this.cargarTorneos();
    this.cargarEquipos();
  }

  // Cargar torneos
  cargarTorneos(): void {
    this.torneoService.getTorneos().subscribe({
      next: (response) => {
        this.torneos = response.torneos;
      }
    });
  }

  // Cargar equipos
  cargarEquipos(): void {
    this.equipoService.getEquipos().subscribe({
      next: (response) => {
        this.equipos = response.equipos;
      }
    });
  }

  // Cambiar tipo de reporte
  cambiarTipoReporte(tipo: 'equipos' | 'jugadores' | 'fixture' | 'tabla'): void {
    this.tipoReporte = tipo;
    this.torneoSeleccionado = null;
    this.equipoSeleccionado = null;
    this.tablaPosiciones = null;
  }

  // Cargar tabla de posiciones
  cargarTablaPosiciones(): void {
    if (!this.torneoSeleccionado) {
      this.tablaPosiciones = null;
      return;
    }

    this.loadingTabla = true;
    this.reporteService.getTablaPosiciones(this.torneoSeleccionado).subscribe({
      next: (response) => {
        this.tablaPosiciones = response;
        this.loadingTabla = false;
      },
      error: () => {
        this.loadingTabla = false;
        this.tablaPosiciones = null;
      }
    });
  }

  // Descargar reporte
  descargar(tipo: string, id: number, formato: 'pdf' | 'excel'): void {
    this.descargando = true;

    switch(tipo) {
      case 'equipos':
        this.reporteService.descargarEquiposPorTorneo(id, formato);
        break;
      case 'jugadores':
        this.reporteService.descargarJugadoresPorEquipo(id, formato);
        break;
      case 'fixture':
        this.reporteService.descargarFixturePorTorneo(id, formato);
        break;
      case 'tabla':
        this.reporteService.descargarTablaPosiciones(id, formato);
        break;
    }

    // Reset después de 2 segundos
    setTimeout(() => {
      this.descargando = false;
    }, 2000);
  }
}
