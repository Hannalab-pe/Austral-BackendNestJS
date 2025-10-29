@echo off
echo ============================================================
echo   AGREGANDO TABLAS FALTANTES A RAILWAY
echo ============================================================
echo.
echo Conectando a Railway...
echo Host: hopper.proxy.rlwy.net
echo Port: 49151
echo Database: railway
echo.

set PGPASSWORD=EnvdCBYGtIEPHgESTmLyCMScRODJRhSN
psql -h hopper.proxy.rlwy.net -p 49151 -U postgres -d railway -f "src\scripts\add-missing-tables.sql"

echo.
echo ============================================================
echo   PROCESO COMPLETADO
echo ============================================================
pause
