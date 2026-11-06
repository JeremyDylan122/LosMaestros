package cl.losmaestros.usuarios.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.security.SecuritySchemes;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Usuarios de Los Maestros", version = "v1",
        description = "Registro, autenticación y administración de usuarios."))
@SecuritySchemes({
    @SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT"),
    @SecurityScheme(name = "serviceToken", type = SecuritySchemeType.APIKEY,
            in = SecuritySchemeIn.HEADER, paramName = "X-Service-Token")
})
public class OpenApiUsuarios {}
