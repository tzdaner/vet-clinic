import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoCitaPipe } from './pipes/estado-cita.pipe';
import { FechaEsPipe } from './pipes/fecha-es.pipe';
import { ResaltarProximaDirective } from './directives/resaltar-proxima.directive';

@NgModule({
  declarations: [EstadoCitaPipe, FechaEsPipe, ResaltarProximaDirective],
  imports: [CommonModule],
  exports: [CommonModule, EstadoCitaPipe, FechaEsPipe, ResaltarProximaDirective],
})
export class SharedModule {}
