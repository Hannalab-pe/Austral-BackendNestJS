@echo off
set PGPASSWORD=postgres
psql -h localhost -p 5432 -U postgres -d railway -f "c:\Users\Usuario\Desktop\Austral-BackendNestJS\apps\leads-service\src\scripts\add-placa-column.sql"
