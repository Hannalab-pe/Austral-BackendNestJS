@echo off
set PGPASSWORD=EnvdCBYGtIEPHgESTmLyCMScRODJRhSN
psql -h hopper.proxy.rlwy.net -p 49151 -U postgres -d railway -c "\dt"
