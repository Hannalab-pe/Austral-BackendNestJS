# Script de PowerShell para corregir índices duplicados en PostgreSQL
# Uso: .\fix-indices.ps1

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Script de Corrección de Índices Duplicados" -ForegroundColor Cyan
Write-Host "  Leads Service - Austral CRM" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Configuración de la base de datos (editar si es necesario)
$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_USER = "postgres"
$DB_NAME = "railway"

Write-Host "Configuración:" -ForegroundColor Yellow
Write-Host "  Host: $DB_HOST" -ForegroundColor White
Write-Host "  Puerto: $DB_PORT" -ForegroundColor White
Write-Host "  Usuario: $DB_USER" -ForegroundColor White
Write-Host "  Base de datos: $DB_NAME" -ForegroundColor White
Write-Host ""

# Verificar si psql está instalado
try {
    $psqlVersion = & psql --version 2>&1
    Write-Host "✓ psql encontrado: $psqlVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: psql no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Soluciones alternativas:" -ForegroundColor Yellow
    Write-Host "  1. Instalar PostgreSQL que incluye psql" -ForegroundColor White
    Write-Host "  2. Usar pgAdmin para ejecutar el script SQL manualmente" -ForegroundColor White
    Write-Host "  3. Ver instrucciones en: SOLUCION_ERROR_INDICES.md" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Este script realizará las siguientes acciones:" -ForegroundColor Yellow
Write-Host "  1. Eliminar índices duplicados" -ForegroundColor White
Write-Host "  2. Recrear los índices correctamente" -ForegroundColor White
Write-Host "  3. Verificar que los índices se crearon" -ForegroundColor White
Write-Host ""

$confirmation = Read-Host "¿Desea continuar? (S/N)"
if ($confirmation -ne 'S' -and $confirmation -ne 's') {
    Write-Host "Operación cancelada por el usuario" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Ejecutando script SQL..." -ForegroundColor Cyan

# SQL a ejecutar
$sqlScript = @"
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
"@

# Guardar el script SQL temporalmente
$tempSqlFile = [System.IO.Path]::GetTempFileName() + ".sql"
$sqlScript | Out-File -FilePath $tempSqlFile -Encoding UTF8

try {
    # Ejecutar el script SQL
    $env:PGPASSWORD = Read-Host "Ingrese la contraseña de PostgreSQL" -AsSecureString
    $env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:PGPASSWORD))

    $result = & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $tempSqlFile 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Script ejecutado exitosamente" -ForegroundColor Green
        Write-Host ""
        Write-Host "Resultado:" -ForegroundColor Cyan
        Write-Host $result
        Write-Host ""
        Write-Host "==================================================" -ForegroundColor Green
        Write-Host "  Corrección completada exitosamente" -ForegroundColor Green
        Write-Host "==================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Próximos pasos:" -ForegroundColor Yellow
        Write-Host "  1. Reinicia el servicio de leads" -ForegroundColor White
        Write-Host "  2. Verifica que no hay errores en los logs" -ForegroundColor White
        Write-Host "  3. Accede a Swagger: http://localhost:3002/api" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "✗ Error al ejecutar el script" -ForegroundColor Red
        Write-Host $result
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "✗ Error: $_" -ForegroundColor Red
    exit 1
} finally {
    # Limpiar el archivo temporal
    if (Test-Path $tempSqlFile) {
        Remove-Item $tempSqlFile
    }
    # Limpiar la contraseña de la memoria
    $env:PGPASSWORD = $null
}
