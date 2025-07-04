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
import java.util.Set;

import br.com.projetounifor.filehub.dto.ProjetoResponseDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.projetounifor.filehub.domain.model.Projeto;
import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.domain.repository.ProjetoRepository;
import br.com.projetounifor.filehub.domain.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class ProjetoServiceTest {

	@Mock
	private ProjetoRepository projetoRepository;

	@Mock
	private UsuarioRepository usuarioRepository;

	@InjectMocks
	private ProjetoService projetoService;

	@Test
	void criarProjeto_ShouldCreateAndSaveProjeto() {
		// Arrange
		String nome = "Projeto Teste";
		Long idCriador = 1L;
		List<Long> usuariosIds = List.of(2L);
		List<Long> aprovadoresIds = List.of(3L);
		Usuario criador = new Usuario();
		criador.setId(idCriador);
		Usuario usuario = new Usuario();
		usuario.setId(2L);
		Usuario aprovador = new Usuario();
		aprovador.setId(3L);
		Projeto projeto = new Projeto();
		projeto.setId(1L);
		projeto.setNome(nome);
		projeto.setCriador(criador);
		projeto.setUsuarios(Set.of(usuario));
		projeto.setAprovadores(Set.of(aprovador));

		when(usuarioRepository.findById(idCriador)).thenReturn(Optional.of(criador));
		when(usuarioRepository.findAllById(usuariosIds)).thenReturn(List.of(usuario));
		when(usuarioRepository.findAllById(aprovadoresIds)).thenReturn(List.of(aprovador));
		when(projetoRepository.save(any(Projeto.class))).thenReturn(projeto);

		// Act
		ProjetoResponseDTO result = projetoService.criarProjeto(nome, idCriador, usuariosIds, aprovadoresIds);

		// Assert
		assertNotNull(result, "O projeto retornado não deve ser nulo");
		assertEquals(1L, result.getId(), "O ID do projeto deve ser o esperado");
		assertEquals(nome, result.getNome(), "O nome do projeto deve ser o esperado");
		verify(usuarioRepository, times(1)).findById(idCriador);
		verify(usuarioRepository, times(1)).findAllById(usuariosIds);
		verify(usuarioRepository, times(1)).findAllById(aprovadoresIds);
		verify(projetoRepository, times(1)).save(any(Projeto.class));
		verifyNoMoreInteractions(projetoRepository, usuarioRepository);
	}

	@Test
	void criarProjeto_WhenCriadorNotFound_ShouldThrowException() {
		// Arrange
		String nome = "Projeto Teste";
		Long idCriador = 1L;
		List<Long> usuariosIds = List.of(2L);
		List<Long> aprovadoresIds = List.of(3L);
		when(usuarioRepository.findById(idCriador)).thenReturn(Optional.empty());

		// Act & Assert
		RuntimeException exception = assertThrows(RuntimeException.class, () -> {
			projetoService.criarProjeto(nome, idCriador, usuariosIds, aprovadoresIds);
		});
		assertEquals("Usuário criador não encontrado", exception.getMessage(),
				"A mensagem de erro deve ser a esperada");
		verify(usuarioRepository, times(1)).findById(idCriador);
		verifyNoMoreInteractions(usuarioRepository);
		verifyNoInteractions(projetoRepository);
	}

	@Test
	void listarTodos_ShouldReturnListOfProjetos() {
		// Arrange
		Projeto projeto = new Projeto();
		projeto.setId(1L);
		projeto.setNome("Projeto Teste");
		List<Projeto> projetos = List.of(projeto);
		when(projetoRepository.findAll()).thenReturn(projetos);

		// Act
		List<ProjetoResponseDTO> result = projetoService.listarTodos();

		// Assert
		assertNotNull(result, "A lista de projetos não deve ser nula");
		assertEquals(1, result.size(), "A lista deve conter exatamente um projeto");
		assertEquals(projeto, result.get(0), "O projeto retornado deve ser o esperado");
		assertEquals("Projeto Teste", result.get(0).getNome(), "O nome do projeto deve ser o esperado");
		verify(projetoRepository, times(1)).findAll();
		verifyNoMoreInteractions(projetoRepository);
		verifyNoInteractions(usuarioRepository);
	}

	@Test
	void buscarPorId_ShouldReturnProjeto() {
		// Arrange
		Long id = 1L;
		Projeto projeto = new Projeto();
		projeto.setId(id);
		projeto.setNome("Projeto Teste");
		when(projetoRepository.findById(id)).thenReturn(Optional.of(projeto));

		// Act
		ProjetoResponseDTO result = projetoService.buscarPorIdDTO(id);

		// Assert
		assertNotNull(result, "O projeto retornado não deve ser nulo");
		assertEquals(id, result.getId(), "O ID do projeto deve ser o esperado");
		assertEquals("Projeto Teste", result.getNome(), "O nome do projeto deve ser o esperado");
		verify(projetoRepository, times(1)).findById(id);
		verifyNoMoreInteractions(projetoRepository);
		verifyNoInteractions(usuarioRepository);
	}

	@Test
	void buscarPorId_WhenProjetoNotFound_ShouldThrowException() {
		// Arrange
		Long id = 1L;
		when(projetoRepository.findById(id)).thenReturn(Optional.empty());

		// Act & Assert
		NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
			projetoService.buscarPorIdDTO(id);
		});
		assertEquals("Projeto não encontrado com id: " + id, exception.getMessage(),
				"A mensagem de erro deve ser a esperada");
		verify(projetoRepository, times(1)).findById(id);
		verifyNoMoreInteractions(projetoRepository);
		verifyNoInteractions(usuarioRepository);
	}

	@Test
	void atualizar_ShouldUpdateProjeto() {
		// Arrange
		Long id = 1L;
		String nome = "Projeto Atualizado";
		Long idCriador = 1L;
		List<Long> usuariosIds = List.of(2L);
		List<Long> aprovadoresIds = List.of(3L);
		Projeto projetoExistente = new Projeto();
		projetoExistente.setId(id);
		Usuario criador = new Usuario();
		criador.setId(idCriador);
		Usuario usuario = new Usuario();
		usuario.setId(2L);
		Usuario aprovador = new Usuario();
		aprovador.setId(3L);
		Projeto projetoAtualizado = new Projeto();
		projetoAtualizado.setId(id);
		projetoAtualizado.setNome(nome);
		projetoAtualizado.setCriador(criador);
		projetoAtualizado.setUsuarios(Set.of(usuario));
		projetoAtualizado.setAprovadores(Set.of(aprovador));

		when(projetoRepository.findById(id)).thenReturn(Optional.of(projetoExistente));
		when(usuarioRepository.findById(idCriador)).thenReturn(Optional.of(criador));
		when(usuarioRepository.findAllById(usuariosIds)).thenReturn(List.of(usuario));
		when(usuarioRepository.findAllById(aprovadoresIds)).thenReturn(List.of(aprovador));
		when(projetoRepository.save(any(Projeto.class))).thenReturn(projetoAtualizado);

		// Act
		ProjetoResponseDTO result = projetoService.atualizar(id, nome, idCriador, usuariosIds, aprovadoresIds);

		// Assert
		assertNotNull(result, "O projeto retornado não deve ser nulo");
		assertEquals(id, result.getId(), "O ID do projeto deve ser o esperado");
		assertEquals(nome, result.getNome(), "O nome do projeto deve ser o esperado");
		verify(projetoRepository, times(1)).findById(id);
		verify(usuarioRepository, times(1)).findById(idCriador);
		verify(usuarioRepository, times(1)).findAllById(usuariosIds);
		verify(usuarioRepository, times(1)).findAllById(aprovadoresIds);
		verify(projetoRepository, times(1)).save(any(Projeto.class));
		verifyNoMoreInteractions(projetoRepository, usuarioRepository);
	}

	@Test
	void atualizar_WhenProjetoNotFound_ShouldThrowException() {
		// Arrange
		Long id = 1L;
		String nome = "Projeto Atualizado";
		Long idCriador = 1L;
		List<Long> usuariosIds = List.of(2L);
		List<Long> aprovadoresIds = List.of(3L);
		when(projetoRepository.findById(id)).thenReturn(Optional.empty());

		// Act & Assert
		NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
			projetoService.atualizar(id, nome, idCriador, usuariosIds, aprovadoresIds);
		});
		assertEquals("Projeto não encontrado com id: " + id, exception.getMessage(),
				"A mensagem de erro deve ser a esperada");
		verify(projetoRepository, times(1)).findById(id);
		verifyNoMoreInteractions(projetoRepository);
		verifyNoInteractions(usuarioRepository);
	}

	@Test
	void deletar_ShouldDeleteProjeto() {
		// Arrange
		Long id = 1L;
		when(projetoRepository.existsById(id)).thenReturn(true);
		doNothing().when(projetoRepository).deleteById(id);

		// Act
		projetoService.deletar(id);

		// Assert
		verify(projetoRepository, times(1)).existsById(id);
		verify(projetoRepository, times(1)).deleteById(id);
		verifyNoMoreInteractions(projetoRepository);
		verifyNoInteractions(usuarioRepository);
	}

	@Test
	void deletar_WhenProjetoNotFound_ShouldThrowException() {
		// Arrange
		Long id = 1L;
		when(projetoRepository.existsById(id)).thenReturn(false);

		// Act & Assert
		NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
			projetoService.deletar(id);
		});
		assertEquals("Projeto não encontrado com id: " + id, exception.getMessage(),
				"A mensagem de erro deve ser a esperada");
		verify(projetoRepository, times(1)).existsById(id);
		verifyNoMoreInteractions(projetoRepository);
		verifyNoInteractions(usuarioRepository);
	}
}