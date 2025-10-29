# Script para configurar la base de datos de Railway
# Ejecutar: .\setup-railway-db.ps1

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "  SETUP DE BASE DE DATOS RAILWAY - LEADS SERVICE" -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

# Configuración de Railway (según tu .env comentado)
$DB_HOST = "caboose.proxy.rlwy.net"
$DB_PORT = "55674"
$DB_USER = "postgres"
$DB_NAME = "railway"
$SCRIPT_PATH = "src\scripts\create-database.sql"

Write-Host "Configuración Railway:" -ForegroundColor Yellow
Write-Host "  Host        : $DB_HOST" -ForegroundColor White
Write-Host "  Puerto      : $DB_PORT" -ForegroundColor White
Write-Host "  Usuario     : $DB_USER" -ForegroundColor White
Write-Host "  Base de datos: $DB_NAME" -ForegroundColor White
Write-Host "  Script SQL  : $SCRIPT_PATH" -ForegroundColor White
Write-Host ""

# Verificar si el archivo SQL existe
if (-not (Test-Path $SCRIPT_PATH)) {
    Write-Host "✗ Error: No se encontró el archivo SQL en $SCRIPT_PATH" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Archivo SQL encontrado" -ForegroundColor Green

# Verificar si psql está instalado
try {
    $psqlVersion = & psql --version 2>&1
    Write-Host "✓ psql encontrado: $psqlVersion" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "✗ Error: psql no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternativas:" -ForegroundColor Yellow
    Write-Host "  - Instalar PostgreSQL desde: https://www.postgresql.org/download/" -ForegroundColor White
    Write-Host "  - Usar TablePlus, DBeaver o pgAdmin para ejecutar el script manualmente" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Yellow
Write-Host "  ADVERTENCIA - BASE DE DATOS DE PRODUCCIÓN" -ForegroundColor Yellow
Write-Host "==============================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Este script creará/recreará las tablas en Railway:" -ForegroundColor Red
Write-Host "  • estado_lead" -ForegroundColor Cyan
Write-Host "  • fuente_lead" -ForegroundColor Cyan
Write-Host "  • lead" -ForegroundColor Cyan
Write-Host "  • detalle_seguro_auto" -ForegroundColor Cyan
Write-Host "  • detalle_seguro_salud" -ForegroundColor Cyan
Write-Host "  • detalle_seguro_sctr" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si las tablas ya existen, serán ELIMINADAS y RECREADAS." -ForegroundColor Red
Write-Host "¡Esto es PRODUCCIÓN! Los datos existentes SE PERDERÁN." -ForegroundColor Red
Write-Host ""

$confirmation = Read-Host "¿Desea continuar? (escriba 'SI' en mayúsculas para confirmar)"
if ($confirmation -ne 'SI') {
    Write-Host ""
    Write-Host "Operación cancelada por el usuario" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "  EJECUTANDO SCRIPT SQL EN RAILWAY..." -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

# Solicitar contraseña
Write-Host "Contraseña de Railway (de tu .env):" -ForegroundColor Yellow
Write-Host "  dIRxzlvBzrbPvqaZJhOnbeKjCOUJokWY" -ForegroundColor Gray
Write-Host ""
$securePassword = Read-Host "Ingrese la contraseña de Railway" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
$env:PGPASSWORD = $password

try {
    Write-Host "Conectando a Railway..." -ForegroundColor Cyan
    Write-Host ""

    $output = & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $SCRIPT_PATH 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "==============================================================" -ForegroundColor Green
        Write-Host "  ✓ BASE DE DATOS RAILWAY CONFIGURADA EXITOSAMENTE" -ForegroundColor Green
        Write-Host "==============================================================" -ForegroundColor Green
        Write-Host ""

        Write-Host "Resumen:" -ForegroundColor Cyan
        Write-Host "  ✓ Tablas creadas en Railway" -ForegroundColor Green
        Write-Host "  ✓ 8 Estados de lead insertados" -ForegroundColor Green
        Write-Host "  ✓ 12 Fuentes de lead insertadas" -ForegroundColor Green
        Write-Host "  ✓ Índices, vistas y funciones creadas" -ForegroundColor Green
        Write-Host ""

        Write-Host "==============================================================" -ForegroundColor Cyan
        Write-Host "  PRÓXIMOS PASOS" -ForegroundColor Cyan
        Write-Host "==============================================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "1. Configurar variables de entorno en Railway:" -ForegroundColor White
        Write-Host "   - Ve a Railway Dashboard" -ForegroundColor Gray
        Write-Host "   - Variables → Add Variable" -ForegroundColor Gray
        Write-Host "   - Configura las variables del archivo RAILWAY_ENV_VARIABLES.md" -ForegroundColor Gray
        Write-Host ""
        Write-Host "2. Hacer commit y push de los cambios:" -ForegroundColor White
        Write-Host "   git add ." -ForegroundColor Gray
        Write-Host "   git commit -m 'Configure Railway production'" -ForegroundColor Gray
        Write-Host "   git push" -ForegroundColor Gray
        Write-Host ""
        Write-Host "3. Verificar el deployment en Railway:" -ForegroundColor White
        Write-Host "   - Espera que Railway haga auto-deploy" -ForegroundColor Gray
        Write-Host "   - Ve a Deployments y verifica los logs" -ForegroundColor Gray
        Write-Host ""
        Write-Host "4. Probar los endpoints:" -ForegroundColor White
        Write-Host "   curl https://austral-backendnestjs-production.up.railway.app/estados-lead" -ForegroundColor Gray
        Write-Host ""

    } else {
        Write-Host ""
        Write-Host "==============================================================" -ForegroundColor Red
        Write-Host "  ✗ ERROR AL EJECUTAR EL SCRIPT" -ForegroundColor Red
        Write-Host "==============================================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "Detalles del error:" -ForegroundColor Yellow
        Write-Host $output
        Write-Host ""
        Write-Host "Posibles causas:" -ForegroundColor Yellow
        Write-Host "  • Contraseña incorrecta" -ForegroundColor White
        Write-Host "  • Base de datos no accesible" -ForegroundColor White
        Write-Host "  • Firewall bloqueando la conexión" -ForegroundColor White
        Write-Host ""
        Write-Host "Alternativa:" -ForegroundColor Yellow
        Write-Host "  Usa TablePlus, DBeaver o pgAdmin para conectar y ejecutar el script manualmente" -ForegroundColor White
        exit 1
    }

} catch {
    Write-Host ""
    Write-Host "✗ Error inesperado: $_" -ForegroundColor Red
    exit 1
} finally {
    # Limpiar la contraseña de la memoria
    $env:PGPASSWORD = $null
    if ($BSTR) {
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    }
}

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
