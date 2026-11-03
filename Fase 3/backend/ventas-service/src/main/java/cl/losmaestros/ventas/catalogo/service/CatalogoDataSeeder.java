package cl.losmaestros.ventas.catalogo.service;

import cl.losmaestros.ventas.catalogo.entity.Categoria;
import cl.losmaestros.ventas.catalogo.entity.Producto;
import cl.losmaestros.ventas.catalogo.repository.CategoriaRepository;
import cl.losmaestros.ventas.catalogo.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Component
@Order(10)
public class CatalogoDataSeeder implements CommandLineRunner {

    private final CategoriaRepository categoriaRepo;
    private final ProductoRepository productoRepo;

    public CatalogoDataSeeder(CategoriaRepository categoriaRepo, ProductoRepository productoRepo) {
        this.categoriaRepo = categoriaRepo;
        this.productoRepo = productoRepo;
    }

    @Override
    public void run(String... args) {
        if (productoRepo.count() > 0) {
            return;
        }

        // 1. Crear las 7 categorías oficiales
        String[] nombresCategorias = {
            "Materiales de Construcción",
            "Pinturas",
            "Herramientas Manuales",
            "Herramientas Eléctricas",
            "Gasfitería",
            "Electricidad",
            "Seguridad"
        };

        Map<String, Categoria> catMap = new HashMap<>();
        for (String nombre : nombresCategorias) {
            var cat = categoriaRepo.findByNombreIgnoreCase(nombre)
                    .orElseGet(() -> categoriaRepo.save(new Categoria(nombre, "Familia especializada de " + nombre)));
            catMap.put(nombre, cat);
        }

        // 2. Sembrar los 27 productos del caso
        crear(catMap, "MC001", "Cemento Polpaico gris 25 kg", "Materiales de Construcción", "Cementos", "Polpaico", "Saco", 5990, 3200, 80, 20, false, 0,
                "Cemento gris tradicional de alta resistencia para fundaciones y losas.", "/assets/img/productos/cemento.jpg", "Cumple norma NCh148");

        crear(catMap, "MC002", "Cemento Melón blanco 25 kg", "Materiales de Construcción", "Cementos", "Melón", "Saco", 7490, 4100, 40, 10, false, 0,
                "Cemento blanco arquitectónico para terminaciones a la vista.", "/assets/img/productos/cemento-blanco.webp", "Gran blancura, saco de 25 kg");

        crear(catMap, "MC003", "Mortero cola cerámica 25 kg", "Materiales de Construcción", "Morteros", "Volcán", "Saco", 5200, 2800, 50, 15, false, 0,
                "Adhesivo cementicio de alto agarre para revestimientos cerámicos.", "/assets/img/productos/mortero-adhesivo.webp", "Rendimiento aprox 4 m2 por saco");

        crear(catMap, "MC004", "Mortero nivelador piso 25 kg", "Materiales de Construcción", "Morteros", "Weber", "Saco", 6490, 3500, 30, 10, false, 0,
                "Mortero autonivelante para regularización de radieres.", "/assets/img/productos/cemento.jpg", "Espesor de 3 a 20 mm");

        crear(catMap, "MC005", "Arena fina construcción 25 kg", "Materiales de Construcción", "Áridos", "Granel", "Saco", 1800, 800, 60, 20, false, 0,
                "Arena de río harneada y lavada para estucos y revoques.", "/assets/img/productos/cemento.jpg", "Granulometría fina uniforme");

        crear(catMap, "MC007", "Ladrillo fiscal N°5", "Materiales de Construcción", "Ladrillos", "Local", "Unidad", 380, 190, 500, 100, false, 0,
                "Ladrillo de arcilla cocida artesanal de alta solidez estructural.", "/assets/img/productos/cemento.jpg", "Dimensiones aprox 28 x 14 x 5 cm");

        // Pinturas
        crear(catMap, "PT001", "Pintura látex interior 1 galón blanco", "Pinturas", "Látex", "Sipa", "Galón", 9990, 5200, 40, 10, true, 15,
                "Pintura látex base agua con alta lavabilidad para muros interiores.", "/assets/img/productos/pintura.jpg", "Acabado mate, galón 3.785 L");

        crear(catMap, "PT002", "Esmalte al agua semibrillo blanco 1 galón", "Pinturas", "Esmaltes", "Ceresita", "Galón", 12990, 6800, 30, 8, false, 0,
                "Esmalte hidrorepelente formulado contra hongos y humedad.", "/assets/img/productos/pintura.jpg", "Terminación satinada lavable");

        crear(catMap, "PT003", "Barniz marino intemperie 1 galón", "Pinturas", "Barnices", "Tricolor", "Galón", 13990, 7200, 25, 8, false, 0,
                "Barniz poliuretano de alta protección UV y salinidad costera.", "/assets/img/productos/pintura.jpg", "Protección maderas expuestas");

        crear(catMap, "PT004", "Brocha cerda rubia 3 pulgadas", "Pinturas", "Accesorios", "Cóndor", "Unidad", 4290, 2100, 50, 15, false, 0,
                "Brocha profesional con cerdas compactas para acabado homogéneo.", "/assets/img/productos/pintura.jpg", "Ancho 3 pulgadas (76 mm)");

        // Herramientas Manuales
        crear(catMap, "HM001", "Martillo carpintero 500g", "Herramientas Manuales", "Martillos", "Stanley", "Unidad", 7990, 3800, 20, 10, false, 0,
                "Martillo de uña curva de acero forjado y mango antigolpes.", "/assets/img/productos/martillo.jpg", "Peso cabeza 500 g, grip antideslizante");

        crear(catMap, "HM002", "Alicate universal 8 pulgadas", "Herramientas Manuales", "Alicates", "Bahco", "Unidad", 9490, 4800, 30, 10, false, 0,
                "Alicate universal cromado con filo templado de precisión.", "/assets/img/productos/martillo.jpg", "Largo 200 mm, aislación 1000V");

        crear(catMap, "HM003", "Sierra caladora manual 12 pulgadas", "Herramientas Manuales", "Sierras", "Stanley", "Unidad", 6990, 3200, 18, 6, false, 0,
                "Arco de sierra con hoja bimetálica para corte de metales.", "/assets/img/productos/martillo.jpg", "Hoja 300 mm, 24 TPI");

        crear(catMap, "HM004", "Nivel torpedo aluminio 9 pulgadas", "Herramientas Manuales", "Medición", "Stanley", "Unidad", 5990, 2800, 25, 8, false, 0,
                "Nivel magnético compacto con 3 burbujas (0°, 45° y 90°).", "/assets/img/productos/martillo.jpg", "Base imantada, aluminio inyectado");

        // Herramientas Eléctricas
        crear(catMap, "HE001", "Taladro percutor 650W 13mm", "Herramientas Eléctricas", "Taladros", "Makita", "Unidad", 79990, 45000, 8, 5, true, 20,
                "Taladro percutor industrial con velocidad variable y mandril metálico.", "/assets/img/productos/taladro.jpg", "650W, 0-2800 RPM");

        crear(catMap, "HE002", "Esmeril angular 4-1/2\" 850W", "Herramientas Eléctricas", "Esmeriles", "Bosch", "Unidad", 54990, 32000, 12, 4, false, 0,
                "Amoladora angular para corte y desbaste en metal y albañilería.", "/assets/img/productos/taladro.jpg", "Disco 115 mm, 11000 RPM");

        crear(catMap, "HE003", "Sierra circular 7-1/4\" 1400W", "Herramientas Eléctricas", "Sierras", "DeWalt", "Unidad", 89990, 52000, 6, 3, false, 0,
                "Sierra circular de alta precisión con corte en bisel hasta 45°.", "/assets/img/productos/taladro.jpg", "1400W, disco 24 dientes carburo");

        // Stock Crítico 1: HE004 (stock 4 <= stockMinimo 5)
        crear(catMap, "HE004", "Atornillador inalámbrico 12V con 2 baterías", "Herramientas Eléctricas", "Atornilladores", "Makita", "Unidad", 42990, 25000, 4, 5, true, 10,
                "Taladro atornillador compacto con 18 posiciones de torque y LED.", "/assets/img/productos/taladro.jpg", "Batería Litio-Ion 12V 1.5Ah");

        // Gasfitería
        crear(catMap, "GS001", "Cañería PVC 1/2\" x 6m", "Gasfitería", "Tuberías", "Tigre", "Tira", 5490, 2800, 30, 15, false, 0,
                "Tubería de PVC hidráulica clase 10 para agua potable.", "/assets/img/productos/tuberia-pvc.jpg", "Diámetro 1/2 pulgada, largo 6 m");

        crear(catMap, "GS002", "Tubería cobre tipo L 1/2\" x 6m", "Gasfitería", "Tuberías", "Madeco", "Tira", 18990, 11000, 20, 8, false, 0,
                "Tubería de cobre rígida sin costura para agua y gas.", "/assets/img/productos/tuberia-pvc.jpg", "Tipo L según norma chilena");

        crear(catMap, "GS003", "Llave de paso esférica 1/2\" HI-HI", "Gasfitería", "Válvulas", "Nibsa", "Unidad", 4990, 2400, 40, 10, false, 0,
                "Válvula de corte esférica en bronce niquelado con palanca.", "/assets/img/productos/tuberia-pvc.jpg", "Paso total, 400 PSI");

        crear(catMap, "GS004", "Cinta teflón 3/4\" x 10m", "Gasfitería", "Sellos", "Hoffens", "Unidad", 990, 400, 120, 30, false, 0,
                "Cinta de PTFE de alta densidad para sellado hermético roscado.", "/assets/img/productos/tuberia-pvc.jpg", "Ancho 19 mm, largo 10 m");

        // Electricidad
        crear(catMap, "EL001", "Cable unipolar EVA 1.5mm² 100m blanco", "Electricidad", "Conductores", "Covisa", "Rollo", 24990, 14000, 15, 5, false, 0,
                "Conductor de cobre libre de halógenos no propagador de incendios.", "/assets/img/productos/taladro.jpg", "1.5 mm2, rollo 100m, SEC");

        crear(catMap, "EL002", "Disyuntor termomagnético bipolar 16A", "Electricidad", "Protecciones", "Legrand", "Unidad", 5990, 3100, 25, 8, false, 0,
                "Automático bipolar para riel DIN contra sobrecargas y cortocircuitos.", "/assets/img/productos/taladro.jpg", "Curva C, 6 kA, 16A");

        // Seguridad
        crear(catMap, "SE001", "Casco seguridad blanco con arnés", "Seguridad", "Protección Cabeza", "3M", "Unidad", 6990, 3500, 15, 10, false, 0,
                "Casco dieléctrico de alta densidad con suspensión de 4 puntos.", "/assets/img/productos/casco.jpg", "Norma NCh461 clase A");

        // Stock Crítico 2: SE004 (stock 2 <= stockMinimo 4)
        crear(catMap, "SE004", "Zapatos de seguridad punta de acero N°42", "Seguridad", "Calzado", "Norseg", "Par", 32990, 18000, 2, 4, true, 15,
                "Botín de cuero hidrofugado con puntera de acero templado.", "/assets/img/productos/casco.jpg", "Talla 42, plantilla antiperforación");

        // Stock Crítico 3: SE005 (stock 3 <= stockMinimo 6)
        crear(catMap, "SE005", "Guantes de seguridad cabritilla para faena", "Seguridad", "Protección Manos", "3M", "Par", 4990, 2200, 3, 6, false, 0,
                "Guantes de cuero cabritilla flexible de alta resistencia mecánica.", "/assets/img/productos/casco.jpg", "Talla 9/L, costuras reforzadas");
    }

    private void crear(Map<String, Categoria> catMap, String codigo, String nombre, String catNombre, String sub,
                       String marca, String unidad, int precio, int compra, int stock, int min, boolean oferta, int desc,
                       String descrip, String img, String espec) {
        var cat = catMap.get(catNombre);
        var p = new Producto(codigo, nombre, cat, sub, marca, unidad,
                BigDecimal.valueOf(precio), BigDecimal.valueOf(compra), stock, min, oferta, desc, descrip, img, espec);
        productoRepo.save(p);
    }
}
