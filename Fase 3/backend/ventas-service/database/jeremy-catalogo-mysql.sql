-- ====================================================================
-- FERRETERÍA LOS MAESTROS - MÓDULO CATÁLOGO E INVENTARIO (JEREMY)
-- Base de datos: losmaestros_ventas
-- ====================================================================

CREATE TABLE IF NOT EXISTS categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    categoria_id BIGINT NOT NULL,
    subcategoria VARCHAR(100),
    marca VARCHAR(100),
    unidad VARCHAR(50) DEFAULT 'Unidad',
    precio DECIMAL(19,2) NOT NULL,
    precio_compra DECIMAL(19,2) DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 0,
    en_oferta BOOLEAN NOT NULL DEFAULT FALSE,
    descuento INT NOT NULL DEFAULT 0,
    descripcion VARCHAR(1000),
    imagen VARCHAR(500),
    especificaciones VARCHAR(1000),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    INDEX idx_producto_codigo (codigo),
    INDEX idx_producto_categoria (categoria_id)
);

-- Inserción de Categorías
INSERT INTO categorias (id, nombre, descripcion, activo) VALUES
(1, 'Materiales de Construcción', 'Cementos, morteros, áridos y ladrillos para obra gruesa', TRUE),
(2, 'Pinturas', 'Látex, esmaltes al agua, barnices y accesorios', TRUE),
(3, 'Herramientas Manuales', 'Martillos, alicates, sierras y equipos de medición', TRUE),
(4, 'Herramientas Eléctricas', 'Taladros, esmeriles, sierras circulares e inalámbricos', TRUE),
(5, 'Gasfitería', 'Tuberías PVC, cobre, llaves de paso y sellos', TRUE),
(6, 'Electricidad', 'Cables conductores y disyuntores termomagnéticos', TRUE),
(7, 'Seguridad', 'Cascos, calzado de seguridad y guantes de faena', TRUE)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Inserción de los 27 Productos Oficiales del Caso
INSERT INTO productos (id, version, codigo, nombre, categoria_id, subcategoria, marca, unidad, precio, precio_compra, stock, stock_minimo, en_oferta, descuento, descripcion, imagen, especificaciones, activo) VALUES
(1, 0, 'MC001', 'Cemento Polpaico gris 25 kg', 1, 'Cementos', 'Polpaico', 'Saco', 5990.00, 3200.00, 80, 20, FALSE, 0, 'Cemento gris tradicional de alta resistencia para fundaciones y losas.', '/assets/img/productos/cemento.jpg', 'Cumple norma NCh148', TRUE),
(2, 0, 'MC002', 'Cemento Melón blanco 25 kg', 1, 'Cementos', 'Melón', 'Saco', 7490.00, 4100.00, 40, 10, FALSE, 0, 'Cemento blanco arquitectónico para terminaciones a la vista.', '/assets/img/productos/cemento-blanco.webp', 'Gran blancura, saco de 25 kg', TRUE),
(3, 0, 'MC003', 'Mortero cola cerámica 25 kg', 1, 'Morteros', 'Volcán', 'Saco', 5200.00, 2800.00, 50, 15, FALSE, 0, 'Adhesivo cementicio de alto agarre para revestimientos cerámicos.', '/assets/img/productos/mortero-adhesivo.webp', 'Rendimiento aprox 4 m2 por saco', TRUE),
(4, 0, 'MC004', 'Mortero nivelador piso 25 kg', 1, 'Morteros', 'Weber', 'Saco', 6490.00, 3500.00, 30, 10, FALSE, 0, 'Mortero autonivelante para regularización de radieres.', '/assets/img/productos/cemento.jpg', 'Espesor de 3 a 20 mm', TRUE),
(5, 0, 'MC005', 'Arena fina construcción 25 kg', 1, 'Áridos', 'Granel', 'Saco', 1800.00, 800.00, 60, 20, FALSE, 0, 'Arena de río harneada y lavada para estucos y revoques.', '/assets/img/productos/cemento.jpg', 'Granulometría fina uniforme', TRUE),
(6, 0, 'MC007', 'Ladrillo fiscal N°5', 1, 'Ladrillos', 'Local', 'Unidad', 380.00, 190.00, 500, 100, FALSE, 0, 'Ladrillo de arcilla cocida artesanal de alta solidez estructural.', '/assets/img/productos/cemento.jpg', 'Dimensiones aprox 28 x 14 x 5 cm', TRUE),

