# 🏢 Austral CRM ERP Seguros - Backend NestJS

Sistema completo de gestión CRM/ERP para empresa de seguros desarrollado con microservicios en NestJS.

## 📋 Descripción del Proyecto

**Austral CRM ERP Seguros** es una plataforma completa que abarca todo el ciclo de vida de la gestión de seguros:

- 🎯 **Gestión de Leads**: Captación y seguimiento de prospectos
- 👥 **Gestión de Clientes**: Administración completa de clientes y beneficiarios  
- 📄 **Gestión de Pólizas**: Emisión, renovación y administración de pólizas
- ⚡ **Gestión de Siniestros**: Reporte y procesamiento de siniestros
- 💰 **Gestión de Comisiones**: Cálculo y pago de comisiones a agentes
- 📊 **Sistema de Actividades**: Seguimiento de actividades de ventas
- ✅ **Sistema de Tareas**: Asignación y gestión de tareas
- 🔔 **Sistema de Notificaciones**: Alertas y recordatorios automatizados

## 🏗️ Arquitectura de Microservicios

El proyecto está construido con una arquitectura de **monorepo de microservicios**:

### **Servicios Principales:**

1. **`api-gateway`** (Puerto 3000) - Gateway principal de APIs
2. **`auth-service`** (Puerto 3001) - Autenticación y autorización
3. **`leads-service`** (Puerto 3002) - Gestión de leads y prospectos
4. **`clients-service`** (Puerto 3003) - Gestión de clientes
5. **`products-service`** (Puerto 3004) - Catálogo de productos de seguros
6. **`activities-service`** (Puerto 3005) - Actividades de ventas
7. **`tasks-service`** (Puerto 3006) - Sistema de tareas
8. **`notifications-service`** (Puerto 3007) - Sistema de notificaciones
9. **`austral-crm-erp-seguros`** - Aplicación principal/coordinadora

### **Librería Compartida:**
- **`libs/common`** - Entidades, DTOs, configuraciones y utilidades compartidas

## 🛠️ Stack Tecnológico

### **Backend Framework:**
- **NestJS 11.0.1** - Framework Node.js modular y escalable
- **TypeScript 5.7.3** - Lenguaje tipado
- **Node.js** con CommonJS

### **Base de Datos:**
- **PostgreSQL** - Base de datos principal
- **TypeORM 0.3.27** - ORM para manejo de datos
- **@nestjs/typeorm** - Integración NestJS-TypeORM

### **Autenticación y Seguridad:**
- **JWT** - Tokens de autenticación
- **Passport.js** - Estrategias de autenticación
- **bcrypt** - Hash de contraseñas
- **Roles y Permisos** - Sistema granular de autorización

### **Comunicación entre Servicios:**
- **@nestjs/microservices** - Comunicación entre microservicios
- **@nestjs/event-emitter** - Manejo de eventos

### **Colas y Jobs:**
- **Bull Queue** - Sistema de colas para tareas asíncronas
- **Redis** - Storage para colas

### **Validación y Transformación:**
- **class-validator** - Validación de DTOs
- **class-transformer** - Transformación de objetos

### **Herramientas de Desarrollo:**
- **ESLint** - Linting de código
- **Prettier** - Formateo automático
- **Jest** - Framework de testing
- **SWC** - Compilador rápido de TypeScript

## 🚀 Instalación y Configuración

### **Prerrequisitos:**
- Node.js >= 18.x
- PostgreSQL >= 14.x
- Redis >= 6.x (para colas)
- pnpm (recomendado)

### **1. Clonar el repositorio:**
```bash
git clone https://github.com/Hannalab-pe/Austral-BackendNestJS.git
cd Austral-BackendNestJS
```

### **2. Instalar dependencias:**
```bash
pnpm install
```

### **3. Configurar variables de entorno:**
```bash
cp .env.example .env
```

### **4. Configurar la base de datos:**
```bash
# Crear la base de datos
createdb austral_seguros

# Ejecutar el script SQL para crear las tablas
psql -d austral_seguros -f bd.sql
```

### **5. Ejecutar los servicios:**

#### **Modo Desarrollo:**
```bash
# API Gateway
pnpm start:dev api-gateway

# Auth Service
pnpm start:dev auth-service

# Leads Service
pnpm start:dev leads-service
```

## 📡 Endpoints de API

### **Auth Service (Puerto 3001):**
```
POST /auth/login              # Autenticación de usuario
POST /auth/refresh            # Renovar token JWT
POST /auth/register           # Registro de nuevo usuario
PATCH /auth/change-password   # Cambiar contraseña
GET  /auth/profile            # Perfil del usuario autenticado
GET  /auth/validate           # Validar token JWT
```

### **Leads Service (Puerto 3002):**
```
# Gestión de Leads
GET    /leads                 # Listar leads con filtros
POST   /leads                 # Crear nuevo lead
GET    /leads/:id             # Obtener lead por ID
PATCH  /leads/:id             # Actualizar lead
DELETE /leads/:id             # Eliminar lead
PATCH  /leads/:id/assign/:userId        # Asignar lead a usuario
PATCH  /leads/:id/status/:estadoId      # Cambiar estado de lead
GET    /leads/user/:userId              # Leads asignados a usuario
GET    /leads/followup-today            # Leads con seguimiento hoy
GET    /leads/stats                     # Estadísticas de leads

# Estados de Lead
POST   /leads/estados         # Crear estado de lead
GET    /leads/estados/all     # Listar estados de lead
PATCH  /leads/estados/:id     # Actualizar estado

# Fuentes de Lead
POST   /leads/fuentes         # Crear fuente de lead
GET    /leads/fuentes/all     # Listar fuentes de lead
PATCH  /leads/fuentes/:id     # Actualizar fuente
```

## 🔐 Autenticación y Autorización

### **Sistema de Roles y Permisos:**

El sistema implementa un control de acceso granular basado en:

- **Roles**: Admin, Supervisor, Agente, etc.
- **Permisos**: Por módulo y acción (ej: `leads:create`, `clients:read`)
- **JWT Tokens**: Autenticación stateless
- **Guards**: Protección de endpoints

## 📈 Estado del Desarrollo

### ✅ **Completado:**
1. **Entidades de Base de Datos** - TypeORM entities para todas las tablas
2. **Auth Service** - Sistema completo de autenticación con JWT, roles y permisos
3. **Leads Service** - Gestión completa de leads, estados y fuentes
4. **Librería Común** - Entidades, DTOs, enums y configuraciones compartidas
5. **API Gateway** - Gateway básico con proxy a microservicios
6. **Configuración de Base de Datos** - Conexión PostgreSQL configurada

### 🚧 **En Desarrollo:**
- Clients Service (estructura básica creada)
- Products Service
- Activities Service  
- Tasks Service
- Notifications Service

### 📋 **Próximos Pasos:**
1. Completar todos los microservicios restantes
2. Implementar comunicación entre microservicios
3. Configurar Bull Queue para tareas asíncronas
4. Agregar tests unitarios y de integración
5. Implementar documentación Swagger
6. Configurar Docker y docker-compose
7. Implementar CI/CD pipeline

## 🤝 Contribución

1. Fork el repositorio
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Equipo de Desarrollo

- **Hannalab PE** - Desarrollo y arquitectura
- **GitHub**: [Hannalab-pe](https://github.com/Hannalab-pe)

---

⭐ **¡Dale una estrella al repositorio si te parece útil!** ⭐