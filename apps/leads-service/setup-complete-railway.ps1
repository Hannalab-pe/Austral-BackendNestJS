# Script para crear TODAS las tablas del leads service en Railway
$env:PGPASSWORD = "EnvdCBYGtIEPHgESTmLyCMScRODJRhSN"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  SETUP COMPLETO DE LEADS SERVICE EN RAILWAY" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Conectando a Railway..." -ForegroundColor Yellow
Write-Host "  Host: hopper.proxy.rlwy.net" -ForegroundColor Gray
Write-Host "  Port: 49151" -ForegroundColor Gray
Write-Host "  Database: railway" -ForegroundColor Gray
Write-Host ""
Write-Host "Este script creará:" -ForegroundColor Yellow
Write-Host "  - estado_lead (8 estados iniciales)" -ForegroundColor Cyan
Write-Host "  - fuente_lead (12 fuentes iniciales)" -ForegroundColor Cyan
Write-Host "  - lead" -ForegroundColor Cyan
Write-Host "  - detalle_seguro_auto" -ForegroundColor Cyan
Write-Host "  - detalle_seguro_salud" -ForegroundColor Cyan
Write-Host "  - detalle_seguro_sctr" -ForegroundColor Cyan
Write-Host ""

& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h hopper.proxy.rlwy.net -p 49151 -U postgres -d railway -f "src\scripts\create-database.sql"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  PROCESO COMPLETADO" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Verificando tablas creadas..." -ForegroundColor Yellow
Write-Host ""

& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h hopper.proxy.rlwy.net -p 49151 -U postgres -d railway -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%lead%' OR tablename LIKE 'detalle%' ORDER BY tablename;"

Write-Host ""
Write-Host "Contando registros iniciales..." -ForegroundColor Yellow
Write-Host ""

& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h hopper.proxy.rlwy.net -p 49151 -U postgres -d railway -c "SELECT 'Estados: ' || COUNT(*) FROM estado_lead; SELECT 'Fuentes: ' || COUNT(*) FROM fuente_lead;"
