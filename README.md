# Piolin — Control de grupos para guardería

Aplicación web para administrar profesoras, grupos y niños de una guardería, y para
que las profesoras registren el reporte de entrega diario de cada niño.

## Stack

- **Next.js 16** (App Router, TypeScript) — frontend + backend en un solo proyecto
- **Prisma 7** + **PostgreSQL** (pensado para [Supabase](https://supabase.com))
- **Supabase Storage** — fotos de profesoras y niños
- **NextAuth.js (Auth.js) v5** — login con usuario/contraseña, roles `ADMIN` / `PROFESORA`
- **Nodemailer** — envío del reporte de entrega por correo (SMTP propio)
- **Tailwind CSS** + componentes propios estilo shadcn/ui

## Modelo de datos

- `Usuario`: credenciales de acceso (email, password, rol)
- `Profesora`: nombre, documento, teléfono, foto, estado
- `Grupo`: descripción, profesora principal (obligatoria), profesora auxiliar (opcional), niños, estado
- `Nino`: nombre, fecha de nacimiento, datos de papá/mamá, foto, grupo, hora de entrega, estado
- `Pregunta`: texto + tipo (opción múltiple u abierta) — set global para el reporte de entrega
- `ReporteEntrega` / `RespuestaReporte`: respuestas capturadas al momento de entregar un niño

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
   | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Credenciales SMTP para enviar el reporte de entrega |

3. Aplicar el esquema a la base de datos:

   ```bash
   npm run db:migrate
   ```

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

Este commit deja el andamiaje base: proyecto Next.js, esquema de Prisma completo,
autenticación por roles (admin/profesora) con NextAuth, estructura de rutas
(`/admin/*`, `/mis-grupos`) y clientes de Supabase Storage / SMTP listos para usar.
Los CRUD de profesoras, grupos, niños, preguntas y el flujo de reporte de entrega
son el siguiente paso de implementación.
