#!/bin/sh
set -eu
cd "$(dirname "$0")"
umask 077

origin=${1:-http://localhost:8080}
port=${2:-8080}
origin=${origin%/}
bind=0.0.0.0
case "$origin" in http://localhost*|http://127.0.0.1*) bind=127.0.0.1;; esac
if ! printf '%s' "$origin" | grep -Eq '^https?://[A-Za-z0-9.-]+(:[0-9]+)?$'; then
    echo 'Usa una URL sin ruta, por ejemplo http://ec2-DNS.amazonaws.com.' >&2
    exit 1
fi
case "$port" in ''|*[!0-9]*) echo 'El puerto debe ser numérico.' >&2; exit 1;; esac
if [ "$port" -lt 1 ] || [ "$port" -gt 65535 ]; then
    echo 'El puerto debe estar entre 1 y 65535.' >&2; exit 1
fi
if [ -e .env ] || [ -e secrets ]; then
    echo 'Ya existe .env o secrets. Se conservan; edita PUBLIC_ORIGIN si cambió la dirección.' >&2
    exit 1
fi
command -v openssl >/dev/null 2>&1 || { echo 'Instala openssl antes de continuar.' >&2; exit 1; }
mkdir secrets
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out secrets/jwt-private.pem 2>/dev/null
openssl pkey -in secrets/jwt-private.pem -pubout -out secrets/jwt-public.pem
# La carpeta es privada en el host; Docker monta los archivos para el usuario app.
chmod 644 secrets/jwt-private.pem secrets/jwt-public.pem
cat > .env <<EOF
PUBLIC_ORIGIN=$origin
HTTP_BIND=$bind
HTTP_PORT=$port
USUARIOS_DB_ROOT_PASSWORD=$(openssl rand -hex 24)
USUARIOS_DB_PASSWORD=$(openssl rand -hex 24)
VENTAS_DB_ROOT_PASSWORD=$(openssl rand -hex 24)
VENTAS_DB_PASSWORD=$(openssl rand -hex 24)
INTERNAL_TOKEN=$(openssl rand -hex 32)
USUARIOS_ADMIN_PASSWORD=$(openssl rand -hex 5)
EOF
echo 'Configuración y claves creadas. No se imprimen contraseñas.'
echo 'Consulta USUARIOS_ADMIN_PASSWORD en .env para iniciar sesión como admin@duoc.cl.'
