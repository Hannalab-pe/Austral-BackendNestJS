# ✅ Configuración Railway - COMPLETA

## 🎉 Todo Configurado Exitosamente

### 1. Variables de Entorno (.env) - ACTUALIZADO ✅

```env
# Base de datos PostgreSQL Railway (PRODUCCIÓN - ACTIVA)
DB_HOST=hopper.proxy.rlwy.net
DB_PORT=49151
DB_USERNAME=postgres
DB_PASSWORD=EnvdCBYGtIEPHgESTmLyCMScRODJRhSN
DB_NAME=railway
```

### 2. Tablas en Railway - CREADAS ✅

**Tablas agregadas:**
- ✅ detalle_seguro_auto
- ✅ detalle_seguro_salud
- ✅ detalle_seguro_sctr

**Tablas existentes (verificadas):**
- ✅ lead
- ✅ estado_lead
- ✅ fuente_lead
- ✅ cliente (y otras tablas existentes)

### 3. Código Actualizado - LISTO ✅

**Cambios en [main.ts](src/main.ts):**
- ✅ CORS configurado para producción
- ✅ Puerto dinámico con Railway (`process.env.PORT`)
- ✅ Escucha en `0.0.0.0` para Railway
- ✅ Logs diferenciados por entorno

---

## 📋 Variables de Entorno para Railway Dashboard

Configura estas variables en Railway:

```env
NODE_ENV=production
DB_HOST=hopper.proxy.rlwy.net
DB_PORT=49151
DB_USERNAME=postgres
DB_PASSWORD=EnvdCBYGtIEPHgESTmLyCMScRODJRhSN
DB_NAME=railway
JWT_SECRET=austral-jwt-secret-2024-super-secure-key-production
JWT_EXPIRES_IN=24h
```

---

## 🚀 Pasos para Deployment en Railway

### Paso 1: Commit y Push

```bash
# Agregar cambios
git add .

# Commit
git commit -m "fix: Configure Railway production with correct DB credentials and CORS"

# Push
git push
```

### Paso 2: Configurar Variables en Railway

