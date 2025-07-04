package br.com.projetounifor.filehub.config;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.domain.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class AdminInitializerTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminInitializer adminInitializer;

    @Test
    void init_WhenAdminDoesNotExist_ShouldCreateAdminUser() {
        // Arrange
        when(usuarioRepository.findByUsername("admin")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("admin123")).thenReturn("encodedPassword");

        // Act
        adminInitializer.init();

        // Assert
        verify(usuarioRepository, times(1)).findByUsername("admin");
        verify(passwordEncoder, times(1)).encode("admin123");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
        verifyNoMoreInteractions(usuarioRepository, passwordEncoder);
    }

    @Test
    void init_WhenAdminExists_ShouldNotCreateAdminUser() {
        // Arrange
        Usuario existingAdmin = new Usuario();
        existingAdmin.setUsername("admin");
        when(usuarioRepository.findByUsername("admin")).thenReturn(Optional.of(existingAdmin));

        // Act
        adminInitializer.init();

        // Assert
        verify(usuarioRepository, times(1)).findByUsername("admin");
        verifyNoInteractions(passwordEncoder);
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }
}