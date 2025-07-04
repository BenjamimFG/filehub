package br.com.projetounifor.filehub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;

import br.com.projetounifor.filehub.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityBeansConfig {

	private final UsuarioRepository usuarioRepository;

	@Bean
	UserDetailsService userDetailsService() {
		return username -> usuarioRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
	}
}
