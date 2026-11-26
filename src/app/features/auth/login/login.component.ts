import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  error = '';

  form = this.fb.group({
    usuario: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor(private auth: AuthService, private router: Router) {}

  ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { usuario, password } = this.form.getRawValue();
    if (this.auth.login(usuario!.trim(), password!.trim())) {
      this.router.navigate(['/mascotas']);
    } else {
      this.error = 'Usuario o contraseña incorrectos.';
    }
  }

  invalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && (c.touched || c.dirty);
  }
}