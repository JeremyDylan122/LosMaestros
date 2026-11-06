#requires -Version 7.0
$ErrorActionPreference = 'Stop'
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)

function Leer-Configuracion([string] $Ruta) {
    if (-not (Test-Path -LiteralPath $Ruta)) {
        throw "Falta $Ruta. Completa su .env.example y guárdalo como .env."
    }
    $valores = @{}
    foreach ($linea in [IO.File]::ReadAllLines($Ruta)) {
        if ([string]::IsNullOrWhiteSpace($linea) -or $linea.TrimStart().StartsWith('#')) { continue }
        $partes = $linea.Split('=', 2)
        if ($partes.Length -ne 2) { throw "Formato inválido en $Ruta." }
        $valores[$partes[0].Trim()] = $partes[1]
    }
    return $valores
}

function Literal-Sql([string] $Valor) {
    if ([string]::IsNullOrWhiteSpace($Valor) -or $Valor.StartsWith('<')) {
        throw 'Completa las contraseñas en los archivos .env antes de preparar MySQL.'
    }
    return "'" + $Valor.Replace("'", "''") + "'"
}

function Ejecutar-Sql([string] $Consulta, [string] $Base = '') {
    $argumentos = @('exec', '--interactive', '--env', 'MYSQL_PWD', 'losmaestros-mysql',
        'mysql', '--user=root', '--default-character-set=utf8mb4', '--batch')
    if ($Base) { $argumentos += $Base }
    $Consulta | & docker @argumentos
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo ejecutar el SQL. Revisa el error anterior.' }
}

$mysql = Leer-Configuracion (Join-Path $PSScriptRoot '.env')
$usuarios = Leer-Configuracion (Join-Path $PSScriptRoot 'usuarios-service/.env')
$ventas = Leer-Configuracion (Join-Path $PSScriptRoot 'ventas-service/.env')
$claveUsuarios = Literal-Sql $usuarios.DB_PASSWORD
$claveVentas = Literal-Sql $ventas.DB_PASSWORD
$null = Literal-Sql $mysql.MYSQL_ROOT_PASSWORD
if ($usuarios.DB_USERNAME -ne 'lm_usuarios' -or $ventas.DB_USERNAME -ne 'lm_ventas') {
    throw 'Configura DB_USERNAME como lm_usuarios y lm_ventas en los respectivos servicios.'
}

& docker compose --env-file (Join-Path $PSScriptRoot '.env') -f (Join-Path $PSScriptRoot 'compose.yaml') up --detach
if ($LASTEXITCODE -ne 0) { throw 'No se pudo iniciar MySQL.' }

$disponible = $false
for ($intento = 0; $intento -lt 60; $intento++) {
    $estado = & docker inspect --format '{{.State.Health.Status}}' losmaestros-mysql
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo consultar el estado de MySQL.' }
    if ($estado -eq 'healthy') { $disponible = $true; break }
    Start-Sleep -Seconds 2
}
if (-not $disponible) { throw 'MySQL no estuvo disponible en dos minutos.' }

$claveAnterior = $env:MYSQL_PWD
try {
    $env:MYSQL_PWD = $mysql.MYSQL_ROOT_PASSWORD
    # El modo de esta sesión permite escapar comillas sin interpretar barras invertidas.
    Ejecutar-Sql @"
SET SESSION sql_mode = 'NO_BACKSLASH_ESCAPES';
CREATE DATABASE IF NOT EXISTS losmaestros_usuarios CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS losmaestros_ventas CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER IF NOT EXISTS 'lm_usuarios'@'%' IDENTIFIED BY $claveUsuarios;
CREATE USER IF NOT EXISTS 'lm_ventas'@'%' IDENTIFIED BY $claveVentas;
GRANT SELECT, INSERT, UPDATE, DELETE ON losmaestros_usuarios.* TO 'lm_usuarios'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON losmaestros_ventas.* TO 'lm_ventas'@'%';
"@
    Ejecutar-Sql ([IO.File]::ReadAllText((Join-Path $PSScriptRoot 'usuarios-service/database/usuarios-mysql.sql'))) 'losmaestros_usuarios'
    Ejecutar-Sql ([IO.File]::ReadAllText((Join-Path $PSScriptRoot 'ventas-service/database/jeremy-catalogo-mysql.sql'))) 'losmaestros_ventas'
    Ejecutar-Sql ([IO.File]::ReadAllText((Join-Path $PSScriptRoot 'ventas-service/database/seba-mysql.sql'))) 'losmaestros_ventas'
    Write-Output 'MySQL preparado en localhost:3307 con las dos bases y sus usuarios.'
} finally {
    $env:MYSQL_PWD = $claveAnterior
}
