package br.com.projetounifor.filehub.domain.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.projetounifor.filehub.domain.model.Usuario;

@ExtendWith(MockitoExtension.class)
class UsuarioRepositoryTest {

	@Mock
	private UsuarioRepository usuarioRepository;

	@Test
	void findByUsername_ShouldReturnUsuario() {
		// Arrange
		String username = "testuser";
		Usuario usuario = new Usuario();
		usuario.setId(1L);
		usuario.setUsername(username);
		usuario.setNome("Test User");
		usuario.setEmail("test@example.com");
		when(usuarioRepository.findByUsername(username)).thenReturn(Optional.of(usuario));

		// Act
		Optional<Usuario> result = usuarioRepository.findByUsername(username);

		// Assert
		assertTrue(result.isPresent(), "O usuário deve estar presente");
		assertEquals(usuario, result.get(), "O usuário retornado deve ser o esperado");
		assertEquals(username, result.get().getUsername(), "O username do usuário deve ser o esperado");
		assertEquals("Test User", result.get().getNome(), "O nome do usuário deve ser o esperado");
		verify(usuarioRepository, times(1)).findByUsername(username);
		verifyNoMoreInteractions(usuarioRepository);
	}

	@Test
	void findById_ShouldReturnUsuario() {
		// Arrange
		Long id = 1L;
		Usuario usuario = new Usuario();
		usuario.setId(id);
		usuario.setUsername("testuser");
		usuario.setNome("Test User");
		usuario.setEmail("test@example.com");
		when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuario));

		// Act
		Optional<Usuario> result = usuarioRepository.findById(id);

		// Assert
		assertTrue(result.isPresent(), "O usuário deve estar presente");
		assertEquals(usuario, result.get(), "O usuário retornado deve ser o esperado");
		assertEquals(id, result.get().getId(), "O ID do usuário deve ser o esperado");
		assertEquals("Test User", result.get().getNome(), "O nome do usuário deve ser o esperado");
		verify(usuarioRepository, times(1)).findById(id);
		verifyNoMoreInteractions(usuarioRepository);
	}

	@Test
	void save_ShouldReturnSavedUsuario() {
		// Arrange
		Usuario usuario = new Usuario();
		usuario.setId(1L);
		usuario.setUsername("testuser");
		usuario.setNome("Test User");
		usuario.setEmail("test@example.com");
		when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

		// Act
		Usuario result = usuarioRepository.save(usuario);

		// Assert
		assertNotNull(result, "O usuário salvo não deve ser nulo");
		assertEquals(usuario, result, "O usuário retornado deve ser o esperado");
		assertEquals(1L, result.getId(), "O ID do usuário deve ser o esperado");
		assertEquals("Test User", result.getNome(), "O nome do usuário deve ser o esperado");
		verify(usuarioRepository, times(1)).save(any(Usuario.class));
		verifyNoMoreInteractions(usuarioRepository);
	}

	@Test
	void findAll_ShouldReturnListOfUsuarios() {
		// Arrange
		Usuario usuario = new Usuario();
		usuario.setId(1L);
		usuario.setUsername("testuser");
		usuario.setNome("Test User");
		usuario.setEmail("test@example.com");
		List<Usuario> usuarios = List.of(usuario);
		when(usuarioRepository.findAll()).thenReturn(usuarios);

		// Act
		List<Usuario> result = usuarioRepository.findAll();

		// Assert
		assertNotNull(result, "A lista de usuários não deve ser nula");
		assertEquals(1, result.size(), "A lista deve conter exatamente um usuário");
		assertEquals(usuario, result.get(0), "O usuário retornado deve ser o esperado");
		assertEquals("Test User", result.get(0).getNome(), "O nome do usuário deve ser o esperado");
		verify(usuarioRepository, times(1)).findAll();
		verifyNoMoreInteractions(usuarioRepository);
	}

	@Test
	void deleteById_ShouldDeleteUsuario() {
		// Arrange
		Long id = 1L;
		doNothing().when(usuarioRepository).deleteById(id);

		// Act
		usuarioRepository.deleteById(id);

		// Assert
		verify(usuarioRepository, times(1)).deleteById(id);
		verifyNoMoreInteractions(usuarioRepository);
	}
}