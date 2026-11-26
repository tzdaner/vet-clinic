import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Cita } from '../../../models/cita.model';
import { Mascota } from '../../../models/mascota.model';
import { CitaService, HORARIOS } from '../../../core/cita.service';
import { MascotaService } from '../../../core/mascota.service';
import { hoyISO } from '../../../shared/utils/fechas';

/** Validador personalizado: no se pueden agendar citas en fechas pasadas */
export function fechaNoPasada(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  return valor && valor < hoyISO() ? { fechaPasada: true } : null;
}

@Component({
  selector: 'app-agenda-citas',
  standalone: false,
  templateUrl: './agenda-citas.component.html',
})
export class AgendaCitasComponent implements OnInit {
  private fb = inject(FormBuilder);
  hoy = hoyISO();
  horarios = HORARIOS;
  mascotas: Mascota[] = [];
  citas: Cita[] = [];
  horasOcupadas: string[] = [];
  horasPasadas: string[] = [];
  horasLibres: string[] = [];
  mensaje = '';

  // Cita que se está atendiendo (para registrar diagnóstico)
  citaEnAtencion?: Cita;
  diagnostico = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] });

  form = this.fb.group({
    mascotaId: [null as number | null, Validators.required],
    fecha: [hoyISO(), [Validators.required, fechaNoPasada]],
    hora: ['', Validators.required],
    motivo: ['', [Validators.required, Validators.minLength(5)]],
  });

  constructor(
    private citaService: CitaService,
    private mascotaService: MascotaService
  ) {}

  ngOnInit(): void {
    this.mascotas = this.mascotaService.listar();
    this.refrescar();
    this.form.controls.fecha.valueChanges.subscribe(() => {
      this.form.controls.hora.reset('');
      this.actualizarHoras();
    });
  }

  private refrescar(): void {
    this.citas = this.citaService
      .listar()
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
    this.actualizarHoras();
  }

  /** Devuelve true si el horario ya pasó en la fecha local actual. */
  private horaYaPaso(fecha: string, hora: string): boolean {
    if (fecha < hoyISO()) return true;
    if (fecha > hoyISO()) return false;

    const ahora = new Date();
    const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    return hora <= horaActual;
  }

  private actualizarHoras(): void {
    const fecha = this.form.controls.fecha.value;
    if (!fecha) {
      this.horasOcupadas = [];
      this.horasPasadas = [];
      this.horasLibres = [];
      return;
    }

    this.horasOcupadas = this.citaService.horasOcupadas(fecha);
    this.horasPasadas = this.horarios.filter((h) => this.horaYaPaso(fecha, h));
    this.horasLibres = this.horarios.filter(
      (h) => !this.horasOcupadas.includes(h) && !this.horasPasadas.includes(h)
    );
  }

  nombreMascota(id: number): string {
    return this.mascotas.find((m) => m.id === id)?.nombre ?? 'Mascota eliminada';
  }

  agendar(): void {
    this.mensaje = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { mascotaId, fecha, hora, motivo } = this.form.getRawValue();

    // Revalidar al guardar para impedir horarios que hayan pasado mientras el formulario estaba abierto.
    if (this.horaYaPaso(fecha!, hora!)) {
      this.mensaje = 'No puedes agendar una cita en una hora que ya pasó. Elige un horario futuro.';
      this.actualizarHoras();
      this.form.controls.hora.reset('');
      return;
    }

    if (this.citaService.horasOcupadas(fecha!).includes(hora!)) {
      this.mensaje = 'Esa hora ya fue ocupada. Elige otra.';
      this.actualizarHoras();
      return;
    }
    this.citaService.agregar({
      mascotaId: Number(mascotaId),
      fecha: fecha!,
      hora: hora!,
      motivo: motivo!,
      estado: 'pendiente',
    });
    this.mensaje = 'Cita agendada correctamente.';
    this.form.patchValue({ hora: '', motivo: '' });
    this.form.controls.hora.markAsUntouched();
    this.form.controls.motivo.markAsUntouched();
    this.refrescar();
  }

  cancelar(c: Cita): void {
    if (!confirm('¿Cancelar esta cita?')) return;
    this.citaService.cambiarEstado(c.id, 'cancelada');
    this.refrescar();
  }

  iniciarAtencion(c: Cita): void {
    this.citaEnAtencion = c;
    this.diagnostico.reset('');
  }

  guardarAtencion(): void {
    if (!this.citaEnAtencion) return;
    if (this.diagnostico.invalid) {
      this.diagnostico.markAsTouched();
      return;
    }
    this.citaService.cambiarEstado(this.citaEnAtencion.id, 'atendida', this.diagnostico.value);
    this.citaEnAtencion = undefined;
    this.refrescar();
  }

  invalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  trackById(_: number, c: Cita): number {
    return c.id;
  }
}
