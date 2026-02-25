# Proyecto de Entrenamiento - Sistema de Gestión de Rutinas

## Descripción General

Este proyecto implementa un sistema de gestión de entrenamiento con dos tipos de usuarios: **Entrenadores** y **Alumnos**. El sistema permite a los entrenadores gestionar alumnos y asignar rutinas de ejercicio personalizadas para cada día de la semana.

## Características Implementadas

### 1. Sistema de Autenticación Diferenciada

#### Estructura de Autenticación

- **Módulo Redux completo**: `src/store/auth/`
  - Actions, reducers y sagas para login/logout
  - Persistencia del estado de autenticación en localStorage
  - Verificación automática de sesión al cargar la aplicación

#### Roles de Usuario

- **Trainer (Entrenador)**: Acceso a gestión de alumnos y rutinas
- **Student (Alumno)**: Acceso a ver sus rutinas asignadas

#### Protección de Rutas

- **ProtectedRoute Component**: `src/components/ProtectedRoute/`
  - Redirección automática según el rol del usuario
  - Verificación de autenticación en cada carga de página
  - Componente de carga mientras se verifica la sesión

#### Hook Personalizado

- **useAuth**: `src/hooks/useAuth.ts`
  - Facilita el acceso al estado de autenticación
  - Métodos simplificados para login/logout
  - Callbacks para manejar éxito/error

### 2. Módulo del Entrenador

#### Dashboard Principal

**Ruta**: `/trainer/dashboard`
**Archivo**: `src/screens/Trainer/Dashboard/`

Características:

- Estadísticas generales (total de alumnos, rutinas activas)
- Lista de alumnos recientes
- Acceso rápido a gestión de alumnos y rutinas
- Botón de logout

#### Gestión de Alumnos

**Ruta**: `/trainer/students`
**Archivo**: `src/screens/Trainer/Students/`

Características:

- **Búsqueda en tiempo real**: Filtra por nombre, email u objetivo
- **Vista de tarjetas**: Muestra información clave de cada alumno
  - Nombre y email
  - Objetivo de entrenamiento
  - Edad, peso y altura
  - Número de rutinas asignadas
- Click en alumno para ver detalles completos

#### Sistema de Rutinas

##### Modelo de Datos de Rutina

```typescript
interface Routine {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  dayOfWeek: DayOfWeek; // monday, tuesday, etc.
  trainerId: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
}
```

##### Formulario de Rutina

**Componente**: `src/components/RoutineForm/`

Permite:

- Nombre y descripción de la rutina
- Selección del día de la semana
- Agregar múltiples ejercicios
- Editar ejercicios existentes
- Eliminar ejercicios

### 3. Sistema de Ejercicios Configurables

#### Modelo de Datos de Ejercicio

```typescript
interface Exercise {
  id: string;
  name: string;
  description: string;
  videoUrl?: string; // Link a video de ejemplo
  imageUrl?: string; // Link a imagen de ejemplo
  sets?: number; // Series
  repetitions?: number; // Repeticiones
  weight?: number; // Peso en kg
  duration?: number; // Duración en segundos
  restTime?: number; // Tiempo de descanso en segundos
  notes?: string; // Notas adicionales
}
```

#### Formulario de Ejercicio

**Componente**: `src/components/ExerciseForm/`

Campos configurables:

- **Obligatorios**:

  - Nombre del ejercicio
  - Descripción de cómo realizarlo

- **Opcionales**:
  - URL de video de ejemplo (YouTube, etc.)
  - URL de imagen de ejemplo
  - Series (sets)
  - Repeticiones
  - Peso (kg)
  - Duración (segundos)
  - Tiempo de descanso (segundos)
  - Notas adicionales

### 4. Store Redux - Módulo Trainer

**Ubicación**: `src/store/trainer/`

#### Actions Disponibles

```typescript
// Gestión de alumnos
fetchStudents(); // Obtener lista de alumnos
searchStudents(query); // Buscar alumnos
setSelectedStudent(); // Seleccionar alumno actual

// Gestión de rutinas
createRoutine(payload); // Crear nueva rutina
updateRoutine(payload); // Actualizar rutina existente
deleteRoutine(id); // Eliminar rutina
fetchStudentRoutines(id); // Obtener rutinas de un alumno
setSelectedRoutine(); // Seleccionar rutina actual
```

#### State Structure

```typescript
{
  students: Student[],
  filteredStudents: Student[],
  selectedStudent: Student | null,
  routines: Routine[],
  selectedRoutine: Routine | null,
  isLoading: boolean,
  error: string | null
}
```

### 5. Internacionalización (i18n)

#### Idiomas Soportados

- Inglés (en)
- Español (es)

#### Traducciones Implementadas

Todas las cadenas del módulo trainer están traducidas:

- Dashboard del entrenador
- Gestión de alumnos
- Formularios de rutinas
- Formularios de ejercicios
- Días de la semana
- Mensajes comunes

**Archivos**:

- `src/i18n/messages/en.json`
- `src/i18n/messages/es.json`

## Estructura de Archivos Creados

