# Setup de Base de Datos - Leads Service

## 🚨 Problema Actual

```
ERROR: relation "estado_lead" does not exist
```

**Causa:** Las tablas no existen en la base de datos porque `synchronize: false` está deshabilitado.

**Solución:** Ejecutar el script de creación de base de datos.

---

## 🚀 Solución Rápida (Método Automático)

### Opción 1: PowerShell Script (Recomendado para Windows)

```powershell
cd apps\leads-service
.\setup-database.ps1
```

Este script:
- ✅ Verifica que psql está instalado
- ✅ Crea todas las tablas necesarias
- ✅ Inserta datos iniciales (estados y fuentes)
- ✅ Crea índices optimizados
- ✅ Crea vistas, funciones y triggers
- ✅ Verifica que todo se creó correctamente

---

### Opción 2: Ejecución Manual con psql

```bash
# 1. Conectarse a PostgreSQL
psql -U postgres -d railway

# 2. Ejecutar el script
\i apps/leads-service/src/scripts/create-database.sql

# 3. Salir
\q
```

---

### Opción 3: Usar pgAdmin (GUI)

1. Abrir **pgAdmin**
2. Conectarse al servidor PostgreSQL
3. Seleccionar la base de datos **railway**
4. Click derecho → **Query Tool**
5. Abrir el archivo: `apps/leads-service/src/scripts/create-database.sql`
6. Click en **Execute** (F5)

---

## 📋 ¿Qué Crea el Script?

### Tablas Principales

| Tabla | Descripción | Registros Iniciales |
|-------|-------------|---------------------|
| **estado_lead** | Estados del proceso de ventas | 8 estados |
| **fuente_lead** | Fuentes de origen de leads | 12 fuentes |
| **lead** | Información de leads | 0 (vacío) |
| **detalle_seguro_auto** | Detalles de seguros vehiculares | 0 (vacío) |
| **detalle_seguro_salud** | Detalles de seguros de salud | 0 (vacío) |
| **detalle_seguro_sctr** | Detalles de seguros SCTR | 0 (vacío) |

### Estados Iniciales Creados

