# Solución al Error de Índices Duplicados

## Error
```
QueryFailedError: relation "idx_lead_cumpleanos" already exists
```

## Causa
El error ocurre porque TypeORM con `synchronize: true` está intentando crear índices que ya existen en la base de datos PostgreSQL.

## Solución Rápida (Recomendada)

### Paso 1: Conectarse a PostgreSQL

**Opción A - Con psql (línea de comandos):**
```bash
psql -U postgres -d railway
```

**Opción B - Con pgAdmin:**
1. Abrir pgAdmin
2. Conectarse al servidor
3. Seleccionar la base de datos `railway`
4. Abrir "Query Tool"

### Paso 2: Ejecutar el script de corrección

Copia y pega este SQL en tu cliente PostgreSQL:

```sql
-- Eliminar índices duplicados si existen
DROP INDEX IF EXISTS idx_lead_activo;
DROP INDEX IF EXISTS idx_lead_asignado;
DROP INDEX IF EXISTS idx_lead_cumpleanos;
DROP INDEX IF EXISTS idx_lead_estado;
DROP INDEX IF EXISTS idx_lead_seguimiento;
DROP INDEX IF EXISTS idx_lead_telefono;

-- Recrear los índices correctamente
CREATE INDEX IF NOT EXISTS idx_lead_activo ON lead(esta_activo);
CREATE INDEX IF NOT EXISTS idx_lead_asignado ON lead(asignado_a_usuario);
CREATE INDEX IF NOT EXISTS idx_lead_cumpleanos ON lead(fecha_nacimiento);
CREATE INDEX IF NOT EXISTS idx_lead_estado ON lead(id_estado);
CREATE INDEX IF NOT EXISTS idx_lead_seguimiento ON lead(proxima_fecha_seguimiento);
CREATE INDEX IF NOT EXISTS idx_lead_telefono ON lead(telefono);

-- Verificar que los índices se crearon correctamente
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE tablename = 'lead'
ORDER BY indexname;
```

### Paso 3: Habilitar synchronize temporalmente (solo desarrollo)

Si necesitas que TypeORM cree automáticamente las tablas durante el desarrollo, edita el archivo:

**`apps/leads-service/src/leads-service.module.ts`**

Cambia:
```typescript
synchronize: false, // Cambiado a false para evitar problemas con índices duplicados
```

Por:
```typescript
synchronize: true, // Solo en desarrollo
```

**IMPORTANTE:** En producción SIEMPRE debe estar en `false` y usar migraciones.

## Solución Alternativa: Limpiar y Recrear Base de Datos

⚠️ **ADVERTENCIA:** Esto eliminará TODOS los datos.

```sql
-- Eliminar todas las tablas del servicio de leads
DROP TABLE IF EXISTS detalle_seguro_sctr CASCADE;
DROP TABLE IF EXISTS detalle_seguro_salud CASCADE;
DROP TABLE IF EXISTS detalle_seguro_auto CASCADE;
DROP TABLE IF EXISTS lead CASCADE;
DROP TABLE IF EXISTS estado_lead CASCADE;
DROP TABLE IF EXISTS fuente_lead CASCADE;
```

Luego cambia `synchronize: true` en el módulo y reinicia el servicio para que TypeORM recree todas las tablas.

## Verificar que el Problema se Solucionó

Después de ejecutar el script SQL, reinicia el servicio:

```bash
# Si estás usando npm
npm run start:dev leads-service

# O si usas el comando directo
nest start leads-service --watch
```

Deberías ver:
```
[Nest] LOG [NestApplication] Nest application successfully started
Leads Service running on: http://localhost:3002
Swagger documentation: http://localhost:3002/api
```

## Prevención Futura

Para evitar este problema en el futuro:

1. **En Desarrollo:**
   - Puedes usar `synchronize: true` SOLO en tu entorno local
   - Configurar en base a variable de entorno:
   ```typescript
   synchronize: process.env.NODE_ENV !== 'production'
   ```

2. **En Producción:**
   - SIEMPRE usar `synchronize: false`
   - Usar migraciones de TypeORM para cambios de esquema
   - Crear archivo `.env` con:
   ```
   NODE_ENV=production
   ```

## Estado Actual del Proyecto

El archivo `leads-service.module.ts` ya está configurado con `synchronize: false` para evitar este problema. Solo necesitas ejecutar el script SQL una vez para limpiar los índices duplicados.

## Contacto

Si el problema persiste después de seguir estos pasos, por favor contacta al equipo de desarrollo.
