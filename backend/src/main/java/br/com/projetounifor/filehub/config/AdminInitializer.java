package br.com.projetounifor.filehub.config;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.domain.model.enums.Perfil;
import br.com.projetounifor.filehub.domain.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdminInitializer {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        if (usuarioRepository.findByUsername("ADMIN").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setUsername("ADMIN");
            admin.setEmail("admin@example.com");
            admin.setSenha(passwordEncoder.encode("admin123"));
            admin.setPerfil(Perfil.ADMIN);
            usuarioRepository.save(admin);
            System.out.println("Usuário admin criado com sucesso.");
        }
    }
}
