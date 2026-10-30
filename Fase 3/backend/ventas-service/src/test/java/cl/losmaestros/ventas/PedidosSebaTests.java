package cl.losmaestros.ventas;

import cl.losmaestros.ventas.pedidos.service.CatalogoPedidos;
import cl.losmaestros.ventas.cuentacorriente.service.UsuariosContratistas;
import cl.losmaestros.ventas.cuentacorriente.repository.CuentaRepository;
import cl.losmaestros.ventas.pedidos.repository.PedidoRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
@Import(PedidosSebaTests.Colaboradores.class)
class PedidosSebaTests {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired JdbcTemplate jdbc;
    @Autowired PedidoRepository pedidos;
    @Autowired CuentaRepository cuentas;

    // Solo en test: catálogo persistido en la MISMA transacción, no un stock en memoria.
    @TestConfiguration
    static class Colaboradores {
        @Bean UsuariosContratistas usuariosPrueba() { return id -> id==1; }
        @Bean CatalogoPedidos catalogoPrueba(JdbcTemplate jdbc) {
            return new CatalogoPedidos() {
                public Producto bloquear(long id) {
                    assertThat(TransactionSynchronizationManager.isActualTransactionActive()).isTrue();
                    return jdbc.queryForObject("select * from producto_prueba where id=? for update",
                        (rs,n) -> new Producto(rs.getLong("id"),"P"+id,"Producto "+id,rs.getBigDecimal("precio"),rs.getInt("stock"),true),id);
                }
                public void ajustarStock(long id,int delta) {
                    jdbc.update("update producto_prueba set stock=stock+? where id=?",delta,id);
                }
            };
        }
    }
    @BeforeEach
    void preparar() {
        pedidos.deleteAll(); cuentas.deleteAll();
        jdbc.execute("create table if not exists producto_prueba (id bigint primary key, precio decimal(19,2), stock int)");
        jdbc.update("delete from producto_prueba");
        jdbc.update("insert into producto_prueba values (1,10000,5),(2,8000,1)");
    }
    RequestPostProcessor como(long id,String rol) {
        return jwt().jwt(j -> j.subject(Long.toString(id))).authorities(new SimpleGrantedAuthority("ROLE_"+rol));
    }
    Map<String,Object> compra(String pago,String entrega,List<Map<String,Object>> items) {
        return Map.of("items",items,"deliveryType",entrega,"paymentMethod",pago,
            "customerName","Cliente de prueba","customerEmail","cliente@gmail.com",
            "region","Región de Coquimbo","commune","La Serena","address","Calle de prueba 123");
    }
    List<Map<String,Object>> unaLinea(int cantidad) { return List.of(Map.of("id",1,"cantidad",cantidad)); }
    long comprarCredito() throws Exception {
        return json.readTree(mvc.perform(post("/api/v1/pedidos").with(como(1,"CONTRATISTA"))
            .contentType("application/json").content(json.writeValueAsString(compra("CUENTA_CORRIENTE","RETIRO_TIENDA",unaLinea(2)))))
            .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString()).get("id").asLong();
    }
    int stock(long id) { return jdbc.queryForObject("select stock from producto_prueba where id=?",Integer.class,id); }
    void cuenta(int cupo,int saldo) throws Exception {
        mvc.perform(put("/api/v1/cuentas-corrientes/1").with(como(90,"ADMIN")).contentType("application/json")
            .content("{\"activa\":true,\"creditoMaximo\":"+cupo+"}")).andExpect(status().isOk());
        jdbc.update("update cuentas_corrientes set saldo_pendiente=? where usuario_id=1",saldo);
    }

