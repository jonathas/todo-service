#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE DATABASE todotest;
	GRANT ALL PRIVILEGES ON DATABASE todotest TO root;
EOSQL