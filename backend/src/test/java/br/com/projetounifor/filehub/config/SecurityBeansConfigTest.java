package br.com.projetounifor.filehub.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetailsService;

import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.domain.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class SecurityBeansConfigTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private SecurityBeansConfig securityBeansConfig;

    @Test
    void userDetailsService_WhenUsernameExists_ShouldReturnUsuario() {
        // Arrange
        String username = "testUser";
        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        when(usuarioRepository.findByUsername(username)).thenReturn(Optional.of(usuario));

        // Act
        UserDetailsService userDetailsService = securityBeansConfig.userDetailsService();
        var result = userDetailsService.loadUserByUsername(username);

        // Assert
        assertNotNull(result, "O usuário retornado não deve ser nulo");
        assertEquals(usuario, result, "O usuário retornado deve ser o mesmo do repositório");
        verify(usuarioRepository, times(1)).findByUsername(username);
        verifyNoMoreInteractions(usuarioRepository);
    }

    @Test
    void userDetailsService_WhenUsernameDoesNotExist_ShouldThrowRuntimeException() {
        // Arrange
        String username = "nonExistentUser";
        when(usuarioRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act & Assert
        UserDetailsService userDetailsService = securityBeansConfig.userDetailsService();
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userDetailsService.loadUserByUsername(username),
                "Deve lançar RuntimeException quando o usuário não é encontrado"
        );
        assertEquals("Usuário não encontrado", exception.getMessage(), 
                "A mensagem da exceção deve ser 'Usuário não encontrado'");
        verify(usuarioRepository, times(1)).findByUsername(username);
        verifyNoMoreInteractions(usuarioRepository);
    }
}