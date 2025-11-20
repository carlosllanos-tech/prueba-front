import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JugadorService } from '../../services/jugador.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { JugadorListado } from '../../models/jugador.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-listar-jugadores',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-jugadores.component.html',
  styleUrl: './listar-jugadores.component.css',
})
export class ListarJugadoresComponent implements OnInit {
  jugadores: JugadorListado[] = [];
  loading = true;
  total = 0;

  constructor(
    private jugadorService: JugadorService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarJugadores();
  }

  cargarJugadores(): void {
    this.loading = true;
    this.jugadorService.getJugadores().subscribe({
      next: (response) => {
        this.jugadores = response.jugadores;
        this.total = response.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  eliminarJugador(jugador: JugadorListado): void {
    Swal.fire({
      title: '¿Eliminar jugador?',
      text: `Se eliminará a ${jugador.nombre} ${jugador.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.jugadorService.eliminarJugador(jugador.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'Jugador eliminado exitosamente',
              timer: 1500,
              showConfirmButton: false,
            });
            this.cargarJugadores();
          },
        });
      }
    });
  }
}