1. Ve a [Railway Dashboard](https://railway.app/)
2. Selecciona tu proyecto
3. Click en el servicio "leads-service"
4. Variables → "+ New Variable"
5. Agrega cada variable de la lista anterior

### Paso 3: Esperar Auto-Deploy

Railway detectará el push y hará deployment automático.

### Paso 4: Verificar Logs

1. En Railway Dashboard → tu servicio
2. Tab "Deployments"
3. Click en el deployment actual
4. Verificar logs - Buscar:
   ```
   Environment: production
   Leads Service running on port: XXXX
   Production URL: https://austral-backendnestjs-production.up.railway.app
   ```

---

## ✅ Verificación de Funcionamiento

### Endpoints para Probar:

```bash
# 1. Health check
curl https://austral-backendnestjs-production.up.railway.app/

# Respuesta esperada: "Leads Service is running!"
```

```bash
# 2. Estados de lead
curl https://austral-backendnestjs-production.up.railway.app/estados-lead

# Respuesta esperada: Array con 8 estados
```

```bash
# 3. Fuentes de lead
curl https://austral-backendnestjs-production.up.railway.app/fuentes-lead

# Respuesta esperada: Array con 12 fuentes
```

```bash
# 4. Swagger UI
https://austral-backendnestjs-production.up.railway.app/api
```

---

## 📊 Estructura de Base de Datos en Railway

### Tablas Principales:
- **estado_lead** (8 registros)
- **fuente_lead** (12 registros)
- **lead** (vacía, lista para usar)
- **detalle_seguro_auto** (vacía, lista para usar)
- **detalle_seguro_salud** (vacía, lista para usar)
- **detalle_seguro_sctr** (vacía, lista para usar)

### Índices Creados:
- idx_detalle_auto_lead
- idx_detalle_auto_marca_modelo
- idx_detalle_salud_lead
- idx_detalle_salud_tipo_plan
- idx_detalle_sctr_lead
- idx_detalle_sctr_actividad

---

## 🔧 Scripts Útiles Creados

| Script | Descripción |
|--------|-------------|
| `add-missing-tables.sql` | SQL para agregar tablas faltantes |
| `add-tables-railway.ps1` | PowerShell para ejecutar SQL en Railway |
| `add-tables-railway.bat` | Batch alternativo |
| `check-railway-tables.bat` | Verificar tablas existentes |

---

## 🎯 Checklist Final

### Local (Desarrollo)
- [x] `.env` actualizado con credenciales de Railway
- [x] Servicio local conectando a Railway correctamente
- [x] Endpoints `/estados-lead` y `/fuentes-lead` funcionando
- [x] Tablas de detalle creadas en Railway

### Railway (Producción)
- [ ] Variables de entorno configuradas en Railway Dashboard
- [ ] Código pusheado a repositorio
- [ ] Auto-deploy completado
- [ ] Logs sin errores
- [ ] Endpoints públicos funcionando

---

## 📝 Notas Importantes

### CORS en Producción
El código está configurado para:
- ✅ Permitir requests sin origin (Postman, curl)
- ✅ Permitir origins específicos en producción
- ✅ Permitir todos los origins en desarrollo

### Puerto
- **Local**: 3002 (fijo)
- **Railway**: Asignado dinámicamente por Railway (variable `PORT`)

### Base de Datos
- **Local**: Ahora usa Railway (hopper.proxy.rlwy.net)
- **Railway**: Usa la misma BD (hopper.proxy.rlwy.net)

**Ventaja:** Mismos datos en local y producción para testing.

---

## 🚨 Troubleshooting

### Error 502 en Railway

**Verificar:**
1. ✅ Variables de entorno configuradas
2. ✅ Logs en Railway sin errores de conexión a BD
3. ✅ Tablas existen en la base de datos

**Comando para verificar BD:**
```bash
psql -h hopper.proxy.rlwy.net -p 49151 -U postgres -d railway
\dt
```

### No conecta a BD desde local

**Verificar `.env`:**
```env
DB_HOST=hopper.proxy.rlwy.net  # No localhost
DB_PORT=49151                   # No 5432
DB_PASSWORD=EnvdCBYGtIEPHgESTmLyCMScRODJRhSN
```

---

## 🎉 Resumen de Cambios Realizados

### 1. Archivos Modificados:
- ✅ `.env` - Actualizado con credenciales de Railway
- ✅ `main.ts` - CORS y configuración para Railway

### 2. Archivos Creados:
- ✅ `add-missing-tables.sql` - SQL para tablas faltantes
- ✅ `add-tables-railway.ps1` - Script de instalación
- ✅ `RAILWAY_ENV_VARIABLES.md` - Guía de variables
- ✅ `CONFIGURACION_RAILWAY_COMPLETA.md` - Este archivo

### 3. Base de Datos:
- ✅ 3 tablas nuevas agregadas a Railway
- ✅ Índices y constraints configurados
- ✅ FK a tabla `lead` funcionando

---

## 📞 Próximos Pasos

1. **Configurar variables en Railway Dashboard**
   - NODE_ENV=production
   - DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME
   - JWT_SECRET

2. **Push a repositorio**
   ```bash
   git add .
   git commit -m "fix: Configure Railway production"
   git push
   ```

3. **Esperar deployment**
   - Railway hará auto-deploy
   - Verificar logs

4. **Probar endpoints**
   ```bash
   curl https://austral-backendnestjs-production.up.railway.app/estados-lead
   ```

---

## ✅ Estado Actual

- ✅ Base de datos Railway configurada
- ✅ Tablas creadas
- ✅ Código actualizado
- ✅ .env actualizado
- ✅ Local funcionando con Railway DB
- ⏳ Pendiente: Configurar variables en Railway Dashboard
- ⏳ Pendiente: Push y deployment

---

**¡Todo listo para deployment!** 🚀