```
src/
├── utils/types/
│   ├── auth.types.ts           # Tipos de autenticación y roles
│   └── training.types.ts       # Tipos de rutinas y ejercicios
│
├── store/
│   ├── auth/                   # Módulo de autenticación
│   │   ├── action-types.ts
│   │   ├── action.ts
│   │   ├── reducer.ts
│   │   └── saga.ts
│   │
│   └── trainer/                # Módulo del entrenador
│       ├── action-types.ts
│       ├── action.ts
│       ├── reducer.ts
│       └── saga.ts
│
├── hooks/
│   └── useAuth.ts              # Hook para autenticación
│
├── components/
│   ├── ProtectedRoute/         # Protección de rutas
│   │   └── index.tsx
│   ├── RoutineForm/            # Formulario de rutinas
│   │   ├── index.tsx
│   │   └── styles.module.scss
│   └── ExerciseForm/           # Formulario de ejercicios
│       ├── index.tsx
│       └── styles.module.scss
│
├── screens/
│   └── Trainer/
│       ├── Dashboard/          # Dashboard del entrenador
│       │   ├── index.tsx
│       │   └── styles.module.scss
│       ├── Students/           # Listado de alumnos
│       │   ├── index.tsx
│       │   └── styles.module.scss
│       └── CreateRoutine/      # Crear rutina
│           ├── index.tsx
│           └── styles.module.scss
│
└── app/[locale]/
    └── trainer/                # Rutas del entrenador
        ├── layout.tsx          # Layout con protección de ruta
        ├── dashboard/
        │   └── page.tsx
        └── students/
            └── page.tsx
```

## Flujo de Usuario - Entrenador

### 1. Login

- Entrar con credenciales de entrenador
- Mock: `email: trainer@test.com` (cualquier password)
- Redirección automática a `/trainer/dashboard`

### 2. Dashboard

- Ver estadísticas generales
- Ver lista de alumnos recientes
- Navegar a gestión de alumnos o rutinas

### 3. Gestión de Alumnos

- Buscar alumnos por nombre, email u objetivo
- Ver información detallada de cada alumno
- Click en alumno para ver/editar sus rutinas

### 4. Crear/Editar Rutina

- Seleccionar día de la semana
- Agregar nombre y descripción
- Añadir ejercicios uno por uno
- Configurar cada ejercicio con:
  - Descripción detallada
  - Links a videos/imágenes de ejemplo
  - Series, repeticiones, peso
  - Duración y tiempo de descanso
- Guardar rutina asociada al alumno

### 5. Logout

- Cerrar sesión desde el dashboard
- Se limpia el localStorage
- Redirección a página de login

## Datos Mock

### Usuarios de Prueba

```typescript
// Entrenador
email: trainer@test.com
// Se crea con cualquier password

// Alumno
email: student@test.com
// Se crea con cualquier password
```

### Alumnos de Ejemplo

```typescript
[
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    age: 25,
    weight: 75,
    height: 175,
    goal: 'Ganar masa muscular',
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@example.com',
    age: 30,
    weight: 60,
    height: 165,
    goal: 'Perder peso',
  },
  {
    id: '3',
    name: 'Carlos López',
    email: 'carlos@example.com',
    age: 28,
    weight: 80,
    height: 180,
    goal: 'Mejorar resistencia',
  },
];
```

## Próximos Pasos

### Para Conectar con Backend Real

1. **Reemplazar las funciones mock en los sagas**:

   - `src/store/auth/saga.ts` - loginApi, logoutApi
   - `src/store/trainer/saga.ts` - fetchStudentsApi, createRoutineApi, etc.

2. **Configurar axios para llamadas API**:

   ```typescript
   import axios from 'axios';

   const api = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_URL,
   });

   // Agregar interceptor para el token
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('auth_token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

3. **Implementar las llamadas API reales**:
   ```typescript
   const loginApi = async (email: string, password: string) => {
     const response = await api.post('/auth/login', { email, password });
     return response.data;
   };
   ```

### Funcionalidades Adicionales a Implementar

1. **Página de detalle de alumno**:

   - Ver todas las rutinas de la semana
   - Editar rutinas existentes
   - Ver progreso del alumno

2. **Dashboard del alumno**:

   - Ver rutina del día actual
   - Marcar ejercicios como completados
   - Ver historial de entrenamientos

3. **Página de login real**:

   - Formulario de login con validación
   - Recuperación de contraseña
   - Registro de nuevos usuarios

4. **Gestión avanzada de rutinas**:

   - Copiar rutinas entre días
   - Templates de rutinas predefinidas
   - Biblioteca de ejercicios reutilizables

5. **Sistema de progreso**:
   - Gráficos de evolución
   - Registro de pesos/medidas
   - Comparativa de objetivos

## Cómo Probar el Sistema

1. **Instalar dependencias**:

   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo**:

   ```bash
   npm run dev
   ```

3. **Acceder al dashboard del entrenador**:

   - Navegar a `http://localhost:3000/trainer/dashboard`
   - El sistema verificará la autenticación (mock)

4. **Probar la búsqueda de alumnos**:

   - Ir a "Manage Students"
   - Buscar por nombre, email u objetivo
   - Click en un alumno

5. **Crear una rutina de ejemplo**:
   - Navegar a crear rutina para un alumno
   - Llenar nombre y descripción
   - Agregar ejercicios con configuración completa
   - Guardar y verificar

## Notas Técnicas

- El sistema usa **Redux Persist** para mantener la sesión activa
- Las rutas del entrenador están protegidas con el componente `ProtectedRoute`
- Los formularios tienen validación básica en el frontend
- Los estilos usan **Sass modules** para evitar conflictos de CSS
- La internacionalización usa **next-intl** con rutas localizadas
- El estado se gestiona completamente con **Redux + Redux Saga**