1. **Nuevo** - Lead recién ingresado (#3B82F6)
2. **Contactado** - Primer contacto realizado (#10B981)
3. **Calificado** - Lead evaluado como potencial cliente (#F59E0B)
4. **Propuesta Enviada** - Propuesta enviada (#8B5CF6)
5. **Negociación** - En proceso de negociación (#EC4899)
6. **Ganado** - Convertido en cliente ✓ (#059669)
7. **Perdido** - No convertido ✓ (#DC2626)
8. **En Seguimiento** - Requiere seguimiento posterior (#6366F1)

### Fuentes Iniciales Creadas

| Fuente | Tipo |
|--------|------|
| Sitio Web | Digital |
| Facebook Ads | Digital |
| Google Ads | Digital |
| LinkedIn | Digital |
| Instagram | Digital |
| Referido | Referido |
| Llamada Entrante | Telefónico |
| Email | Email |
| Evento | Presencial |
| WhatsApp | Digital |
| Chat en Vivo | Digital |
| Base de Datos Comprada | Comprado |

### Características Adicionales

- ✅ **Índices optimizados** para búsquedas rápidas
- ✅ **Vistas** para reportes y estadísticas
- ✅ **Funciones** útiles (calcular edad, obtener seguimientos)
- ✅ **Triggers** para actualizar fechas automáticamente
- ✅ **Constraints** para integridad de datos
- ✅ **Comentarios** en tablas y columnas

---

## ✅ Verificar que Funcionó

### 1. Verificar en psql

```sql
-- Ver todas las tablas
\dt

-- Contar estados
SELECT COUNT(*) FROM estado_lead;

-- Contar fuentes
SELECT COUNT(*) FROM fuente_lead;

-- Ver estructura de la tabla lead
\d lead
```

### 2. Iniciar el servicio

```bash
npm run start:dev leads-service
```

Deberías ver:
```
✓ Leads Service running on: http://localhost:3002
✓ Swagger documentation: http://localhost:3002/api
```

### 3. Probar en Swagger

Abre tu navegador en: **http://localhost:3002/api**

Prueba estos endpoints:

#### GET `/estados-lead` - Obtener estados
```bash
curl http://localhost:3002/estados-lead
```

Respuesta esperada:
```json
[
  {
    "id_estado": "uuid-aqui",
    "nombre": "Nuevo",
    "descripcion": "Lead recién ingresado al sistema",
    "color_hex": "#3B82F6",
    "orden_proceso": 1,
    "es_estado_final": false,
    "esta_activo": true
  },
  ...
]
```

#### GET `/fuentes-lead` - Obtener fuentes
```bash
curl http://localhost:3002/fuentes-lead
```

#### POST `/leads` - Crear un lead de prueba

Primero obtén un `id_estado` y un `id_fuente` de los endpoints anteriores, luego:

```bash
curl -X POST http://localhost:3002/leads \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "+51987654321",
    "email": "juan@example.com",
    "tipo_seguro_interes": "Auto",
    "id_estado": "UUID_DEL_ESTADO",
    "id_fuente": "UUID_DE_LA_FUENTE"
  }'
```

---

## 🔧 Solución de Problemas

### Error: "database 'railway' does not exist"

**Solución:** Crear la base de datos primero

```bash
psql -U postgres -c "CREATE DATABASE railway;"
```

### Error: "psql: command not found"

**Solución:** Instalar PostgreSQL o usar pgAdmin

1. Descargar: https://www.postgresql.org/download/windows/
2. Durante instalación, marcar "Command Line Tools"
3. Agregar a PATH: `C:\Program Files\PostgreSQL\16\bin`

### Error: "password authentication failed"

**Solución:** Verificar credenciales

Edita las variables de entorno o el archivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=railway
```

### Error: "permission denied"

**Solución:** Otorgar permisos al usuario

```sql
GRANT ALL PRIVILEGES ON DATABASE railway TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

---

## 🔄 Reiniciar desde Cero

Si necesitas borrar todo y empezar de nuevo:

```sql
-- Conectarse a PostgreSQL
psql -U postgres -d railway

-- Borrar todas las tablas
DROP TABLE IF EXISTS detalle_seguro_sctr CASCADE;
DROP TABLE IF EXISTS detalle_seguro_salud CASCADE;
DROP TABLE IF EXISTS detalle_seguro_auto CASCADE;
DROP TABLE IF EXISTS lead CASCADE;
DROP TABLE IF EXISTS estado_lead CASCADE;
DROP TABLE IF EXISTS fuente_lead CASCADE;

-- Ejecutar de nuevo el script de creación
\i apps/leads-service/src/scripts/create-database.sql
```

O usar el script PowerShell que hace esto automáticamente.

---

## 📚 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `setup-database.ps1` | Script PowerShell para setup automático |
| `src/scripts/create-database.sql` | Script SQL completo |
| `src/scripts/fix-database.sql` | Script para corregir índices |
| `SOLUCION_ERROR_INDICES.md` | Documentación del error de índices |
| `README_SETUP.md` | Este archivo |

---

## 🎯 Próximos Pasos

Una vez que la base de datos esté configurada:

1. ✅ Iniciar el servicio: `npm run start:dev leads-service`
2. ✅ Acceder a Swagger: http://localhost:3002/api
3. ✅ Crear tus primeros leads de prueba
4. ✅ Probar las cotizaciones de seguros
5. ✅ Explorar las vistas y reportes

---

## 📞 Soporte

Si sigues teniendo problemas:

1. Revisa los logs del servicio
2. Verifica que PostgreSQL esté corriendo
3. Confirma que las credenciales son correctas
4. Asegúrate de que el puerto 3002 no está ocupado

---

## 🎉 ¡Listo!

Ahora tienes un sistema completo de gestión de leads con:
- ✅ Base de datos configurada
- ✅ Estados y fuentes predefinidos
- ✅ API REST documentada
- ✅ Cálculo de cotizaciones
- ✅ Reportes y estadísticas

**¡A vender seguros!** 🚗💼⚕️
