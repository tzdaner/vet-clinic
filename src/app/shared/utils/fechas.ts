/** Devuelve la fecha local de hoy en formato YYYY-MM-DD */
export function hoyISO(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/** Diferencia en días entre una fecha YYYY-MM-DD y hoy (0 = hoy, 1 = mañana, -1 = ayer) */
export function diasDesdeHoy(fecha: string): number {
  const hoy = new Date(hoyISO() + 'T00:00:00').getTime();
  const objetivo = new Date(fecha + 'T00:00:00').getTime();
  return Math.round((objetivo - hoy) / 86400000);
}
