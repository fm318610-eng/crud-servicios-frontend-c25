# Instrucciones del proyecto

CRUD de servicios de programación: SPA didáctica de Rolling Code School.
React 19 + TypeScript + Vite + Tailwind v4. El backend es una API externa
(Node/Express + MongoDB) y este repo es solo el frontend.

## Comandos

Usar **pnpm** (hay `pnpm-lock.yaml`). No crear `package-lock.json` ni `yarn.lock`.

- `pnpm install` — instalar dependencias
- `pnpm dev` — servidor de desarrollo (Vite)
- `pnpm lint` — ESLint (flat config)
- `pnpm build` — `tsc -b && vite build` (verificación de tipos + build)
- `pnpm preview` — servir el build

No hay tests ni script de test. La verificación mínima antes de dar por
terminado un cambio es `pnpm lint` y `pnpm build`.

## Configuración local

Crear `.env` en la raíz (está en `.gitignore`, no commitear):

```
VITE_SERVICIOS=<url-base-del-backend>
VITE_EMAIL=<email-del-admin>
VITE_PASSWORD=<password-del-admin>
```

`VITE_SERVICIOS` es obligatoria: `src/helpers/queries.ts` le concatena `/servicios`.
El README no la menciona, pero sin ella la app no carga datos.

## Estructura

- `src/App.tsx` — router, layout y `AppContext.Provider` (estado de sesión)
- `src/components/pages/` — páginas asociadas a rutas
- `src/components/services/` — componentes presentacionales de servicios
  (`CardServicio`, `ItemTabla`). Ojo: la carpeta NO es la capa de API.
- `src/components/shared/` — `Menu` y `Footer`
- `src/components/routes/` — `ProtectorRutas`
- `src/context/AppContext.tsx` — contexto + hook `useAppContext`
- `src/helpers/queries.ts` — capa HTTP (`fetch` al backend)
- `src/interfaces/servicios.ts` — tipos `Servicio` y `ServicioFormData`
- `src/utils/formateador.ts` — `formatearPrecio` (ARS)

## Rutas

| Ruta | Componente |
| --- | --- |
| `/` | `Inicio` (catálogo) |
| `/login` | `Login` |
| `/detalle-servicio/:id` | `DetalleServicio` |
| `/administrador` | `Administrador` (protegida) |
| `/administrador/crear` | `FormularioServicio` (crear) |
| `/administrador/editar/:id` | `FormularioServicio` (editar) |
| `*` | `Error404` |

Se importa desde `react-router` (v8). **No** usar `react-router-dom`.

## Datos y API

Interface en `src/interfaces/servicios.ts`:

```ts
{ _id: string; nombreServicio: string; precio: number;
  imagen: string; categoria: string; descripcion: string }
```

- Los endpoints son `GET/POST /servicios` y `GET/PUT/DELETE /servicios/:id`.
- Las funciones de `queries.ts` devuelven la `Response` cruda (o `undefined` si
  falla el `fetch`). El componente comprueba `respuesta?.status` y luego hace
  `await respuesta.json()`.
- Los ids son de MongoDB: siempre `_id`.
- Precios con `formatearPrecio` (`Intl.NumberFormat("es-AR", ARS)`).

## Convenciones

- **Español** en UI, nombres de archivos, funciones y variables
  (`nombreServicio`, `usuarioLogueado`, `consultarAPI`, `navegacion`).
  No traducir identificadores existentes.
- Componentes con `const Nombre = () => {}` y `export default`.
- Imports relativos (no hay alias configurados).
- `import type` obligatorio para tipos (`verbatimModuleSyntax` está activo).
- Sin `enum`, `namespace` ni parameter properties (`erasableSyntaxOnly`).
- `noUnusedLocals` y `noUnusedParameters` activos: no dejar variables sin usar.
- Validación de formularios con `react-hook-form` y mensajes en español.
  No agregar librerías de validación sin consultar.
- Notificaciones con SweetAlert2, tema oscuro:
  `background: "#18181b"`, `color: "#f4f4f5"`, `confirmButtonColor: "#3b82f6"`.
- Iconos con `react-icons/lu`.
- No hay Prettier configurado: mantené el estilo del archivo que editás.

## UI / Tailwind

- Tailwind v4 vía `@tailwindcss/vite`; el único CSS global es
  `@import "tailwindcss";` en `src/index.css`.
- Paleta oscura: `zinc-950` (fondo), `zinc-900` (superficies), `zinc-100`
  (texto), azul (`blue-500/600`) como acento.
- Layout con `min-h-screen flex flex-col` + `<main className="grow">`.
- Mantené el diseño responsive (`sm:`, `md:`, `lg:`) y el foco visible.
- No introducir un sistema de diseño ni CSS modules.

## Autenticación

- Didáctica: email/password se comparan contra `VITE_EMAIL` / `VITE_PASSWORD`.
- El estado vive en `AppContext` como `usuarioLogueado: boolean` y se persiste
  en `sessionStorage` con la clave `usuarioKey`.
- `ProtectorRutas` redirige a `/login` si no hay sesión.
- **Todo `VITE_*` termina en el bundle del cliente.** No es seguridad real; no
  presentarlo como tal ni mover credenciales reales al repo.

## Problemas conocidos (no "arreglar" sin pedirlo)

- `ServicioFormData = Omit<Servicio, "id">` debería ser `Omit<Servicio, "_id">`.
- `animate-fadeIn` se usa en varias páginas pero no está definida en el CSS.
- Hay `<i className="bi bi-*">` (Bootstrap Icons) sin la librería instalada.
- `DetalleServicio` navega a `/404`, ruta inexistente (cae en `*`).
- Hay bloques comentados de la versión con `localStorage`: son material del
  curso, no borrarlos sin consultar.

## Reglas para agentes

- No agregar dependencias ni cambiar el gestor de paquetes sin pedirlo.
- No commitear `.env` ni imprimir sus valores.
- No reescribir el proyecto ni migrar el stack: los cambios deben ser acotados
  y coherentes con el estilo existente.
- No borrar código comentado, assets ni rutas sin confirmación.
- Si un cambio afecta tipos, correr `pnpm build`; si afecta código, `pnpm lint`.
