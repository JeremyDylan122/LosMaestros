#!/bin/sh
# Actualiza la direccion publica al encender EC2 y conserva claves y datos.
set -eu
cd "$(dirname "$0")"
umask 077

[ -f .env ] || { echo 'Falta .env: ejecuta preparar.sh una sola vez.' >&2; exit 1; }
[ -f secrets/jwt-private.pem ] || { echo 'Falta la clave JWT existente.' >&2; exit 1; }

# IMDSv2 solo es accesible desde la instancia. No requiere claves de AWS.
metadata=http://169.254.169.254/latest
token=$(curl --noproxy '*' --fail --silent --show-error --connect-timeout 3 --max-time 10 \
    --retry 5 --retry-delay 2 --request PUT \
    --header 'X-aws-ec2-metadata-token-ttl-seconds: 60' "$metadata/api/token")
public_ip=$(curl --noproxy '*' --fail --silent --show-error --connect-timeout 3 --max-time 10 \
    --retry 5 --retry-delay 2 --header "X-aws-ec2-metadata-token: $token" \
    "$metadata/meta-data/public-ipv4")
printf '%s' "$public_ip" | grep -Eq '^([0-9]{1,3}\.){3}[0-9]{1,3}$' || {
    echo 'No se obtuvo una IPv4 publica valida.' >&2; exit 1;
}

# Este arranque corresponde al despliegue HTTP por IP, sin dominio propio.
temporary=$(mktemp .env.XXXXXX)
trap 'rm -f "$temporary"' EXIT HUP INT TERM
sed "s|^PUBLIC_ORIGIN=.*|PUBLIC_ORIGIN=http://$public_ip|" .env > "$temporary"
mv "$temporary" .env
trap - EXIT HUP INT TERM

echo "Iniciando Los Maestros en http://$public_ip"
docker compose up -d --no-build --wait --wait-timeout 480
sh verificar.sh "http://127.0.0.1:${HTTP_PORT:-80}"
