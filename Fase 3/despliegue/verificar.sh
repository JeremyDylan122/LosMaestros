#!/bin/sh
set -eu
origin=${1:-http://localhost:8080}
origin=${origin%/}
curl --fail --silent --show-error "$origin/salud" >/dev/null
curl --fail --silent --show-error "$origin/catalogo" >/dev/null
catalogo=$(curl --fail --silent --show-error "$origin/ventas/api/v1/productos?size=1")
printf '%s' "$catalogo" | grep -q '"content"' || { echo 'El catálogo no devolvió una página JSON.' >&2; exit 1; }
estado=$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' "$origin/usuarios/api/v1/usuarios/me")
[ "$estado" = 401 ] || { echo "Usuarios debía rechazar la consulta sin token con 401, devolvió $estado." >&2; exit 1; }
estado=$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' "$origin/usuarios/api/v1/interno/usuarios/1")
[ "$estado" = 404 ] || { echo 'El canal interno no debe estar publicado.' >&2; exit 1; }
echo 'Frontend, ruta SPA, catálogo REST, autenticación y bloqueo del canal interno comprobados.'
