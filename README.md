# Vet Clinic – Aplicación web en Angular

Aplicación para digitalizar la atención de una clínica veterinaria: registro de mascotas y dueños,
agenda de citas con horarios disponibles e historial de atención por mascota.

## Tecnologías
- Angular 17+ (módulos por funcionalidad, lazy loading, Reactive Forms)
- TypeScript (interfaces, clases, genéricos, POO)
- Bootstrap 5 (diseño responsive)
- Persistencia en `localStorage` (sin backend)

## Requisitos
- Node.js 18 o superior
- Angular CLI: `npm install -g @angular/cli`

## Instalación
```bash
git clone <URL-DEL-REPOSITORIO>
cd vet-clinic
npm install
```

## Ejecución
```bash
ng serve
```
Abrir http://localhost:4200. Credenciales de demostración: **admin / 1234**.

## Pruebas
```bash
ng test
```

## Estructura
```
src/app/
├── core/       servicios (BaseStorage, MascotaService, CitaService, AuthService) y authGuard
├── models/     Dueno, Mascota (clase), Cita
├── shared/     SharedModule, pipes (estadoCita, fechaEs), directiva appResaltarProxima
└── features/
    ├── auth/       login
    ├── mascotas/   lista, registro (Reactive Forms), historial
    └── citas/      agenda con disponibilidad por día
```

## Elementos destacados
- **Pipes personalizados:** `estadoCita`, `fechaEs`.
- **Directiva personalizada:** `appResaltarProxima` resalta citas pendientes de hoy o mañana.
- **Reactive Forms:** validaciones (required, email, pattern, validadores personalizados).
- **POO:** `BaseStorage<T>` abstracta y genérica; servicios que la extienden.

## Integrantes
- Yujra Mamani, Daner Jose
- Amasifuen Rivera, Lucas Salomon
- Cordova Olivares, William Joel
- Huamani Cáceres, Christian Fernando