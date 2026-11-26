import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fechaEs', standalone: false })
export class FechaEsPipe implements PipeTransform {
  /** Convierte 2026-12-01 en "martes, 1 de diciembre de 2026" */
  transform(valor: string | null | undefined): string {
    if (!valor) return '';
    const fecha = new Date(valor + 'T00:00:00');
    if (isNaN(fecha.getTime())) return valor;
    return fecha.toLocaleDateString('es-PE', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }
}
