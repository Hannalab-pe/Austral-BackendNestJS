# Script simple para ejecutar el SQL
$env:PGPASSWORD = "postgres"
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -p 5432 -U postgres -d railway -f "src\scripts\create-database.sql"
