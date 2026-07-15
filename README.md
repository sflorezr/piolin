# Piolin — Control de grupos para guardería

Aplicación web para administrar profesoras, grupos y niños de una guardería, y para
que las profesoras registren el reporte semanal de actividades de cada niño.

## Stack

- **Next.js 16** (App Router, TypeScript) — frontend + backend en un solo proyecto
- **Prisma 7** + **PostgreSQL** (pensado para [Supabase](https://supabase.com))
- **Supabase Storage** — fotos de profesoras y niños
- **NextAuth.js (Auth.js) v5** — login con usuario/contraseña, roles `ADMIN` / `PROFESORA`
- **Nodemailer** — envío del reporte semanal por correo (SMTP propio)
- **Tailwind CSS** + componentes propios estilo shadcn/ui

## Modelo de datos

- `Usuario`: credenciales de acceso (email, password, rol). Cada `Profesora` tiene un `Usuario` con rol `PROFESORA` para iniciar sesión.
- `Profesora`: nombre, documento, teléfono, foto, estado, usuario de acceso
- `Grupo`: descripción, profesora principal (obligatoria), profesora auxiliar (opcional), niños, estado
- `Nino`: nombre, fecha de nacimiento, datos de papá/mamá (incluye correo), foto, grupo, hora de entrega (informativo), estado
- `Actividad`: catálogo de actividades semanales que crea el admin (solo nombre + estado)
- `ReporteSemanal`: reporte por niño con fecha de inicio/fin de la semana, creado por la profesora
- `ObservacionActividad`: una observación de texto de la profesora por cada actividad incluida en el reporte semanal

Ver `prisma/schema.prisma` para el detalle completo.

## Configuración local

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar `.env.example` a `.env` y completar las variables:

   | Variable | Descripción |
   |---|---|
   | `DATABASE_URL` | Cadena de conexión de Postgres (Supabase → Settings → Database) |
   | `NEXTAUTH_SECRET` | Valor aleatorio largo (`openssl rand -base64 32`) |
   | `NEXTAUTH_URL` | URL base de la app (`http://localhost:3000` en local) |
   | `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Credenciales de Supabase (Settings → API) |
   | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Credenciales SMTP para enviar el reporte semanal |

3. Aplicar el esquema a la base de datos:

   ```bash
   npm run db:migrate
   ```

   > Si ya tenías la base de datos creada de una versión anterior (con `Pregunta`/`ReporteEntrega`),
   > este comando va a generar una migración que elimina esas tablas y crea `Actividad`,
   > `ReporteSemanal` y `ObservacionActividad` en su lugar — se pierden los datos de esas tablas.

4. Crear el usuario administrador inicial (usa `ADMIN_EMAIL`/`ADMIN_PASSWORD` si quieres personalizarlo, si no usa `admin@piolin.local` / `admin123`):

   ```bash
   npm run db:seed
   ```

5. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abrir [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` / `npm run start` — build y servidor de producción
- `npm run lint` — ESLint
- `npm run db:migrate` — crear/aplicar migraciones de Prisma
- `npm run db:seed` — crear el usuario administrador inicial
- `npm run db:studio` — abrir Prisma Studio para inspeccionar los datos

## Estado actual

- Admin: CRUD completo de profesoras (con creación de usuario/contraseña de acceso), grupos, niños
  y catálogo de actividades.
- Profesora: ve sus grupos asignados, los niños de cada grupo, y puede crear un reporte semanal por
  niño (fecha de inicio/fin + actividades con observación), visualizarlo y enviarlo por correo a
  papá/mamá.

Pendiente: pantalla para que la profesora cambie su propia contraseña, y mejoras de UX en errores de
formulario (hoy los errores de validación no tienen una pantalla amigable).
