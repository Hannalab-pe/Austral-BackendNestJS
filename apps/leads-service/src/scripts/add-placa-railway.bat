@echo off
set PGPASSWORD=EnvdCBYGtIEPHgESTmLyCMScRODJRhSN
psql -h hopper.proxy.rlwy.net -p 49151 -U postgres -d railway -c "ALTER TABLE detalle_seguro_auto ADD COLUMN IF NOT EXISTS placa VARCHAR(20); CREATE INDEX IF NOT EXISTS idx_detalle_auto_placa ON detalle_seguro_auto(placa); SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'detalle_seguro_auto' AND column_name = 'placa';"
pause
