# Script simple para ejecutar el SQL con credenciales correctas
$env:PGPASSWORD = "root"
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -p 5432 -U postgres -d AUSTRALBDlocal -f "src\scripts\create-database.sql"
