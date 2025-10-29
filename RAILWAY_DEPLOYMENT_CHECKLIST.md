# Railway Deployment Checklist - Leads Service

## ✅ Already Completed
- [x] Database tables created in Railway (all 6 tables)
- [x] Initial data loaded (8 estados, 12 fuentes)
- [x] Code updated for production (CORS, port binding)
- [x] Local testing successful with Railway DB
- [x] TypeORM synchronize disabled to prevent conflicts

## 🚀 Next Steps to Deploy

### 1. Configure Environment Variables in Railway Dashboard

**CRITICAL:** Go to your Railway project dashboard and set these variables:

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

**How to set variables in Railway:**
1. Go to https://railway.app
2. Select your project: `Austral-BackendNestJS`
3. Click on your `leads-service` service
4. Go to the "Variables" tab
5. Add each variable above
6. Click "Deploy" or wait for auto-deploy

### 2. Push Changes (if needed)

Check if there are any uncommitted changes:
```bash
git status
```

If you see changes to commit:
```bash
git add .
git commit -m "fix: Complete Railway production setup with database tables"
git push origin main
```

### 3. Monitor Railway Deployment

After pushing or after setting environment variables:
1. Go to Railway Dashboard
2. Click on "Deployments" tab
3. Watch the build logs for any errors
4. Wait for status to show "Active" or "Success"

### 4. Test Production Endpoints

Once deployed, test these URLs:

**Health Check:**
```bash
curl https://austral-backendnestjs-production.up.railway.app/leads
```

**Expected response:** `[]` (empty array - correct since no leads exist yet)

**Swagger Documentation:**
```
https://austral-backendnestjs-production.up.railway.app/api
```

**Test other endpoints:**
```bash
# Get all estados (should return 8 items)
curl https://austral-backendnestjs-production.up.railway.app/estados-lead

# Get all fuentes (should return 12 items)
curl https://austral-backendnestjs-production.up.railway.app/fuentes-lead
```

## 🔧 Troubleshooting

### If you get 502 errors:
1. Check Railway logs in Dashboard
2. Verify all environment variables are set correctly
3. Check that PORT binding is working (should auto-assign)
4. Verify database connection from Railway logs

### If you get CORS errors:
- Make sure NODE_ENV=production is set in Railway
- Update the allowedOrigins array in main.ts with your frontend URL

### If you get database errors:
- Run the verification query:
```bash
# From Railway CLI or dashboard SQL console
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

## 📊 Database Status

**Current Railway Database (hopper.proxy.rlwy.net:49151):**
- ✅ estado_lead (8 records)
- ✅ fuente_lead (12 records)
- ✅ lead (empty, ready for use)
- ✅ detalle_seguro_auto (empty)
- ✅ detalle_seguro_salud (empty)
- ✅ detalle_seguro_sctr (empty)

## 📝 Important Notes

1. **Local development now uses Railway DB** - Your .env points to Railway
2. **TypeORM synchronize is OFF** - Schema changes must be done via SQL scripts
3. **All scripts are in:** `apps/leads-service/src/scripts/`
4. **Railway auto-deploys** when you push to main branch

## 🎯 Success Criteria

Deployment is successful when:
- [ ] Railway shows "Active" status
- [ ] GET /leads returns `[]` without errors
- [ ] GET /estados-lead returns 8 items
- [ ] GET /fuentes-lead returns 12 items
- [ ] Swagger UI loads at /api
- [ ] No 502 or CORS errors in browser
