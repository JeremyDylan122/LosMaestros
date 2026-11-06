package cl.losmaestros.usuarios.config;

import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.JWKSet;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPublicKey;
import java.security.interfaces.RSAPrivateKey;
import java.util.List;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Profiles;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.converter.RsaKeyConverters;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.web.cors.*;

@Configuration
public class SeguridadUsuarios {
    @Bean
    @Order(1)
    SecurityFilterChain seguridadInterna(HttpSecurity http,
            @Value("${USUARIOS_INTERNAL_TOKEN:}") String secreto) throws Exception {
        return http.securityMatcher("/api/v1/interno/**")
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a
                        .requestMatchers(HttpMethod.GET, "/api/v1/interno/usuarios/*")
                        .access((autenticacion, contexto) -> {
                            String recibido = contexto.getRequest().getHeader("X-Service-Token");
                            boolean valido = !secreto.isBlank() && recibido != null
                                    && MessageDigest.isEqual(secreto.getBytes(StandardCharsets.UTF_8),
                                            recibido.getBytes(StandardCharsets.UTF_8));
                            return new AuthorizationDecision(valido);
                        })
                        .anyRequest().denyAll())
                .exceptionHandling(e -> e.authenticationEntryPoint((req, res, ex) -> res.sendError(401))
                        .accessDeniedHandler((req, res, ex) -> res.sendError(401)))
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    KeyPair clavesJwt(@Value("${USUARIOS_JWT_PUBLIC_KEY_LOCATION:}") String publica,
            @Value("${USUARIOS_JWT_PRIVATE_KEY_LOCATION:}") String privada,
            ResourceLoader recursos, Environment ambiente) throws Exception {
        if (publica.isBlank() && privada.isBlank() && ambiente.acceptsProfiles(Profiles.of("local"))) {
            var generador = KeyPairGenerator.getInstance("RSA");
            generador.initialize(2048);
            return generador.generateKeyPair();
        }
        if (publica.isBlank() || privada.isBlank()) {
            throw new IllegalStateException("Configura las claves pública y privada de Usuarios.");
        }
        try (var entradaPublica = recursos.getResource(publica).getInputStream();
                var entradaPrivada = recursos.getResource(privada).getInputStream()) {
            var clavePublica = RsaKeyConverters.x509().convert(entradaPublica);
            var clavePrivada = RsaKeyConverters.pkcs8().convert(entradaPrivada);
            if (!clavePublica.getModulus().equals(clavePrivada.getModulus())) {
                throw new IllegalStateException("Las claves JWT de Usuarios no corresponden al mismo par.");
            }
            return new KeyPair(clavePublica, clavePrivada);
        }
    }

    @Bean
    JwtEncoder jwtEncoder(KeyPair claves) {
        var llave = new RSAKey.Builder((RSAPublicKey) claves.getPublic())
                .privateKey((RSAPrivateKey) claves.getPrivate()).build();
        return new NimbusJwtEncoder(new ImmutableJWKSet<>(new JWKSet(llave)));
    }

    @Bean
    JwtDecoder jwtDecoder(KeyPair claves,
            @Value("${USUARIOS_JWT_ISSUER:losmaestros-usuarios}") String emisor) {
        var decoder = NimbusJwtDecoder.withPublicKey((RSAPublicKey) claves.getPublic()).build();
        decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(emisor));
        return decoder;
    }

    @Bean
    @Order(2)
    SecurityFilterChain seguridad(HttpSecurity http) throws Exception {
        var roles = new JwtGrantedAuthoritiesConverter();
        roles.setAuthoritiesClaimName("roles");
        roles.setAuthorityPrefix("ROLE_");
        var converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(roles);
        return http.cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/login", "/api/v1/auth/registro").permitAll()
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/usuarios/me").authenticated()
                        .requestMatchers("/api/v1/usuarios", "/api/v1/usuarios/**").hasRole("ADMIN")
                        .anyRequest().denyAll())
                .oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(converter)))
                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(
            @Value("${APP_CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:3000}") List<String> origenesPermitidos) {
        var cors = new CorsConfiguration();
        cors.setAllowedOrigins(origenesPermitidos);
        cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cors.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        var origenes = new UrlBasedCorsConfigurationSource();
        origenes.registerCorsConfiguration("/api/**", cors);
        return origenes;
    }
}
