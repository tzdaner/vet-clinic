import { Directive, HostBinding, Input } from '@angular/core';
import { diasDesdeHoy } from '../utils/fechas';

/**
 * Resalta la fila/elemento cuando la cita es hoy o mañana.
 * Uso: <tr [appResaltarProxima]="cita.fecha" [activa]="cita.estado === 'pendiente'">
 */
@Directive({ selector: '[appResaltarProxima]', standalone: false })
export class ResaltarProximaDirective {
  @Input('appResaltarProxima') fecha = '';
  @Input() activa = true;

  @HostBinding('class.table-warning')
  get esProxima(): boolean {
    if (!this.fecha || !this.activa) return false;
    const dias = diasDesdeHoy(this.fecha);
    return dias >= 0 && dias <= 1;
  }
}
