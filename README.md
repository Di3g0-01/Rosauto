# Sistema de Registro Vehicular

Sistema web para la gestión y registro de vehículos, propietarios, tarjetas de circulación, calcomanías y trámites asociados.

---

## Tecnologías utilizadas

### Backend
- Node.js
- NestJS 11
- TypeScript 5
- Prisma ORM 5 (con `prisma-client-js`)
- PostgreSQL 18
- pg (cliente nativo de PostgreSQL)
- dotenv

### Frontend
- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- Axios
- Lucide React
- Sonner (notificaciones)
- next-themes
- Base UI / Radix UI

---

## Instrucciones de instalación

### Requisitos previos
- Node.js 20 o superior
- PostgreSQL 16 o superior en ejecución
- npm

### 1. Base de datos

Crear la base de datos y el usuario en PostgreSQL:

```sql
CREATE USER diego WITH PASSWORD 'diego1';
CREATE DATABASE sistema_vehiculos OWNER diego;
```

Luego ejecutar el schema para crear las tablas:

```bash
psql -U diego -d sistema_vehiculos -f Database/Schema.sql
```

Luego cargar los datos iniciales:

```bash
psql -U diego -d sistema_vehiculos -f Database/Inserts.sql
```

### 2. Backend

```bash
cd backend
npm install
```

Crear el archivo `.env` en la carpeta `backend/` con el siguiente contenido (ajustando puerto si es necesario):

```env
DATABASE_URL="postgresql://diego:diego1@127.0.0.1:5432/sistema_vehiculos?schema=public"
```

Aplicar el schema de Prisma y generar el cliente:

```bash
npx prisma db push
npx prisma generate
```

Opcionalmente, poblar la base de datos con datos de prueba:

```bash
npx prisma db seed
```

### 3. Frontend

```bash
cd frontend
npm install
```

---

## Como ejecutar el proyecto

### Backend

```bash
cd backend
npm run start:dev
```

El servidor quedará disponible en: `http://localhost:3002`

### Frontend

```bash
cd frontend
npm run dev
```

La interfaz quedará disponible en: `http://localhost:3000`

---

## Credenciales necesarias

### Base de datos (PostgreSQL)

| Campo    | Valor              |
|----------|--------------------|
| Host     | 127.0.0.1          |
| Puerto   | 5432 (predeterminado) |
| Base de datos | sistema_vehiculos |
| Usuario  | diego              |
| Contrasena | diego1           |

### Usuario administrador de la aplicacion

| Campo      | Valor    |
|------------|----------|
| Usuario    | admin    |
| Contrasena | admin123 |

---

## Puertos utilizados

| Servicio  | Puerto |
|-----------|--------|
| Backend   | 3002   |
| Frontend  | 3000   |

---

## Nombre de la base de datos

```
sistema_vehiculos
```

---

## Estructura del repositorio

```
/
├── Database/
│   ├── Schema.sql       # Definicion de tablas, secuencias y restricciones
│   └── Inserts.sql      # Datos iniciales y de prueba
├── backend/             # API REST con NestJS y Prisma
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── auth/
│       ├── calcomanias/
│       ├── propietarios/
│       ├── tarjetas-circulacion/
│       ├── tramites/
│       └── vehiculos/
├── frontend/            # Aplicacion web con Next.js
│   └── src/
│       ├── app/
│       │   ├── (dashboard)/
│       │   └── login/
│       ├── components/
│       └── lib/
└── README.md
```
