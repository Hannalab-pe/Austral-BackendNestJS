# Script para agregar tablas faltantes a Railway
$env:PGPASSWORD = "EnvdCBYGtIEPHgESTmLyCMScRODJRhSN"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  AGREGANDO TABLAS FALTANTES A RAILWAY" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Conectando a Railway..." -ForegroundColor Yellow
Write-Host "  Host: hopper.proxy.rlwy.net" -ForegroundColor Gray
Write-Host "  Port: 49151" -ForegroundColor Gray
Write-Host "  Database: railway" -ForegroundColor Gray
Write-Host ""

& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h hopper.proxy.rlwy.net -p 49151 -U postgres -d railway -f "src\scripts\add-missing-tables.sql"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  PROCESO COMPLETADO" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
