# Instrucciones para Probar el Sistema

## Paso 1: Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

## Paso 2: Acceder a la Página de Login

Navegar a: `http://localhost:3000/login`

## Paso 3: Probar Login como Entrenador

### Opción A: Click en "Login as Trainer"

1. Click en el botón "Login as Trainer" (rellena automáticamente)
2. Click en "Sign In"
3. Serás redirigido a `/trainer/dashboard`

### Opción B: Manual

1. Email: `trainer@test.com`
2. Password: `password` (o cualquier texto)
3. Click en "Sign In"

## Paso 4: Explorar el Dashboard del Entrenador

Una vez logueado como entrenador, verás:

- **Dashboard**: `/trainer/dashboard`
  - Estadísticas de alumnos y rutinas
  - Lista de alumnos recientes
  - Botón de logout

## Paso 5: Probar Gestión de Alumnos

1. Click en "Manage Students"
2. Navega a `/trainer/students`
3. Verás 3 alumnos de prueba:
   - Juan Pérez
   - María García
   - Carlos López

### Probar Búsqueda:

- Escribe "juan" → Filtra a Juan Pérez
- Escribe "perder peso" → Filtra a María García
- Escribe "80" → Filtra a Carlos López

## Paso 6: Verificar Rutas Protegidas

### Probar Sin Autenticación:

1. Click en "Logout"
2. Intenta acceder directamente a: `http://localhost:3000/trainer/dashboard`
3. Deberías ser redirigido automáticamente a `/login`

### Probar con Rol Incorrecto (Futuro):

Cuando implementes el módulo de estudiante:

1. Login como student: `student@test.com`
2. Intenta acceder a `/trainer/dashboard`
3. Deberías ser redirigido a `/student/dashboard`

## URLs Disponibles

### Públicas

- `/` - Página principal (boilerplate)
- `/login` - Página de login

### Protegidas - Solo Entrenador

- `/trainer/dashboard` - Dashboard del entrenador
- `/trainer/students` - Lista de alumnos con búsqueda

## Credenciales de Prueba

```
Entrenador:
Email: trainer@test.com
Password: cualquier cosa (es mock)

Estudiante:
Email: student@test.com
Password: cualquier cosa (es mock)
```

## Datos Mock de Alumnos

```javascript
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

## Flujo Completo de Prueba

1. ✅ Acceder a `/login`
2. ✅ Ver formulario de login con diseño moderno
3. ✅ Click en "Login as Trainer"
4. ✅ Campos se rellenan automáticamente
5. ✅ Click en "Sign In"
6. ✅ Ver animación de "Signing in..."
7. ✅ Redirección a `/trainer/dashboard`
8. ✅ Ver estadísticas: "3" alumnos
9. ✅ Ver lista de 3 alumnos recientes
10. ✅ Click en "Manage Students"
11. ✅ Ver página de alumnos con buscador
12. ✅ Buscar "juan"
13. ✅ Ver solo Juan Pérez filtrado
14. ✅ Limpiar búsqueda
15. ✅ Ver todos los alumnos nuevamente
16. ✅ Volver al dashboard
17. ✅ Click en "Logout"
18. ✅ Redirección a `/login`
19. ✅ Intentar acceder a `/trainer/dashboard`
20. ✅ Ser redirigido automáticamente a `/login`

## Verificar Persistencia

1. Login como entrenador
2. Refrescar la página (F5)
3. Deberías seguir logueado
4. La sesión se guarda en localStorage

## Cambiar Idioma

El sistema soporta inglés y español:

- Inglés: `http://localhost:3000/en/login`
- Español: `http://localhost:3000/es/login` (o sin prefijo)

## Troubleshooting

### Error "Página no encontrada"

- Verifica que el servidor esté corriendo
- Verifica la URL completa incluye `/login`
- Limpia caché: Ctrl + Shift + R

### No redirige después de login

1. Abre DevTools (F12)
2. Ve a Console
3. Busca errores en Redux/Saga
4. Verifica que localStorage tenga 'auth_token' y 'user'

### Búsqueda no funciona

- Los alumnos se cargan al entrar a `/trainer/students`
- Verifica en Redux DevTools que el estado `trainer.students` tenga los 3 alumnos

## Redux DevTools

Si tienes Redux DevTools instalado:

1. Abre DevTools
2. Ve a Redux tab
3. Puedes ver el estado completo:
   - `auth.user` - Usuario actual
   - `auth.isAuthenticated` - Estado de autenticación
   - `trainer.students` - Lista de alumnos
   - `trainer.filteredStudents` - Alumnos filtrados por búsqueda

## Próximos Tests a Implementar

Una vez que el login funcione:

1. Crear página de detalle de alumno
2. Implementar formulario de crear rutina
3. Probar asignación de rutinas
4. Crear dashboard de estudiante
5. Probar cambio de roles
