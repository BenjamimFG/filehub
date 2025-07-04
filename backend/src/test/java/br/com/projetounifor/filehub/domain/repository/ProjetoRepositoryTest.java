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

import br.com.projetounifor.filehub.domain.model.Projeto;

@ExtendWith(MockitoExtension.class)
class ProjetoRepositoryTest {

	@Mock
	private ProjetoRepository projetoRepository;

	@Test
	void findById_ShouldReturnProjeto() {
		// Arrange
		Long id = 1L;
		Projeto projeto = new Projeto();
		projeto.setId(id);
		projeto.setNome("Projeto Teste");
		when(projetoRepository.findById(id)).thenReturn(Optional.of(projeto));

		// Act
		Optional<Projeto> result = projetoRepository.findById(id);

		// Assert
		assertTrue(result.isPresent(), "O projeto deve estar presente");
		assertEquals(projeto, result.get(), "O projeto retornado deve ser o esperado");
		assertEquals(id, result.get().getId(), "O ID do projeto deve ser o esperado");
		assertEquals("Projeto Teste", result.get().getNome(), "O nome do projeto deve ser o esperado");
		verify(projetoRepository, times(1)).findById(id);
		verifyNoMoreInteractions(projetoRepository);
	}

	@Test
	void save_ShouldReturnSavedProjeto() {
		// Arrange
		Projeto projeto = new Projeto();
		projeto.setId(1L);
		projeto.setNome("Projeto Teste");
		when(projetoRepository.save(any(Projeto.class))).thenReturn(projeto);

		// Act
		Projeto result = projetoRepository.save(projeto);

		// Assert
		assertNotNull(result, "O projeto salvo não deve ser nulo");
		assertEquals(projeto, result, "O projeto retornado deve ser o esperado");
		assertEquals(1L, result.getId(), "O ID do projeto deve ser o esperado");
		assertEquals("Projeto Teste", result.getNome(), "O nome do projeto deve ser o esperado");
		verify(projetoRepository, times(1)).save(any(Projeto.class));
		verifyNoMoreInteractions(projetoRepository);
	}

	@Test
	void findAll_ShouldReturnListOfProjetos() {
		// Arrange
		Projeto projeto = new Projeto();
		projeto.setId(1L);
		projeto.setNome("Projeto Teste");
		List<Projeto> projetos = List.of(projeto);
		when(projetoRepository.findAll()).thenReturn(projetos);

		// Act
		List<Projeto> result = projetoRepository.findAll();

		// Assert
		assertNotNull(result, "A lista de projetos não deve ser nula");
		assertEquals(1, result.size(), "A lista deve conter exatamente um projeto");
		assertEquals(projeto, result.get(0), "O projeto retornado deve ser o esperado");
		assertEquals("Projeto Teste", result.get(0).getNome(), "O nome do projeto deve ser o esperado");
		verify(projetoRepository, times(1)).findAll();
		verifyNoMoreInteractions(projetoRepository);
	}

	@Test
	void deleteById_ShouldDeleteProjeto() {
		// Arrange
		Long id = 1L;
		doNothing().when(projetoRepository).deleteById(id);

		// Act
		projetoRepository.deleteById(id);

		// Assert
		verify(projetoRepository, times(1)).deleteById(id);
		verifyNoMoreInteractions(projetoRepository);
	}
}