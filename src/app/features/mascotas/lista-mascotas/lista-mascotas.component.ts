import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Mascota } from '../../../models/mascota.model';
import { MascotaService } from '../../../core/mascota.service';
import { CitaService } from '../../../core/cita.service';

@Component({
  selector: 'app-lista-mascotas',
  standalone: false,
  templateUrl: './lista-mascotas.component.html',
  styleUrls: ['./lista-mascotas.component.css'],
})
export class ListaMascotasComponent {
  busqueda = new FormControl('', { nonNullable: true });
  mascotas: Mascota[] = [];

  constructor(private mascotaService: MascotaService, private citaService: CitaService) {
    this.cargar();
  }

  private cargar(): void {
    this.mascotas = this.mascotaService.listar();
  }

  get totalCitas(): number {
    return this.citaService.listar().length;
  }

  get citasPendientes(): number {
    return this.citaService.listar().filter((c) => c.estado === 'pendiente').length;
  }

  get filtradas(): Mascota[] {
    const q = this.busqueda.value.trim().toLowerCase();
    if (!q) return this.mascotas;
    return this.mascotas.filter(
      (m) =>
        m.nombre.toLowerCase().includes(q) ||
        m.dueno.nombre.toLowerCase().includes(q) ||
        m.especie.includes(q)
    );
  }

  eliminar(m: Mascota): void {
    if (!confirm(`¿Eliminar a ${m.nombre} y todo su historial?`)) return;
    this.citaService
      .listar()
      .filter((c) => c.mascotaId === m.id)
      .forEach((c) => this.citaService.eliminar(c.id));
    this.mascotaService.eliminar(m.id);
    this.cargar();
  }

  trackById(_: number, m: Mascota): number {
    return m.id;
  }
}