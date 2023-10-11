#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE DATABASE todotest;
	GRANT ALL PRIVILEGES ON DATABASE todotest TO root;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "todotest" -f /docker-entrypoint-initdb.d/01-create-tables.sql