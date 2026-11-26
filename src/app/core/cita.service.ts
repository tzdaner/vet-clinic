import { Injectable } from '@angular/core';
import { BaseStorage } from './base-storage';
import { Cita, EstadoCita } from '../models/cita.model';

export const HORARIOS: string[] = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00',
];

@Injectable({ providedIn: 'root' })
export class CitaService extends BaseStorage<Cita> {
  constructor() {
    super('vet_citas');
  }

  protected hidratar(raw: any): Cita {
    return raw as Cita;
  }

  porMascota(mascotaId: number): Cita[] {
    return this.listar()
      .filter((c) => c.mascotaId === mascotaId)
      .sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
  }

  horasOcupadas(fecha: string): string[] {
    return this.listar()
      .filter((c) => c.fecha === fecha && c.estado !== 'cancelada')
      .map((c) => c.hora);
  }

  horasLibres(fecha: string): string[] {
    const ocupadas = this.horasOcupadas(fecha);
    return HORARIOS.filter((h) => !ocupadas.includes(h));
  }

  cambiarEstado(id: number, estado: EstadoCita, diagnostico?: string): void {
    const cita = this.obtener(id);
    if (!cita) return;
    this.actualizar({ ...cita, estado, diagnostico: diagnostico ?? cita.diagnostico });
  }
}
