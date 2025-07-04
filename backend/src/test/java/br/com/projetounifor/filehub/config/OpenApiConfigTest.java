package br.com.projetounifor.filehub.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;

class OpenApiConfigTest {

    private final OpenApiConfig openApiConfig = new OpenApiConfig();

    @Test
    void customOpenAPI_ShouldReturnOpenAPIWithCorrectInfo() {
        // Act
        OpenAPI openAPI = openApiConfig.customOpenAPI();

        // Assert
        assertNotNull(openAPI, "O objeto OpenAPI não deve ser nulo");
        
        // Verifica as informações da API
        Info info = openAPI.getInfo();
        assertNotNull(info, "O objeto Info não deve ser nulo");
        assertEquals("API Demo", info.getTitle(), "O título da API deve ser 'API Demo'");
        assertEquals("1.0", info.getVersion(), "A versão da API deve ser '1.0'");
    }

    @Test
    void customOpenAPI_ShouldIncludeBearerAuthSecurityRequirement() {
        // Act
        OpenAPI openAPI = openApiConfig.customOpenAPI();

        // Assert
        List<SecurityRequirement> securityRequirements = openAPI.getSecurity();
        assertNotNull(securityRequirements, "A lista de requisitos de segurança não deve ser nula");
        assertEquals(1, securityRequirements.size(), "Deve haver exatamente um requisito de segurança");

        SecurityRequirement securityRequirement = securityRequirements.get(0);
        assertTrue(securityRequirement.containsKey("bearerAuth"), "O requisito de segurança deve incluir 'bearerAuth'");
        assertEquals(List.of(), securityRequirement.get("bearerAuth"), 
                "O requisito 'bearerAuth' deve ter uma lista vazia de escopos");
    }
}