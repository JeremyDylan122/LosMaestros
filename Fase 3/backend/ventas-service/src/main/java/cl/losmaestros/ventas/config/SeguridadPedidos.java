package cl.losmaestros.ventas.config;

import org.springframework.context.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.converter.RsaKeyConverters;
import java.nio.charset.StandardCharsets;

@Configuration
public class SeguridadPedidos {
    @Bean
    @ConditionalOnMissingBean(JwtDecoder.class)
    JwtDecoder pedidosDecoder(@Value("${ventas.jwt.public-key-location:}") String clave,
            @Value("${ventas.jwt.issuer:losmaestros-usuarios}") String issuer, ResourceLoader recursos) throws Exception {
        // Arranque sin la parte de Martín permitido, pero ningún token se acepta sin su clave.
        if (clave.isBlank()) return token -> { throw new BadJwtException("Falta configurar la clave pública de Usuarios."); };
        try (var entrada=recursos.getResource(clave).getInputStream()) {
            var decoder=NimbusJwtDecoder.withPublicKey(RsaKeyConverters.x509().convert(entrada)).build();
            var habituales=JwtValidators.createDefaultWithIssuer(issuer);
            decoder.setJwtValidator(jwt -> {
                var resultado=habituales.validate(jwt);
                if (resultado.hasErrors()) return resultado;
                if (jwt.getExpiresAt()==null || jwt.getSubject()==null)
                    return org.springframework.security.oauth2.core.OAuth2TokenValidatorResult.failure(
                        new org.springframework.security.oauth2.core.OAuth2Error("invalid_token","Se requieren sub y exp",null));
                return resultado;
            });
            return decoder;
        }
    }
    @Bean @Order(1)
    SecurityFilterChain pedidos(HttpSecurity http,JwtDecoder decoder) throws Exception {
        var roles=new JwtGrantedAuthoritiesConverter();
        roles.setAuthoritiesClaimName("roles"); roles.setAuthorityPrefix("ROLE_");
        var converter=new JwtAuthenticationConverter(); converter.setJwtGrantedAuthoritiesConverter(roles);
        return http.securityMatcher("/api/v1/pedidos/**","/api/v1/cuentas-corrientes/**")
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(a -> a
                .requestMatchers(HttpMethod.PATCH,"/api/v1/pedidos/*/estado").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,"/api/v1/cuentas-corrientes/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/v1/cuentas-corrientes/me").hasRole("CONTRATISTA")
                .requestMatchers(HttpMethod.POST,"/api/v1/pedidos").hasAnyRole("CLIENTE","CONTRATISTA","ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/v1/pedidos","/api/v1/pedidos/*").hasAnyRole("CLIENTE","CONTRATISTA","ADMIN","VENDEDOR")
                .anyRequest().denyAll())
            .oauth2ResourceServer(o -> o.jwt(j -> j.decoder(decoder).jwtAuthenticationConverter(converter))
                .authenticationEntryPoint((req,res,e) -> error(res,401,"Autenticación requerida o token inválido."))
                .accessDeniedHandler((req,res,e) -> error(res,403,"No tienes permiso para esta acción.")))
            .exceptionHandling(e -> e.accessDeniedHandler((req,res,ex) -> error(res,403,"No tienes permiso para esta acción.")))
            .build();
    }
    // Jeremy y Martín pueden agregar una cadena para catálogo antes de este cierre general.
    @Bean @Order(100)
    SecurityFilterChain restoVentas(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(a -> a
            .requestMatchers("/swagger-ui/**","/swagger-ui.html","/v3/api-docs/**").permitAll()
            .anyRequest().denyAll()).build();
    }
    private static void error(jakarta.servlet.http.HttpServletResponse res,int codigo,String mensaje) throws java.io.IOException {
        res.setStatus(codigo); res.setContentType("application/json"); res.setCharacterEncoding(StandardCharsets.UTF_8.name());
        res.getWriter().write("{\"mensaje\":\""+mensaje+"\"}");
    }
}
