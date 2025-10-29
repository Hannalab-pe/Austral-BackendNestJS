@echo off
set PGPASSWORD=postgres
psql -h localhost -p 5432 -U postgres -d railway -f "src\scripts\create-database.sql"
pause
