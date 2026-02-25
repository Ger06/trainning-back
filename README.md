# Training App - Monorepo 🏋️‍♂️

Este repositorio contiene la solución completa de la aplicación de gestión de entrenamientos, dividida en un frontend moderno y un backend robusto.

## 📂 Estructura del Proyecto

El proyecto está organizado como un monorepo con las siguientes carpetas principales:

- **[entrenamiento front](./entrenamiento%20front/)**: Aplicación web construida con **Next.js 14**, Redux Toolkit y i18next.
- **[nestjs-boilerplate](./nestjs-boilerplate/)**: API REST construida con **NestJS 10**, Prisma ORM y PostgreSQL.

---

## 🚀 Inicio Rápido

### 💻 Backend (nestjs-boilerplate)

El backend maneja la lógica de negocio, autenticación JWT y persistencia de datos.

1. Navega a la carpeta: `cd nestjs-boilerplate`
2. Instala dependencias: `npm install`
3. Configura tu `.env` (puedes usar `.env.example` como base).
4. Genera el cliente de Prisma: `npx prisma generate`
5. Ejecuta las migraciones: `npx prisma migrate dev`
6. Inicia en desarrollo: `npm run dev`

> [!TIP]
> La documentación de la API (Swagger) estará disponible en `http://localhost:3000/docs` una vez que el servidor esté corriendo.

### 🌐 Frontend (entrenamiento front)

El frontend proporciona la interfaz de usuario para entrenadores y alumnos.

1. Navega a la carpeta: `cd "entrenamiento front"`
2. Instala dependencias: `npm install`
3. Inicia el servidor de desarrollo: `npm run dev`
4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🛠️ Tecnologías Principales

| Componente | Tecnologías |
| :--- | :--- |
| **Frontend** | Next.js 14, Redux (Toolkit + Saga), i18next, Sass |
| **Backend** | NestJS, Prisma ORM, PostgreSQL, JWT, Swagger |
| **Calidad** | ESLint, Prettier, Husky, Commitlint |

---

## 📝 Notas de Desarrollo

- **Consolidación**: Este proyecto fue consolidado en un monorepo para facilitar la gestión sincronizada de cambios en el frontend y backend.
- **Git**: Los commits realizados en la raíz afectan a todo el proyecto. Se recomienda usar mensajes claros para distinguir cambios en cada módulo.

---
Desarrollado con ❤️ por Gerardo.
