# Script de PowerShell para crear la base de datos completa del Leads Service
# Uso: .\setup-database.ps1

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "  SETUP DE BASE DE DATOS - LEADS SERVICE" -ForegroundColor Cyan
Write-Host "  Austral CRM - Sistema de Gestión de Leads para Seguros" -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

# Configuración de la base de datos
$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_USER = "postgres"
$DB_NAME = "railway"
$SCRIPT_PATH = "src\scripts\create-database.sql"

Write-Host "Configuración:" -ForegroundColor Yellow
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
    Write-Host "Para instalar PostgreSQL:" -ForegroundColor Yellow
    Write-Host "  1. Descarga PostgreSQL desde: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "  2. Durante la instalación, marca 'Command Line Tools'" -ForegroundColor White
    Write-Host "  3. Agrega PostgreSQL\bin al PATH del sistema" -ForegroundColor White
    Write-Host ""
    Write-Host "Alternativas:" -ForegroundColor Yellow
    Write-Host "  - Usa pgAdmin para ejecutar el script manualmente" -ForegroundColor White
    Write-Host "  - Copia el contenido de $SCRIPT_PATH y ejecútalo en Query Tool" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Yellow
Write-Host "  ADVERTENCIA" -ForegroundColor Yellow
Write-Host "==============================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Este script creará las siguientes tablas:" -ForegroundColor White
Write-Host "  • estado_lead (con 8 estados iniciales)" -ForegroundColor Cyan
Write-Host "  • fuente_lead (con 12 fuentes iniciales)" -ForegroundColor Cyan
Write-Host "  • lead" -ForegroundColor Cyan
Write-Host "  • detalle_seguro_auto" -ForegroundColor Cyan
Write-Host "  • detalle_seguro_salud" -ForegroundColor Cyan
Write-Host "  • detalle_seguro_sctr" -ForegroundColor Cyan
Write-Host ""
Write-Host "También creará:" -ForegroundColor White
Write-Host "  • Índices optimizados" -ForegroundColor Cyan
Write-Host "  • Vistas para reportes" -ForegroundColor Cyan
Write-Host "  • Funciones útiles" -ForegroundColor Cyan
Write-Host "  • Triggers automáticos" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si las tablas ya existen, serán ELIMINADAS y RECREADAS." -ForegroundColor Red
Write-Host "Todos los datos existentes SE PERDERÁN." -ForegroundColor Red
Write-Host ""

$confirmation = Read-Host "¿Desea continuar? (escriba 'SI' en mayúsculas para confirmar)"
if ($confirmation -ne 'SI') {
    Write-Host ""
    Write-Host "Operación cancelada por el usuario" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "  EJECUTANDO SCRIPT SQL..." -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

# Solicitar contraseña
$securePassword = Read-Host "Ingrese la contraseña de PostgreSQL para el usuario '$DB_USER'" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
$env:PGPASSWORD = $password

try {
    # Ejecutar el script SQL
    Write-Host "Creando extensiones..." -ForegroundColor Cyan
    Write-Host "Creando tablas..." -ForegroundColor Cyan
    Write-Host "Insertando datos iniciales..." -ForegroundColor Cyan
    Write-Host "Creando índices..." -ForegroundColor Cyan
    Write-Host "Creando vistas..." -ForegroundColor Cyan
    Write-Host "Creando funciones y triggers..." -ForegroundColor Cyan
    Write-Host ""

    $output = & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $SCRIPT_PATH 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "==============================================================" -ForegroundColor Green
        Write-Host "  ✓ BASE DE DATOS CREADA EXITOSAMENTE" -ForegroundColor Green
        Write-Host "==============================================================" -ForegroundColor Green
        Write-Host ""

        # Mostrar resultado de verificaciones
        Write-Host "Resultado de verificaciones:" -ForegroundColor Cyan
        Write-Host $output | Select-String -Pattern "tablename|insertados|insertadas|resultado"
        Write-Host ""

        Write-Host "Tablas creadas:" -ForegroundColor Yellow
        Write-Host "  ✓ estado_lead" -ForegroundColor Green
        Write-Host "  ✓ fuente_lead" -ForegroundColor Green
        Write-Host "  ✓ lead" -ForegroundColor Green
        Write-Host "  ✓ detalle_seguro_auto" -ForegroundColor Green
        Write-Host "  ✓ detalle_seguro_salud" -ForegroundColor Green
        Write-Host "  ✓ detalle_seguro_sctr" -ForegroundColor Green
        Write-Host ""

        Write-Host "Datos iniciales insertados:" -ForegroundColor Yellow
        Write-Host "  ✓ 8 Estados de lead" -ForegroundColor Green
        Write-Host "  ✓ 12 Fuentes de lead" -ForegroundColor Green
        Write-Host ""

        Write-Host "==============================================================" -ForegroundColor Cyan
        Write-Host "  PRÓXIMOS PASOS" -ForegroundColor Cyan
        Write-Host "==============================================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "1. Iniciar el servicio de leads:" -ForegroundColor White
        Write-Host "   npm run start:dev leads-service" -ForegroundColor Gray
        Write-Host ""
        Write-Host "2. Acceder a la documentación Swagger:" -ForegroundColor White
        Write-Host "   http://localhost:3002/api" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "3. Probar los endpoints:" -ForegroundColor White
        Write-Host "   GET  http://localhost:3002/leads" -ForegroundColor Gray
        Write-Host "   POST http://localhost:3002/leads" -ForegroundColor Gray
        Write-Host ""
        Write-Host "4. Ver estados disponibles:" -ForegroundColor White
        Write-Host "   GET  http://localhost:3002/estados-lead" -ForegroundColor Gray
        Write-Host ""
        Write-Host "5. Ver fuentes disponibles:" -ForegroundColor White
        Write-Host "   GET  http://localhost:3002/fuentes-lead" -ForegroundColor Gray
        Write-Host ""

        Write-Host "==============================================================" -ForegroundColor Green
        Write-Host "  SETUP COMPLETADO" -ForegroundColor Green
        Write-Host "==============================================================" -ForegroundColor Green
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
        Write-Host "  • La base de datos '$DB_NAME' no existe" -ForegroundColor White
        Write-Host "  • El usuario '$DB_USER' no tiene permisos" -ForegroundColor White
        Write-Host "  • PostgreSQL no está ejecutándose" -ForegroundColor White
        Write-Host "  • Contraseña incorrecta" -ForegroundColor White
        Write-Host ""
        Write-Host "Soluciones:" -ForegroundColor Yellow
        Write-Host "  1. Verifica que PostgreSQL esté ejecutándose" -ForegroundColor White
        Write-Host "  2. Crea la base de datos si no existe:" -ForegroundColor White
        Write-Host "     psql -U postgres -c 'CREATE DATABASE railway;'" -ForegroundColor Gray
        Write-Host "  3. Verifica credenciales de acceso" -ForegroundColor White
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