(7, 0, 'PT001', 'Pintura látex interior 1 galón blanco', 2, 'Látex', 'Sipa', 'Galón', 9990.00, 5200.00, 40, 10, TRUE, 15, 'Pintura látex base agua con alta lavabilidad para muros interiores.', '/assets/img/productos/pintura.jpg', 'Acabado mate, galón 3.785 L', TRUE),
(8, 0, 'PT002', 'Esmalte al agua semibrillo blanco 1 galón', 2, 'Esmaltes', 'Ceresita', 'Galón', 12990.00, 6800.00, 30, 8, FALSE, 0, 'Esmalte hidrorepelente formulado contra hongos y humedad.', '/assets/img/productos/pintura.jpg', 'Terminación satinada lavable', TRUE),
(9, 0, 'PT003', 'Barniz marino intemperie 1 galón', 2, 'Barnices', 'Tricolor', 'Galón', 13990.00, 7200.00, 25, 8, FALSE, 0, 'Barniz poliuretano de alta protección UV y salinidad costera.', '/assets/img/productos/pintura.jpg', 'Protección maderas expuestas', TRUE),
(10, 0, 'PT004', 'Brocha cerda rubia 3 pulgadas', 2, 'Accesorios', 'Cóndor', 'Unidad', 4290.00, 2100.00, 50, 15, FALSE, 0, 'Brocha profesional con cerdas compactas para acabado homogéneo.', '/assets/img/productos/pintura.jpg', 'Ancho 3 pulgadas (76 mm)', TRUE),

(11, 0, 'HM001', 'Martillo carpintero 500g', 3, 'Martillos', 'Stanley', 'Unidad', 7990.00, 3800.00, 20, 10, FALSE, 0, 'Martillo de uña curva de acero forjado y mango antigolpes.', '/assets/img/productos/martillo.jpg', 'Peso cabeza 500 g, grip antideslizante', TRUE),
(12, 0, 'HM002', 'Alicate universal 8 pulgadas', 3, 'Alicates', 'Bahco', 'Unidad', 9490.00, 4800.00, 30, 10, FALSE, 0, 'Alicate universal cromado con filo templado de precisión.', '/assets/img/productos/martillo.jpg', 'Largo 200 mm, aislación 1000V', TRUE),
(13, 0, 'HM003', 'Sierra caladora manual 12 pulgadas', 3, 'Sierras', 'Stanley', 'Unidad', 6990.00, 3200.00, 18, 6, FALSE, 0, 'Arco de sierra con hoja bimetálica para corte de metales.', '/assets/img/productos/martillo.jpg', 'Hoja 300 mm, 24 TPI', TRUE),
(14, 0, 'HM004', 'Nivel torpedo aluminio 9 pulgadas', 3, 'Medición', 'Stanley', 'Unidad', 5990.00, 2800.00, 25, 8, FALSE, 0, 'Nivel magnético compacto con 3 burbujas (0°, 45° y 90°).', '/assets/img/productos/martillo.jpg', 'Base imantada, aluminio inyectado', TRUE),

(15, 0, 'HE001', 'Taladro percutor 650W 13mm', 4, 'Taladros', 'Makita', 'Unidad', 79990.00, 45000.00, 8, 5, TRUE, 20, 'Taladro percutor industrial con velocidad variable y mandril metálico.', '/assets/img/productos/taladro.jpg', '650W, 0-2800 RPM', TRUE),
(16, 0, 'HE002', 'Esmeril angular 4-1/2\" 850W', 4, 'Esmeriles', 'Bosch', 'Unidad', 54990.00, 32000.00, 12, 4, FALSE, 0, 'Amoladora angular para corte y desbaste en metal y albañilería.', '/assets/img/productos/taladro.jpg', 'Disco 115 mm, 11000 RPM', TRUE),
(17, 0, 'HE003', 'Sierra circular 7-1/4\" 1400W', 4, 'Sierras', 'DeWalt', 'Unidad', 89990.00, 52000.00, 6, 3, FALSE, 0, 'Sierra circular de alta precisión con corte en bisel hasta 45°.', '/assets/img/productos/taladro.jpg', '1400W, disco 24 dientes carburo', TRUE),
(18, 0, 'HE004', 'Atornillador inalámbrico 12V con 2 baterías', 4, 'Atornilladores', 'Makita', 'Unidad', 42990.00, 25000.00, 4, 5, TRUE, 10, 'Taladro atornillador compacto con 18 posiciones de torque y LED.', '/assets/img/productos/taladro.jpg', 'Batería Litio-Ion 12V 1.5Ah', TRUE),

