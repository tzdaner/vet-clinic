import { Dueno } from './dueno.model';

export type Especie = 'perro' | 'gato' | 'ave' | 'otro';

export class Mascota {
  constructor(
    public id: number,
    public nombre: string,
    public especie: Especie,
    public raza: string,
    public fechaNacimiento: string,
    public dueno: Dueno,
    public foto?: string
  ) {}

  /** Edad en años cumplidos */
  get edad(): number {
    const nac = new Date(this.fechaNacimiento + 'T00:00:00');
    const hoy = new Date();
    let edad = hoy.getFullYear() - nac.getFullYear();
    const cumpleAunNo =
      hoy.getMonth() < nac.getMonth() ||
      (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate());
    if (cumpleAunNo) edad--;
    return Math.max(edad, 0);
  }

  /** Reconstruye una instancia desde localStorage, conservando la foto si existe. */
  static desde(raw: any): Mascota {
    return new Mascota(raw.id, raw.nombre, raw.especie, raw.raza, raw.fechaNacimiento, raw.dueno, raw.foto);
  }
}