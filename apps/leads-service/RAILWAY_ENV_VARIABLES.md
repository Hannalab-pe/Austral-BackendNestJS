# Variables de Entorno para Railway - Leads Service

## 🚨 IMPORTANTE: Configurar en Railway

Ve a tu proyecto en Railway → Settings → Variables y configura las siguientes variables:

---

## Variables Requeridas

### 1. Node Environment
```
NODE_ENV=production
```

### 2. Puerto (Railway lo asigna automáticamente, NO lo configures manualmente)
```
# NO configurar PORT - Railway lo asigna automáticamente
```

### 3. Base de Datos PostgreSQL (Railway)

**OPCIÓN A: Si usas la base de datos comentada en tu .env**
```
DB_HOST=caboose.proxy.rlwy.net
DB_PORT=55674
DB_USERNAME=postgres
DB_PASSWORD=dIRxzlvBzrbPvqaZJhOnbeKjCOUJokWY
DB_NAME=railway
```

**OPCIÓN B: Si creaste una nueva base de datos en Railway**
1. Ve a tu proyecto Railway
2. Click en "+ New" → "Database" → "Add PostgreSQL"
3. Railway creará automáticamente estas variables:
   - `PGHOST` → úsalo como `DB_HOST`
   - `PGPORT` → úsalo como `DB_PORT`
   - `PGUSER` → úsalo como `DB_USERNAME`
   - `PGPASSWORD` → úsalo como `DB_PASSWORD`
   - `PGDATABASE` → úsalo como `DB_NAME`

4. Copia los valores y configúralos manualmente con los nombres correctos:
```
DB_HOST=${{PGHOST}}
DB_PORT=${{PGPORT}}
DB_USERNAME=${{PGUSER}}
DB_PASSWORD=${{PGPASSWORD}}
DB_NAME=${{PGDATABASE}}
```

### 4. JWT Configuration
```
JWT_SECRET=austral-jwt-secret-2024-super-secure-key-production-change-this
JWT_EXPIRES_IN=24h
```

### 5. App Configuration
```
APP_NAME=Austral CRM ERP Seguros
APP_VERSION=1.0.0
```

---

## ⚠️ Variables que NO debes configurar en Railway

Estas son solo para desarrollo local:

```
# ❌ NO configurar estas en Railway:
REDIS_HOST=localhost         # Solo local
REDIS_PORT=6379             # Solo local
SMTP_HOST=smtp.gmail.com    # Configurar solo si usas email
SMTP_PORT=587               # Configurar solo si usas email
```

---

## 🔍 Verificar Variables en Railway

1. Ve a tu proyecto en Railway
2. Click en el servicio "leads-service"
3. Ve a la pestaña "Variables"
4. Asegúrate de tener todas estas configuradas

---

## 📋 Pasos para Configurar

### Paso 1: Crear/Verificar Base de Datos en Railway

```bash
# Opción 1: Usar la base de datos existente (la que está comentada en .env)
DB_HOST=caboose.proxy.rlwy.net
DB_PORT=55674
DB_USERNAME=postgres
DB_PASSWORD=dIRxzlvBzrbPvqaZJhOnbeKjCOUJokWY
DB_NAME=railway

# Opción 2: Crear nueva base de datos PostgreSQL en Railway
# Railway la creará automáticamente con variables PGHOST, PGPORT, etc.
```

### Paso 2: Ejecutar Script SQL en Base de Datos Railway

**Si usas la base de datos de Railway, necesitas crear las tablas:**

```bash
# Opción 1: Desde tu terminal local
psql -h caboose.proxy.rlwy.net -p 55674 -U postgres -d railway -f apps/leads-service/src/scripts/create-database.sql

# Opción 2: Desde Railway CLI
railway run psql -f apps/leads-service/src/scripts/create-database.sql

# Opción 3: Usar TablePlus, pgAdmin o DBeaver
# Conectar a la BD de Railway y ejecutar el script SQL
```

### Paso 3: Configurar Variables en Railway

Ve a Railway Dashboard:
1. Selecciona tu proyecto
2. Click en tu servicio
3. Variables → Add Variable
4. Agrega cada variable de la lista anterior

### Paso 4: Hacer Deploy

```bash
# Hacer commit de los cambios
git add .
git commit -m "Configure Railway environment"
git push

# Railway hará auto-deploy
```

---

## 🔧 Troubleshooting

### Error 502 - Application failed to respond

**Causas:**
1. ❌ Base de datos no configurada correctamente
2. ❌ Aplicación crasheando al iniciar
3. ❌ Puerto incorrecto (debe usar `process.env.PORT`)
4. ❌ No está escuchando en `0.0.0.0`

**Soluciones:**
1. ✅ Verificar logs en Railway
2. ✅ Verificar variables de entorno
3. ✅ Verificar que las tablas existen en la BD
4. ✅ Verificar que `app.listen(port, '0.0.0.0')` está configurado

### Ver Logs en Railway

```
1. Ve a tu proyecto en Railway
2. Click en tu servicio
3. Tab "Deployments"
4. Click en el deployment actual
5. Ver logs en tiempo real
```

### Base de Datos no tiene tablas

```bash
# Conectar a Railway DB y ejecutar script
psql -h caboose.proxy.rlwy.net -p 55674 -U postgres -d railway

# Luego dentro de psql:
\i /path/to/create-database.sql

# O copiar y pegar el contenido del archivo SQL
```

---

## ✅ Verificar que Funciona

Una vez configurado, prueba:

```bash
# Endpoint raíz
curl https://austral-backendnestjs-production.up.railway.app/

# Estados
curl https://austral-backendnestjs-production.up.railway.app/estados-lead

# Fuentes
curl https://austral-backendnestjs-production.up.railway.app/fuentes-lead

# Swagger
https://austral-backendnestjs-production.up.railway.app/api
```

---

## 📊 Checklist de Configuración

- [ ] NODE_ENV=production configurado
- [ ] Variables de base de datos configuradas (DB_HOST, DB_PORT, etc.)
- [ ] JWT_SECRET configurado
- [ ] Script SQL ejecutado en base de datos Railway
- [ ] Tablas creadas (6 tablas: lead, estado_lead, fuente_lead, detalle_seguro_auto, detalle_seguro_salud, detalle_seguro_sctr)
- [ ] Deploy realizado
- [ ] Logs sin errores
- [ ] Endpoint `/` responde
- [ ] Endpoint `/estados-lead` retorna 8 estados
- [ ] Endpoint `/fuentes-lead` retorna 12 fuentes
- [ ] Swagger accesible en `/api`

---

## 🎯 Resumen Rápido

**Variables mínimas requeridas:**
```env
NODE_ENV=production
DB_HOST=caboose.proxy.rlwy.net
DB_PORT=55674
DB_USERNAME=postgres
DB_PASSWORD=dIRxzlvBzrbPvqaZJhOnbeKjCOUJokWY
DB_NAME=railway
JWT_SECRET=tu-secreto-seguro-aqui
```

**Después de configurar:**
1. Ejecutar SQL en Railway DB
2. Hacer commit y push
3. Esperar auto-deploy
4. Verificar logs
5. Probar endpoints

---

## 📞 Comandos Útiles

```bash
# Ver logs en Railway CLI
railway logs

# Ejecutar comando en Railway
railway run <command>

# Conectar a Railway DB
railway connect

# Ver variables
railway variables
```

---

¡Listo! Una vez configurado todo, tu servicio debería estar funcionando en:
**https://austral-backendnestjs-production.up.railway.app**
