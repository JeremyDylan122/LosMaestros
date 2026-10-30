-- Ejecutar sobre losmaestros_ventas antes de usar el perfil mysql.
-- Solo tablas de Seba. Catálogo queda a cargo de Jeremy.
CREATE TABLE IF NOT EXISTS cuentas_corrientes (
    usuario_id BIGINT PRIMARY KEY,
    version BIGINT NOT NULL,
    activa BOOLEAN NOT NULL,
    credito_maximo DECIMAL(19,2) NOT NULL,
    saldo_pendiente DECIMAL(19,2) NOT NULL
);
CREATE TABLE IF NOT EXISTS pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    version BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    fecha DATETIME(6) NOT NULL,
    estado VARCHAR(255) NOT NULL,
    delivery_type VARCHAR(255) NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    region VARCHAR(255),
    commune VARCHAR(255),
    address VARCHAR(300),
    phone VARCHAR(255),
    empresa VARCHAR(255),
    notes VARCHAR(500),
    subtotal DECIMAL(19,2) NOT NULL,
    shipping_fee DECIMAL(19,2) NOT NULL,
    total_monto DECIMAL(19,2) NOT NULL,
    INDEX idx_pedido_usuario (usuario_id)
);
CREATE TABLE IF NOT EXISTS detalle_pedido (
    pedido_id BIGINT NOT NULL,
    posicion INT NOT NULL,
    producto_id BIGINT NOT NULL,
    codigo VARCHAR(255),
    nombre VARCHAR(255),
    precio_unitario DECIMAL(19,2) NOT NULL,
    cantidad INT NOT NULL,
    subtotal DECIMAL(19,2) NOT NULL,
    PRIMARY KEY (pedido_id, posicion),
    CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);
