import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AgendaCitasComponent } from './agenda-citas/agenda-citas.component';

const routes: Routes = [{ path: '', component: AgendaCitasComponent }];

@NgModule({
  declarations: [AgendaCitasComponent],
  imports: [SharedModule, ReactiveFormsModule, RouterModule.forChild(routes)],
})
export class CitasModule {}
