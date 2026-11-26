import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly clave = 'vet_sesion';

  // Credenciales de demostración (no usar en producción)
  private readonly USUARIO = 'admin';
  private readonly PASSWORD = '1234';

  login(usuario: string, password: string): boolean {
    const ok = usuario === this.USUARIO && password === this.PASSWORD;
    if (ok) sessionStorage.setItem(this.clave, usuario);
    return ok;
  }

  logout(): void {
    sessionStorage.removeItem(this.clave);
  }

  estaLogueado(): boolean {
    return sessionStorage.getItem(this.clave) !== null;
  }
}
