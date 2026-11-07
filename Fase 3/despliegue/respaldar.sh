#!/bin/sh
set -eu
cd "$(dirname "$0")"
umask 077
mkdir -p respaldos
stamp=$(date -u +%Y%m%dT%H%M%SZ)
for service in usuarios ventas; do
    output="respaldos/${service}-${stamp}.sql"
    if docker compose exec -T "mysql-$service" sh -c \
        'MYSQL_PWD="$MYSQL_PASSWORD" exec mysqldump --default-character-set=utf8mb4 --no-tablespaces --single-transaction -u"$MYSQL_USER" "$MYSQL_DATABASE"' > "$output.tmp"; then
        mv "$output.tmp" "$output"
    else
        echo "Falló el respaldo de $service; el archivo .tmp no es un respaldo válido." >&2
        exit 1
    fi
done
echo "Respaldos SQL creados en respaldos con fecha UTC $stamp."