    @Test
    void compraUsaPrecioServidorEIdentidadAutenticada() throws Exception {
        var request=new java.util.HashMap<>(compra("WEBPAY_SIMULADO","RETIRO_TIENDA",
            List.of(Map.of("id",1,"cantidad",2,"precioUnitario",1))));
        request.put("userId",999); request.put("totalMonto",2);
        mvc.perform(post("/api/v1/pedidos").with(como(1,"CLIENTE")).contentType("application/json").content(json.writeValueAsString(request)))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.userId").value(1))
            .andExpect(jsonPath("$.subtotal").value(20000)).andExpect(jsonPath("$.shippingFee").value(0))
            .andExpect(jsonPath("$.totalMonto").value(20000)).andExpect(jsonPath("$.items[0].precioUnitario").value(10000));
        assertThat(stock(1)).isEqualTo(3); assertThat(pedidos.count()).isEqualTo(1);
        mvc.perform(get("/api/v1/pedidos").with(como(1,"CLIENTE")))
            .andExpect(jsonPath("$.content[0].items[0].cantidad").value(2));
    }
    @Test
    void stockInsuficienteNoDejaCambiosParciales() throws Exception {
        cuenta(100000,0);
        var request=compra("CUENTA_CORRIENTE","RETIRO_TIENDA",List.of(Map.of("id",1,"cantidad",2),Map.of("id",2,"cantidad",2)));
        mvc.perform(post("/api/v1/pedidos").with(como(1,"CONTRATISTA")).contentType("application/json").content(json.writeValueAsString(request)))
            .andExpect(status().isConflict());
        assertThat(stock(1)).isEqualTo(5); assertThat(stock(2)).isEqualTo(1);
        assertThat(pedidos.count()).isZero(); assertThat(cuentas.findById(1L).orElseThrow().saldoPendiente).isEqualByComparingTo("0");
        assertThat(jdbc.queryForObject("select count(*) from detalle_pedido",Integer.class)).isZero();
    }
    @Test
    void creditoInsuficienteIncluyeFleteYRevierteStock() throws Exception {
        cuenta(100000,80000);
        jdbc.update("update producto_prueba set precio=18000 where id=1");
        mvc.perform(post("/api/v1/pedidos").with(como(1,"CONTRATISTA")).contentType("application/json")
            .content(json.writeValueAsString(compra("CUENTA_CORRIENTE","DESPACHO_OBRA",unaLinea(1)))))
            .andExpect(status().isConflict());
        assertThat(stock(1)).isEqualTo(5); assertThat(pedidos.count()).isZero();
        assertThat(cuentas.findById(1L).orElseThrow().saldoPendiente).isEqualByComparingTo("80000");
        assertThat(jdbc.queryForObject("select count(*) from detalle_pedido",Integer.class)).isZero();
    }
    @Test
    void anularDosVecesDevuelveStockYCreditoUnaVez() throws Exception {
        cuenta(100000,30000);
        long id=comprarCredito();
        assertThat(stock(1)).isEqualTo(3);
        assertThat(cuentas.findById(1L).orElseThrow().saldoPendiente).isEqualByComparingTo("50000");
        for (int i=0;i<2;i++) mvc.perform(patch("/api/v1/pedidos/"+id+"/estado").with(como(90,"ADMIN"))
            .contentType("application/json").content("{\"estado\":\"ANULADO\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.estadoPago").value("ANULADO"));
        assertThat(stock(1)).isEqualTo(5);
        assertThat(cuentas.findById(1L).orElseThrow().saldoPendiente).isEqualByComparingTo("30000");
    }
    @Test
    void pedidosRespetanIdentidadYPermisos() throws Exception {
        cuenta(100000,0); long id=comprarCredito();
        mvc.perform(get("/api/v1/pedidos/"+id)).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/pedidos/"+id).with(como(1,"CLIENTE"))).andExpect(status().isOk());
        mvc.perform(get("/api/v1/pedidos/"+id).with(como(2,"CLIENTE"))).andExpect(status().isNotFound());
        mvc.perform(get("/api/v1/pedidos").with(como(2,"CLIENTE"))).andExpect(jsonPath("$.totalElements").value(0));
        mvc.perform(get("/api/v1/pedidos/"+id).with(como(3,"VENDEDOR"))).andExpect(status().isOk());
        mvc.perform(patch("/api/v1/pedidos/"+id+"/estado").with(como(3,"VENDEDOR"))
            .contentType("application/json").content("{\"estado\":\"ANULADO\"}")).andExpect(status().isForbidden());
        assertThat(stock(1)).isEqualTo(3); assertThat(cuentas.findById(1L).orElseThrow().saldoPendiente).isEqualByComparingTo("20000");
        mvc.perform(get("/api/v1/cuentas-corrientes/me").with(como(2,"CLIENTE"))).andExpect(status().isForbidden());
        mvc.perform(get("/api/v1/cuentas-corrientes/me").with(como(1,"CONTRATISTA")))
            .andExpect(status().isOk()).andExpect(jsonPath("$.creditoDisponible").value(80000));
        mvc.perform(patch("/api/v1/pedidos/"+id+"/estado").with(como(90,"ADMIN"))
            .contentType("application/json").content("{\"estado\":\"EN_PREPARACION\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.estado").value("EN_PREPARACION"));
    }
}
