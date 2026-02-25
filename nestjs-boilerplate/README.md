# Training App Backend API

API backend para una aplicación de gestión de entrenamiento personal construida con NestJS, Prisma y PostgreSQL.

## 🚀 Características

- **Autenticación JWT** con refresh tokens
- **Sistema de roles** (Trainer/Student)
- **Biblioteca de ejercicios** (Exercise Templates)
- **Plantillas de rutinas** reutilizables (Routine Templates)
- **Asignación de rutinas** a estudiantes
- **Gestión de alumnos** por parte del entrenador
- **Documentación Swagger** automática
- **Validación de datos** con class-validator
- **Base de datos PostgreSQL** con Prisma ORM

## 📋 Requisitos Previos

- Node.js >= 20.x
- npm >= 10.x
- PostgreSQL (o Prisma Postgres en desarrollo)

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones (primera vez)
npx prisma migrate dev --name init
```

## ⚙️ Configuración

Configura las variables de entorno en `.env`:

```env
# Database
DATABASE_URL="tu-url-de-base-de-datos"

# Node Environment
NODE_ENV=development
NODE_PORT=3000

# JWT Configuration
JWT_SECRET=tu-super-secreto-jwt-key-cambia-esto-en-produccion
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=tu-super-secreto-refresh-jwt-key-cambia-esto-en-produccion
JWT_REFRESH_EXPIRES_IN=7d
```

## 🏃 Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start

# Tests
npm run test
```

## 📚 Documentación API

Una vez iniciado el servidor, la documentación Swagger estará disponible en:

```
http://localhost:3000/docs
```

## 🗂️ Estructura del Proyecto

```
src/
├── app/
│   ├── auth/                      # Módulo de autenticación
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── strategies/
│   │   ├── guards/
│   │   ├── decorators/
│   │   └── dto/
│   ├── exercise-templates/        # Biblioteca de ejercicios
│   ├── routine-templates/         # Plantillas de rutinas
│   ├── routines/                  # Rutinas asignadas
│   ├── students/                  # Gestión de alumnos
│   └── common/                    # Health check
├── core/                          # Configuración global
├── shared/                        # Recursos compartidos
│   └── database/                  # Prisma Service
├── i18n/                         # Internacionalización
└── main.ts                       # Punto de entrada
```

## 🎯 Endpoints Principales

### Autenticación
- `POST /auth/register` - Registrar usuario (Trainer/Student)
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh` - Renovar token
- `POST /auth/logout` - Cerrar sesión
- `GET /auth/me` - Obtener perfil actual

### Exercise Templates (Solo Trainers)
- `GET /exercise-templates` - Listar ejercicios
- `POST /exercise-templates` - Crear ejercicio
- `GET /exercise-templates/:id` - Obtener ejercicio
- `PATCH /exercise-templates/:id` - Actualizar ejercicio
- `DELETE /exercise-templates/:id` - Eliminar ejercicio
- `GET /exercise-templates/categories` - Listar categorías
- `GET /exercise-templates/muscle-groups` - Listar grupos musculares

### Routine Templates (Solo Trainers)
- `GET /routine-templates` - Listar plantillas
- `POST /routine-templates` - Crear plantilla
- `GET /routine-templates/:id` - Obtener plantilla
- `PATCH /routine-templates/:id` - Actualizar plantilla
- `DELETE /routine-templates/:id` - Eliminar plantilla
- `GET /routine-templates/categories` - Listar categorías

### Students (Solo Trainers)
- `GET /students` - Listar alumnos
- `POST /students` - Crear alumno
- `GET /students/:id` - Obtener alumno
- `PATCH /students/:id` - Actualizar alumno
- `DELETE /students/:id` - Eliminar alumno

### Routines (Solo Trainers)
- `GET /routines` - Listar rutinas
- `POST /routines` - Crear rutina desde cero
- `POST /routines/assign-template` - Asignar plantilla a alumno
- `GET /routines/:id` - Obtener rutina
- `PATCH /routines/:id` - Actualizar rutina
- `DELETE /routines/:id` - Eliminar rutina

## 🔐 Autenticación

La API utiliza JWT Bearer tokens. Incluye el token en el header de las peticiones:

```
Authorization: Bearer <tu-access-token>
```

Los tokens de acceso expiran en 15 minutos. Usa el endpoint `/auth/refresh` con tu refresh token para obtener un nuevo access token.

## 📊 Modelo de Base de Datos

### Enums
- `UserRole`: TRAINER, STUDENT
- `DayOfWeek`: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
- `Difficulty`: BEGINNER, INTERMEDIATE, ADVANCED

### Modelos Principales

#### User
Usuario base del sistema con autenticación.

#### Trainer
Perfil extendido para entrenadores.

#### Student
Perfil extendido para alumnos, vinculado a un entrenador.

#### ExerciseTemplate
Ejercicio reutilizable en la biblioteca del entrenador.

#### RoutineTemplate
Plantilla de rutina con ejercicios pre-configurados.

#### Routine
Rutina asignada a un estudiante específico para un día de la semana.

#### Exercise
Instancia de ejercicio específica de una rutina.

#### RoutineExercise / RoutineTemplateExercise
Tablas pivot que relacionan rutinas/plantillas con ejercicios y contienen parámetros (sets, reps, weight, etc.).

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🚢 Despliegue

```bash
# Build
npm run build

# Ejecutar migraciones en producción
npx prisma migrate deploy

# Iniciar servidor
npm start
```

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Compila el proyecto
- `npm start` - Inicia el servidor en modo producción
- `npm run lint` - Ejecuta el linter
- `npm run format` - Formatea el código

## 🔧 Stack Tecnológico

- **Framework**: NestJS 10
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT (Passport + bcrypt)
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest
- **Linting**: ESLint + Prettier

---

Desarrollado con ❤️ usando NestJS
