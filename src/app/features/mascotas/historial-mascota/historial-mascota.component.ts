import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cita } from '../../../models/cita.model';
import { Mascota } from '../../../models/mascota.model';
import { CitaService } from '../../../core/cita.service';
import { MascotaService } from '../../../core/mascota.service';

@Component({
  selector: 'app-historial-mascota',
  standalone: false,
  templateUrl: './historial-mascota.component.html',
  styleUrls: ['./historial-mascota.component.css'],
})
export class HistorialMascotaComponent {
  mascota?: Mascota;
  citas: Cita[] = [];

  constructor(
    route: ActivatedRoute,
    mascotaService: MascotaService,
    citaService: CitaService
  ) {
    const id = Number(route.snapshot.paramMap.get('id'));
    this.mascota = mascotaService.obtener(id);
    if (this.mascota) this.citas = citaService.porMascota(id);
  }

  get atendidas(): number {
    return this.citas.filter((c) => c.estado === 'atendida').length;
  }
}