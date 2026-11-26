import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MascotaService } from '../../../core/mascota.service';
import { hoyISO } from '../../../shared/utils/fechas';

/** Validador personalizado: la fecha de nacimiento no puede ser futura */
export function noFutura(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  return valor && valor > hoyISO() ? { fechaFutura: true } : null;
}

@Component({
  selector: 'app-registro-mascota',
  standalone: false,
  templateUrl: './registro-mascota.component.html',
})
export class RegistroMascotaComponent {
  private fb = inject(FormBuilder);
  hoy = hoyISO();
  especies = ['perro', 'gato', 'ave', 'otro'];
  foto?: string;
  fotoError = '';

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    especie: ['perro', Validators.required],
    raza: ['', Validators.required],
    fechaNacimiento: ['', [Validators.required, noFutura]],
    dueno: this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
    }),
  });

  constructor(
    private mascotaService: MascotaService,
    private router: Router
  ) {}

  seleccionarFoto(event: Event): void {
    this.fotoError = '';
    const archivo = (event.target as HTMLInputElement).files?.[0];
    if (!archivo) return;
    if (!archivo.type.startsWith('image/')) {
      this.fotoError = 'Selecciona un archivo de imagen válido.';
      return;
    }
    if (archivo.size > 8 * 1024 * 1024) {
      this.fotoError = 'La imagen debe pesar menos de 8 MB.';
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      const imagen = new Image();
      imagen.onload = () => {
        const maximo = 700;
        const escala = Math.min(1, maximo / Math.max(imagen.width, imagen.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(imagen.width * escala);
        canvas.height = Math.round(imagen.height * escala);
        const contexto = canvas.getContext('2d');
        if (!contexto) {
          this.fotoError = 'No se pudo procesar la imagen. Intenta con otra.';
          return;
        }
        contexto.drawImage(imagen, 0, 0, canvas.width, canvas.height);
        this.foto = canvas.toDataURL('image/jpeg', 0.78);
      };
      imagen.onerror = () => this.fotoError = 'No se pudo leer la imagen. Intenta con otra.';
      imagen.src = lector.result as string;
    };
    lector.onerror = () => this.fotoError = 'No se pudo cargar la imagen.';
    lector.readAsDataURL(archivo);
  }

  quitarFoto(): void {
    this.foto = undefined;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.mascotaService.agregar({ ...this.form.getRawValue(), foto: this.foto } as any);
    this.router.navigate(['/mascotas']);
  }

  invalido(ruta: string): boolean {
    const c = this.form.get(ruta);
    return !!c && c.invalid && (c.touched || c.dirty);
  }
}