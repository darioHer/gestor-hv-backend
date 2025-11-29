# 🧾 Gestor de Hojas de Vida — Instituto Tecnológico del Putumayo

## 📘 Descripción General

El **Gestor de Hojas de Vida** es una plataforma desarrollada para optimizar el proceso de **postulación, evaluación y vinculación de docentes ocasionales** en el Instituto Tecnológico del Putumayo.

Este sistema centraliza la gestión de convocatorias, permite a los aspirantes registrar y actualizar sus hojas de vida, y facilita al comité académico la revisión, evaluación y selección de candidatos, garantizando **transparencia, trazabilidad y eficiencia** en el proceso.

La aplicación está conformada por un **backend** desarrollado en **NestJS**, con conexión a una base de datos **MySQL**, y un **frontend** en **Vue 3 + Pinia + TailwindCSS**.

---

## 👥 Integrantes del Proyecto

| Nombre | 
|:-------|
| **Harold Meses** | 
| **Tatiana Díaz** | 
| **Hernán Flórez** |

---

## 🧠 Objetivo del Proyecto

Desarrollar un sistema institucional que:
- Digitalice el proceso de **convocatorias docentes**.
- Permita la **postulación en línea** mediante la carga de hojas de vida y documentos requeridos.
- Automatice la **evaluación y calificación de aspirantes**.
- Genere **informes y listados** de elegibles conforme a los criterios definidos por la institución.

---

## ⚙️ Tecnologías Utilizadas

### Backend
- **NestJS** (Framework principal)
- **TypeORM** (ORM)
- **MySQL** (Base de datos relacional)
- **JWT (JSON Web Tokens)** para autenticación y control de roles
- **Multer** para carga y gestión de documentos PDF

### Frontend
- **Vue 3 + Vite**
- **Pinia (State Management)**
- **TailwindCSS (Diseño responsivo)**
- **Axios** (consumo de API REST)

---

## 🔐 Roles de Usuario

| Rol | Descripción |
|-----|--------------|
| **ADMIN** | Gestiona usuarios, docentes y convocatorias. |
| **DOCENTE** | Registra su hoja de vida y se postula a convocatorias. |
| **COMITÉ** | Evalúa postulaciones y emite resultados. |

---

## 🧩 Módulos Principales del Backend

1. **Auth** → Registro, login y control de acceso mediante JWT.  
2. **Usuarios** → Gestión de usuarios y roles del sistema.  
3. **Docentes** → Información académica y profesional del docente.  
4. **Convocatorias** → Creación y publicación de convocatorias docentes.  
5. **Postulaciones** → Registro y carga de documentos del aspirante.  
6. **Evaluaciones** → Calificación y consolidación de resultados.  
7. **Notificaciones** → Comunicación automática con los aspirantes.

---

## 🚀 Instalación y Ejecución del Backend

```bash
# Clonar el repositorio
git clone https://github.com/darioHer/gestor-hv-backend.git
cd gestor-hv-backend

# Instalar dependencias
npm install

# Configurar variables de entorno (.env)
cp .env.example .env

# Ejecutar servidor de desarrollo
npm run start:dev
