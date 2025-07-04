package br.com.projetounifor.filehub.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.domain.model.enums.Perfil;
import br.com.projetounifor.filehub.domain.repository.UsuarioRepository;
import br.com.projetounifor.filehub.dto.UsuarioDTO;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

	@Mock
	private UsuarioRepository usuarioRepository;

	@Mock
	private PasswordEncoder passwordEncoder;

	@InjectMocks
	private UsuarioService usuarioService;

	@Test
	void cadastrar_ShouldCreateAndSaveUsuario() {
		// Arrange
		UsuarioDTO dto = new UsuarioDTO();
		dto.setNome("Test User");
		dto.setEmail("test@example.com");
		dto.setUsername("testuser");
		dto.setSenha("password");
		dto.setPerfil(Perfil.USUARIO);

		Usuario usuario = new Usuario();
		usuario.setId(1L);
		usuario.setNome("Test User");
		usuario.setEmail("test@example.com");
		usuario.setUsername("testuser");
		usuario.setSenha("encodedPassword");
		usuario.setPerfil(Perfil.USUARIO);

		when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
		when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

		// Act
		UsuarioDTO result = usuarioService.cadastrar(dto);

		// Assert
		assertNotNull(result, "O UsuarioDTO retornado não deve ser nulo");
		assertEquals(1L, result.getId(), "O ID do usuário deve ser o esperado");
		assertEquals("Test User", result.getNome(), "O nome do usuário deve ser o esperado");
		assertEquals("test@example.com", result.getEmail(), "O email do usuário deve ser o esperado");
		assertEquals("testuser", result.getUsername(), "O username do usuário deve ser o esperado");
		assertEquals(Perfil.USUARIO, result.getPerfil(), "O perfil do usuário deve ser o esperado");
		verify(passwordEncoder, times(1)).encode("password");
		verify(usuarioRepository, times(1)).save(any(Usuario.class));
	}

	@Test
	void buscarPorId_ShouldReturnUsuario() {
		// Arrange
		Long id = 1L;
		Usuario usuario = new Usuario();
		usuario.setId(id);
		usuario.setNome("Test User");
		usuario.setEmail("test@example.com");
		usuario.setUsername("testuser");
		usuario.setPerfil(Perfil.USUARIO);
		when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuario));

		// Act
		Usuario result = usuarioService.buscarPorId(id);

		// Assert
		assertNotNull(result, "O usuário retornado não deve ser nulo");
		assertEquals(id, result.getId(), "O ID do usuário deve ser o esperado");
		assertEquals("Test User", result.getNome(), "O nome do usuário deve ser o esperado");
		verify(usuarioRepository, times(1)).findById(id);
		verifyNoMoreInteractions(usuarioRepository);
		verifyNoInteractions(passwordEncoder);
	}

	@Test
	void buscarPorId_WhenUsuarioNotFound_ShouldThrowException() {
		// Arrange
		Long id = 1L;
		when(usuarioRepository.findById(id)).thenReturn(Optional.empty());

		// Act & Assert
		NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
			usuarioService.buscarPorId(id);
		});
		assertEquals("Usuário não encontrado com id: " + id, exception.getMessage(),
				"A mensagem de erro deve ser a esperada");
		verify(usuarioRepository, times(1)).findById(id);
		verifyNoMoreInteractions(usuarioRepository);
		verifyNoInteractions(passwordEncoder);
	}

	@Test
	void atualizar_ShouldUpdateUsuario() {
		// Arrange
		Long id = 1L;
		Usuario usuarioExistente = new Usuario();
		usuarioExistente.setId(id);
		usuarioExistente.setNome("Old User");
		usuarioExistente.setEmail("old@example.com");
		usuarioExistente.setUsername("olduser");
		usuarioExistente.setSenha("oldPassword");
		usuarioExistente.setPerfil(Perfil.USUARIO);

		Usuario usuarioAtualizado = new Usuario();
		usuarioAtualizado.setId(id);
		usuarioAtualizado.setNome("Updated User");
		usuarioAtualizado.setEmail("updated@example.com");
		usuarioAtualizado.setUsername("updateduser");
		usuarioAtualizado.setSenha("newPassword");
		usuarioAtualizado.setPerfil(Perfil.ADMIN);

		when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuarioExistente));
		when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioAtualizado);

		// Act
		Usuario result = usuarioService.atualizar(id, usuarioAtualizado);

		// Assert
		assertNotNull(result, "O usuário retornado não deve ser nulo");
		assertEquals(id, result.getId(), "O ID do usuário deve ser o esperado");
		assertEquals("Updated User", result.getNome(), "O nome do usuário deve ser o esperado");
		assertEquals("updated@example.com", result.getEmail(), "O email do usuário deve ser o esperado");
		assertEquals("updateduser", result.getUsername(), "O username do usuário deve ser o esperado");
		assertEquals(Perfil.ADMIN, result.getPerfil(), "O perfil do usuário deve ser o esperado");
		verify(usuarioRepository, times(1)).findById(id);
		verify(usuarioRepository, times(1)).save(any(Usuario.class));
		verifyNoMoreInteractions(usuarioRepository);
		verifyNoInteractions(passwordEncoder);
	}

	@Test
	void atualizar_WhenUsuarioNotFound_ShouldThrowException() {
		// Arrange
		Long id = 1L;
		Usuario usuarioAtualizado = new Usuario();
		when(usuarioRepository.findById(id)).thenReturn(Optional.empty());

		// Act & Assert
		NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
			usuarioService.atualizar(id, usuarioAtualizado);
		});
		assertEquals("Usuário não encontrado com id: " + id, exception.getMessage(),
				"A mensagem de erro deve ser a esperada");
		verify(usuarioRepository, times(1)).findById(id);
		verifyNoMoreInteractions(usuarioRepository);
		verifyNoInteractions(passwordEncoder);
	}

	@Test
	void deletar_ShouldDeleteUsuario() {
		// Arrange
		Long id = 1L;
		when(usuarioRepository.existsById(id)).thenReturn(true);
		doNothing().when(usuarioRepository).deleteById(id);

		// Act
		usuarioService.deletar(id);

		// Assert
		verify(usuarioRepository, times(1)).existsById(id);
		verify(usuarioRepository, times(1)).deleteById(id);
		verifyNoMoreInteractions(usuarioRepository);
		verifyNoInteractions(passwordEncoder);
	}

	@Test
	void deletar_WhenUsuarioNotFound_ShouldThrowException() {
		// Arrange
		Long id = 1L;
		when(usuarioRepository.existsById(id)).thenReturn(false);

		// Act & Assert
		NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
			usuarioService.deletar(id);
		});
		assertEquals("Usuário não encontrado com id: " + id, exception.getMessage(),
				"A mensagem de erro deve ser a esperada");
		verify(usuarioRepository, times(1)).existsById(id);
		verifyNoMoreInteractions(usuarioRepository);
		verifyNoInteractions(passwordEncoder);
	}

	@Test
	void toDTO_ShouldConvertUsuarioToDTO() {
		// Arrange
		Usuario usuario = new Usuario();
		usuario.setId(1L);
		usuario.setNome("Test User");
		usuario.setEmail("test@example.com");
		usuario.setUsername("testuser");
		usuario.setPerfil(Perfil.USUARIO);

		// Act
		UsuarioDTO result = usuarioService.toDTO(usuario);

		// Assert
		assertNotNull(result, "O UsuarioDTO não deve ser nulo");
		assertEquals(1L, result.getId(), "O ID deve ser o esperado");
		assertEquals("Test User", result.getNome(), "O nome deve ser o esperado");
		assertEquals("test@example.com", result.getEmail(), "O email deve ser o esperado");
		assertEquals("testuser", result.getUsername(), "O username deve ser o esperado");
		assertEquals(Perfil.USUARIO, result.getPerfil(), "O perfil deve ser o esperado");
		verifyNoInteractions(usuarioRepository, passwordEncoder);
	}

	@Test
	void fromDTO_ShouldConvertDTOToUsuario() {
		// Arrange
		UsuarioDTO dto = new UsuarioDTO();
		dto.setNome("Test User");
		dto.setEmail("test@example.com");
		dto.setUsername("testuser");
		dto.setSenha("password");
		dto.setPerfil(Perfil.USUARIO);

		// Act
		Usuario result = usuarioService.fromDTO(dto);

		// Assert
		assertNotNull(result, "O usuário não deve ser nulo");
		assertEquals("Test User", result.getNome(), "O nome deve ser o esperado");
		assertEquals("test@example.com", result.getEmail(), "O email deve ser o esperado");
		assertEquals("testuser", result.getUsername(), "O username deve ser o esperado");
		assertEquals("password", result.getSenha(), "A senha deve ser a esperada");
		assertEquals(Perfil.USUARIO, result.getPerfil(), "O perfil deve ser o esperado");
		verifyNoInteractions(usuarioRepository, passwordEncoder);
	}
}