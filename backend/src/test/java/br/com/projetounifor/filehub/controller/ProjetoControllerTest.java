package br.com.projetounifor.filehub.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.projetounifor.filehub.domain.model.Projeto;
import br.com.projetounifor.filehub.dto.ProjetoDTO;
import br.com.projetounifor.filehub.service.ProjetoService;

@ExtendWith(MockitoExtension.class)
class ProjetoControllerTest {

	private MockMvc mockMvc;

	@Mock
	private ProjetoService projetoService;

	@InjectMocks
	private ProjetoController projetoController;

	private ObjectMapper objectMapper;

	@BeforeEach
	void setUp() {
		// Configura o MockMvc manualmente com o controlador
		mockMvc = MockMvcBuilders.standaloneSetup(projetoController).build();
		objectMapper = new ObjectMapper();
	}

	@Test
	void criar_ShouldCreateProjetoAndReturnCreatedStatus() throws Exception {
		// Arrange
		ProjetoDTO dto = new ProjetoDTO("Projeto Teste", 1L, List.of(2L), List.of(3L));
		Projeto projeto = new Projeto();
		projeto.setId(1L);
		projeto.setNome("Projeto Teste");
		when(projetoService.criarProjeto(eq("Projeto Teste"), eq(1L), any(List.class), any(List.class)))
				.thenReturn(projeto);

		String requestBody = objectMapper.writeValueAsString(dto);

		// Act & Assert
		mockMvc.perform(post("/projetos").contentType(MediaType.APPLICATION_JSON).content(requestBody))
				.andExpect(status().isCreated()).andExpect(header().string("Location", "/projetos/1"))
				.andExpect(jsonPath("$.id").value(1L)).andExpect(jsonPath("$.nome").value("Projeto Teste"));

		verify(projetoService, times(1)).criarProjeto(eq("Projeto Teste"), eq(1L), any(List.class), any(List.class));
		verifyNoMoreInteractions(projetoService);
	}

	@Test
	void listarTodos_ShouldReturnListOfProjetos() throws Exception {
		// Arrange
		Projeto projeto = new Projeto();
		projeto.setId(1L);
		projeto.setNome("Projeto Teste");
		List<Projeto> projetos = List.of(projeto);
		when(projetoService.listarTodos()).thenReturn(projetos);

		// Act & Assert
		mockMvc.perform(get("/projetos").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$[0].id").value(1L)).andExpect(jsonPath("$[0].nome").value("Projeto Teste"));

		verify(projetoService, times(1)).listarTodos();
		verifyNoMoreInteractions(projetoService);
	}

	@Test
	void buscarPorId_ShouldReturnProjeto() throws Exception {
		// Arrange
		Long id = 1L;
		Projeto projeto = new Projeto();
		projeto.setId(id);
		projeto.setNome("Projeto Teste");
		when(projetoService.buscarPorId(id)).thenReturn(projeto);

		// Act & Assert
		mockMvc.perform(get("/projetos/{id}", id).contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(id)).andExpect(jsonPath("$.nome").value("Projeto Teste"));

		verify(projetoService, times(1)).buscarPorId(id);
		verifyNoMoreInteractions(projetoService);
	}

	@Test
	void atualizar_ShouldUpdateProjetoAndReturnOk() throws Exception {
		// Arrange
		Long id = 1L;
		ProjetoDTO dto = new ProjetoDTO("Projeto Atualizado", 1L, List.of(2L), List.of(3L));
		Projeto projeto = new Projeto();
		projeto.setId(id);
		projeto.setNome("Projeto Atualizado");
		when(projetoService.atualizar(eq(id), eq("Projeto Atualizado"), eq(1L), any(List.class), any(List.class)))
				.thenReturn(projeto);

		String requestBody = objectMapper.writeValueAsString(dto);

		// Act & Assert
		mockMvc.perform(put("/projetos/{id}", id).contentType(MediaType.APPLICATION_JSON).content(requestBody))
				.andExpect(status().isOk()).andExpect(jsonPath("$.id").value(id))
				.andExpect(jsonPath("$.nome").value("Projeto Atualizado"));

		verify(projetoService, times(1)).atualizar(eq(id), eq("Projeto Atualizado"), eq(1L), any(List.class),
				any(List.class));
		verifyNoMoreInteractions(projetoService);
	}

	@Test
	void deletar_ShouldDeleteProjetoAndReturnNoContent() throws Exception {
		// Arrange
		Long id = 1L;
		doNothing().when(projetoService).deletar(id);

		// Act & Assert
		mockMvc.perform(delete("/projetos/{id}", id).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNoContent());

		verify(projetoService, times(1)).deletar(id);
		verifyNoMoreInteractions(projetoService);
	}
}