(19, 0, 'GS001', 'Cañería PVC 1/2\" x 6m', 5, 'Tuberías', 'Tigre', 'Tira', 5490.00, 2800.00, 30, 15, FALSE, 0, 'Tubería de PVC hidráulica clase 10 para agua potable.', '/assets/img/productos/tuberia-pvc.jpg', 'Diámetro 1/2 pulgada, largo 6 m', TRUE),
(20, 0, 'GS002', 'Tubería cobre tipo L 1/2\" x 6m', 5, 'Tuberías', 'Madeco', 'Tira', 18990.00, 11000.00, 20, 8, FALSE, 0, 'Tubería de cobre rígida sin costura para agua y gas.', '/assets/img/productos/tuberia-pvc.jpg', 'Tipo L según norma chilena', TRUE),
(21, 0, 'GS003', 'Llave de paso esférica 1/2\" HI-HI', 5, 'Válvulas', 'Nibsa', 'Unidad', 4990.00, 2400.00, 40, 10, FALSE, 0, 'Válvula de corte esférica en bronce niquelado con palanca.', '/assets/img/productos/tuberia-pvc.jpg', 'Paso total, 400 PSI', TRUE),
(22, 0, 'GS004', 'Cinta teflón 3/4\" x 10m', 5, 'Sellos', 'Hoffens', 'Unidad', 990.00, 400.00, 120, 30, FALSE, 0, 'Cinta de PTFE de alta densidad para sellado hermético roscado.', '/assets/img/productos/tuberia-pvc.jpg', 'Ancho 19 mm, largo 10 m', TRUE),

(23, 0, 'EL001', 'Cable unipolar EVA 1.5mm² 100m blanco', 6, 'Conductores', 'Covisa', 'Rollo', 24990.00, 14000.00, 15, 5, FALSE, 0, 'Conductor de cobre libre de halógenos no propagador de incendios.', '/assets/img/productos/taladro.jpg', '1.5 mm2, rollo 100m, SEC', TRUE),
(24, 0, 'EL002', 'Disyuntor termomagnético bipolar 16A', 6, 'Protecciones', 'Legrand', 'Unidad', 5990.00, 3100.00, 25, 8, FALSE, 0, 'Automático bipolar para riel DIN contra sobrecargas y cortocircuitos.', '/assets/img/productos/taladro.jpg', 'Curva C, 6 kA, 16A', TRUE),

(25, 0, 'SE001', 'Casco seguridad blanco con arnés', 7, 'Protección Cabeza', '3M', 'Unidad', 6990.00, 3500.00, 15, 10, FALSE, 0, 'Casco dieléctrico de alta densidad con suspensión de 4 puntos.', '/assets/img/productos/casco.jpg', 'Norma NCh461 clase A', TRUE),
(26, 0, 'SE004', 'Zapatos de seguridad punta de acero N°42', 7, 'Calzado', 'Norseg', 'Par', 32990.00, 18000.00, 2, 4, TRUE, 15, 'Botín de cuero hidrofugado con puntera de acero templado.', '/assets/img/productos/casco.jpg', 'Talla 42, plantilla antiperforación', TRUE),
(27, 0, 'SE005', 'Guantes de seguridad cabritilla para faena', 7, 'Protección Manos', '3M', 'Par', 4990.00, 2200.00, 3, 6, FALSE, 0, 'Guantes de cuero cabritilla flexible de alta resistencia mecánica.', '/assets/img/productos/casco.jpg', 'Talla 9/L, costuras reforzadas', TRUE)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);
