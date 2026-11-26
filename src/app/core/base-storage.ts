/**
 * Clase base abstracta (POO + genéricos) para guardar listas en localStorage.
 * Las clases hijas solo indican la clave y cómo reconstruir cada objeto.
 */
export abstract class BaseStorage<T extends { id: number }> {
  constructor(private readonly clave: string) {}

  protected abstract hidratar(raw: any): T;

  listar(): T[] {
    try {
      const raw = localStorage.getItem(this.clave);
      return raw ? (JSON.parse(raw) as any[]).map((r) => this.hidratar(r)) : [];
    } catch {
      return [];
    }
  }

  obtener(id: number): T | undefined {
    return this.listar().find((item) => item.id === id);
  }

  agregar(datos: Partial<T>): T {
    const nuevo = this.hidratar({ ...datos, id: Date.now() });
    this.guardar([...this.listar(), nuevo]);
    return nuevo;
  }

  actualizar(item: T): void {
    this.guardar(this.listar().map((i) => (i.id === item.id ? item : i)));
  }

  eliminar(id: number): void {
    this.guardar(this.listar().filter((i) => i.id !== id));
  }

  protected guardar(items: T[]): void {
    localStorage.setItem(this.clave, JSON.stringify(items));
  }
}
