import { Injectable } from '@angular/core';
import { BaseStorage } from './base-storage';
import { Mascota } from '../models/mascota.model';

@Injectable({ providedIn: 'root' })
export class MascotaService extends BaseStorage<Mascota> {
  constructor() {
    super('vet_mascotas');
  }

  protected hidratar(raw: any): Mascota {
    return Mascota.desde(raw);
  }
}
