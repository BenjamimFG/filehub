package br.com.projetounifor.filehub;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
		info = @Info(
				title = "FileHub - Sistema GED",
				version = "1.0",
				description = "API para gerenciamento eletrônico de documentos (GED): permite upload, versionamento, controle de acesso e fluxo de aprovação de documentos.",
				contact = @Contact(
						name = "Equipe FileHub",
						email = "suporte@filehub.com"
				)
		)
)

public class FilehubApplication {

	public static void main(String[] args) {
		SpringApplication.run(FilehubApplication.class, args);
	}

}
