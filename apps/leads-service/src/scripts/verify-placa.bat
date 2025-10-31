@echo off
set PGPASSWORD=EnvdCBYGtIEPHgESTmLyCMScRODJRhSN
echo Verificando si la columna placa existe...
psql -h hopper.proxy.rlwy.net -p 49151 -U postgres -d railway -c "SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = 'detalle_seguro_auto' ORDER BY ordinal_position;"
