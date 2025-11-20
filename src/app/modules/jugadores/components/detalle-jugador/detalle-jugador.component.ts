import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Jugador } from '../../models/jugador.model';
import { JugadorService } from '../../services/jugador.service';

@Component({
  selector: 'app-detalle-jugador',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-jugador.component.html',
  styleUrl: './detalle-jugador.component.css'
})
export class DetalleJugadorComponent implements OnInit{
  jugador: Jugador | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private jugadorService: JugadorService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarJugador(+id);
    }
  }

  cargarJugador(id: number): void {
    this.jugadorService.getJugadorPorId(id).subscribe({
      next: (jugador) => {
        this.jugador = jugador;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
