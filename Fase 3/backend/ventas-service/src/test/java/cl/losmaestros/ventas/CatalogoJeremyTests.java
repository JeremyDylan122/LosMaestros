package cl.losmaestros.ventas;

import cl.losmaestros.ventas.catalogo.dto.AjusteStockDto;
import cl.losmaestros.ventas.catalogo.dto.ProductoCreacionDto;
import cl.losmaestros.ventas.catalogo.repository.CategoriaRepository;
import cl.losmaestros.ventas.catalogo.repository.ProductoRepository;
import cl.losmaestros.ventas.catalogo.service.CatalogoPedidosAdapter;
import cl.losmaestros.ventas.exception.NegocioException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
class CatalogoJeremyTests {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired ProductoRepository productoRepo;
    @Autowired CategoriaRepository categoriaRepo;
    @Autowired CatalogoPedidosAdapter catalogoAdapter;

    RequestPostProcessor como(long id, String rol) {
        return jwt().jwt(j -> j.subject(Long.toString(id)))
                .authorities(new SimpleGrantedAuthority("ROLE_" + rol));
    }

    @Test
    @DisplayName("1. Consulta pública de catálogo, categorías y detalle sin autenticación")
    void consultaPublicaCatalogo() throws Exception {
        mvc.perform(get("/api/v1/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").value(org.hamcrest.Matchers.greaterThanOrEqualTo(27)));

        mvc.perform(get("/api/v1/categorias"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(org.hamcrest.Matchers.greaterThanOrEqualTo(7)));

        // Buscar producto MC001
        var prod = productoRepo.findByCodigoIgnoreCase("MC001").orElseThrow();
        mvc.perform(get("/api/v1/productos/" + prod.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codigo").value("MC001"))
                .andExpect(jsonPath("$.nombre").value("Cemento Polpaico gris 25 kg"))
                .andExpect(jsonPath("$.precio").value(5990));
    }

    @Test
    @DisplayName("2. Listado de stock crítico identifica productos bajo umbral mínimo")
    void stockCriticoIdentificaProductosBajoUmbral() throws Exception {
        mvc.perform(get("/api/v1/productos/criticos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(org.hamcrest.Matchers.greaterThanOrEqualTo(3)));
    }

    @Test
    @DisplayName("3. Administrador puede crear un nuevo producto exitosamente")
    @Transactional
    void adminPuedeCrearProducto() throws Exception {
        var cat = categoriaRepo.findAll().get(0);
        var nuevo = new ProductoCreacionDto(
                "TEST-SKU-99",
                "Taladro de impacto prueba 20V",
                cat.getId(),
                "Taladros",
                "DeWalt",
                "Unidad",
                BigDecimal.valueOf(99990),
                BigDecimal.valueOf(60000),
                15,
                5,
                false,
                0,
                "Taladro para pruebas unitarias",
                "/assets/img/test.jpg",
                "Especificaciones de test"
        );

        mvc.perform(post("/api/v1/productos")
                .with(como(99, "ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(nuevo)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.codigo").value("TEST-SKU-99"))
                .andExpect(jsonPath("$.nombre").value("Taladro de impacto prueba 20V"))
                .andExpect(jsonPath("$.precio").value(99990));

        assertThat(productoRepo.existsByCodigoIgnoreCase("TEST-SKU-99")).isTrue();
    }

    @Test
    @DisplayName("4. Vendedor es rechazado con 403 Forbidden al intentar crear o modificar productos")
    void vendedorRechazadoEnModificaciones() throws Exception {
        var cat = categoriaRepo.findAll().get(0);
        var dto = new ProductoCreacionDto(
                "FAIL-VEND-01",
                "Producto no permitido",
                cat.getId(),
                "General",
                "Generica",
                "Unidad",
                BigDecimal.valueOf(1000),
                BigDecimal.valueOf(500),
                10,
                2,
                false,
                0,
                "Desc",
                "",
                ""
        );

        // Vendedor intentando POST -> 403
        mvc.perform(post("/api/v1/productos")
                .with(como(2, "VENDEDOR"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(dto)))
                .andExpect(status().isForbidden());

        // Vendedor intentando PATCH de stock -> 403
        var prod = productoRepo.findByCodigoIgnoreCase("MC001").orElseThrow();
        var ajuste = new AjusteStockDto(5);
        mvc.perform(patch("/api/v1/productos/" + prod.getId() + "/stock")
                .with(como(2, "VENDEDOR"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(ajuste)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("5. Cliente o visitante sin token es rechazado con 401/403 en escrituras")
    void clienteOAnonimoRechazadoEnEscritura() throws Exception {
        var ajuste = new AjusteStockDto(1);

        // Anónimo -> 401
        mvc.perform(patch("/api/v1/productos/1/stock")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(ajuste)))
                .andExpect(status().isUnauthorized());

        // Cliente -> 403
        mvc.perform(patch("/api/v1/productos/1/stock")
                .with(como(10, "CLIENTE"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(ajuste)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("6. Administrador puede realizar ajuste rápido de stock (+5)")
    @Transactional
    void adminPuedeAjustarStock() throws Exception {
        var prod = productoRepo.findByCodigoIgnoreCase("MC001").orElseThrow();
        int stockInicial = prod.getStock();

        var ajuste = new AjusteStockDto(5);
        mvc.perform(patch("/api/v1/productos/" + prod.getId() + "/stock")
                .with(como(99, "ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(ajuste)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stock").value(stockInicial + 5));

        var actualizado = productoRepo.findById(prod.getId()).orElseThrow();
        assertThat(actualizado.getStock()).isEqualTo(stockInicial + 5);
    }

    @Test
    @DisplayName("7. Contrato CatalogoPedidos: calcula precio efectivo con descuento en ofertas")
    @Transactional
    void contratoCatalogoPedidosCalculaPrecioEfectivo() {
        // HE001: Taladro percutor (Precio 79990, enOferta true, descuento 20%)
        // Precio efectivo: 79990 * 0.8 = 63992.00
        var prod = productoRepo.findByCodigoIgnoreCase("HE001").orElseThrow();
        var bloqueado = catalogoAdapter.bloquear(prod.getId());

        assertThat(bloqueado.codigo()).isEqualTo("HE001");
        assertThat(bloqueado.precioUnitario()).isEqualByComparingTo(BigDecimal.valueOf(63992.00));
        assertThat(bloqueado.activo()).isTrue();
    }

    @Test
    @DisplayName("8. Contrato CatalogoPedidos: descontar y restituir stock dentro de la transacción")
    @Transactional
    void contratoCatalogoPedidosAjustarStock() {
        var prod = productoRepo.findByCodigoIgnoreCase("MC001").orElseThrow();
        int stockOriginal = prod.getStock();

        // Descontar 3 unidades (-3)
        catalogoAdapter.ajustarStock(prod.getId(), -3);
        var despuesDescuento = productoRepo.findById(prod.getId()).orElseThrow();
        assertThat(despuesDescuento.getStock()).isEqualTo(stockOriginal - 3);

        // Restituir 3 unidades (+3)
        catalogoAdapter.ajustarStock(prod.getId(), 3);
        var despuesRestitucion = productoRepo.findById(prod.getId()).orElseThrow();
        assertThat(despuesRestitucion.getStock()).isEqualTo(stockOriginal);

        // Intentar sobregirar stock -> debe lanzar NegocioException
        assertThatThrownBy(() -> catalogoAdapter.ajustarStock(prod.getId(), -(stockOriginal + 10)))
                .isInstanceOf(NegocioException.class)
                .hasMessageContaining("Stock insuficiente");
    }
}
