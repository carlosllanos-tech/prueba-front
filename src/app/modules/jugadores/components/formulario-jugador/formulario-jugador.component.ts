import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EquipoListado } from '../../../equipos/models/equipo.model';
import { JugadorService } from '../../services/jugador.service';
import { EquipoService } from '../../../equipos/services/equipo.service';
import { Jugador } from '../../models/jugador.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-jugador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-jugador.component.html',
  styleUrl: './formulario-jugador.component.css',
})
export class FormularioJugadorComponent implements OnInit {
  jugadorForm!: FormGroup;
  loading = false;
  isEditMode = false;
  jugadorId: number | null = null;
  equipos: EquipoListado[] = [];

  constructor(
    private fb: FormBuilder,
    private jugadorService: JugadorService,
    private equipoService: EquipoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarEquipos();
    this.checkEditMode();
  }

  private initForm(): void {
    this.jugadorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      fecha_nacimiento: ['', [Validators.required]],
      nro_camiseta: [
        null,
        [Validators.required, Validators.min(1), Validators.max(99)],
      ],
      posicion: ['', [Validators.required]],
      equipo_id: [null, [Validators.required]],
    });
  }

  private cargarEquipos(): void {
    this.equipoService.getEquipos().subscribe({
      next: (response) => {
        this.equipos = response.equipos;
      },
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jugadorId = +id;
      this.cargarJugador(this.jugadorId);
    }
  }

  private cargarJugador(id: number): void {
    this.loading = true;
    this.jugadorService.getJugadorPorId(id).subscribe({
      next: (jugador: Jugador) => {
        this.jugadorForm.patchValue({
          nombre: jugador.nombre,
          apellido: jugador.apellido,
          fecha_nacimiento: this.formatDateForInput(jugador.fecha_nacimiento),
          nro_camiseta: jugador.nro_camiseta,
          posicion: jugador.posicion,
          equipo_id: jugador.equipo_id,
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/jugadores']);
      },
    });
  }

  private formatDateForInput(isoDate: string): string {
    return isoDate.split('T')[0];
  }

  onSubmit(): void {
    if (this.jugadorForm.invalid) {
      Object.keys(this.jugadorForm.controls).forEach((key) => {
        this.jugadorForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const formData = this.jugadorForm.value;

    const request = this.isEditMode
      ? this.jugadorService.actualizarJugador(this.jugadorId!, formData)
      : this.jugadorService.crearJugador(formData);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `Jugador ${
            this.isEditMode ? 'actualizado' : 'creado'
          } exitosamente`,
          timer: 1500,
          showConfirmButton: false,
        });
        this.router.navigate(['/dashboard/jugadores']);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.jugadorForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.jugadorForm.get(field);
    if (control?.hasError('required')) return 'Este campo es requerido';
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control?.hasError('min')) return 'Mínimo 1';
    if (control?.hasError('max')) return 'Máximo 99';
    return '';
  }
}
