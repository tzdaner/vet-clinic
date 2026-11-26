export type EstadoCita = 'pendiente' | 'atendida' | 'cancelada';

export interface Cita {
  id: number;
  mascotaId: number;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm
  motivo: string;
  estado: EstadoCita;
  diagnostico?: string;
}
