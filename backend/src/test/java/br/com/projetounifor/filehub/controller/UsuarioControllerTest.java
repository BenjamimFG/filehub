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

import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.dto.UsuarioDTO;
import br.com.projetounifor.filehub.service.UsuarioService;

@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

	private MockMvc mockMvc;

	@Mock
	private UsuarioService usuarioService;

	@InjectMocks
	private UsuarioController usuarioController;

	private ObjectMapper objectMapper;

	@BeforeEach
	void setUp() {
		// Configura o MockMvc manualmente com o controlador
		mockMvc = MockMvcBuilders.standaloneSetup(usuarioController).build();
		objectMapper = new ObjectMapper();
	}

	@Test
	void cadastrar_ShouldCreateUsuarioAndReturnCreatedStatus() throws Exception {
		// Arrange
		UsuarioDTO dto = new UsuarioDTO();
		dto.setId(1L);
		dto.setNome("Test User");
		dto.setUsername("testuser");
		dto.setEmail("test@example.com");
		when(usuarioService.cadastrar(any(UsuarioDTO.class))).thenReturn(dto);

		String requestBody = objectMapper.writeValueAsString(dto);

		// Act & Assert
		mockMvc.perform(post("/usuarios").contentType(MediaType.APPLICATION_JSON).content(requestBody))
				.andExpect(status().isCreated()).andExpect(header().string("Location", "/usuarios/1"))
				.andExpect(jsonPath("$.id").value(1L)).andExpect(jsonPath("$.nome").value("Test User"))
				.andExpect(jsonPath("$.username").value("testuser"))
				.andExpect(jsonPath("$.email").value("test@example.com"));

		verify(usuarioService, times(1)).cadastrar(any(UsuarioDTO.class));
		verifyNoMoreInteractions(usuarioService);
	}

	@Test
	void listarTodos_ShouldReturnListOfUsuarios() throws Exception {
		// Arrange
		Usuario usuario = new Usuario();
		usuario.setId(1L);
		usuario.setNome("Test User");
		usuario.setUsername("testuser");
		usuario.setEmail("test@example.com");
		List<Usuario> usuarios = List.of(usuario);
		when(usuarioService.listarTodos()).thenReturn(usuarios);

		// Act & Assert
		mockMvc.perform(get("/usuarios").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$[0].id").value(1L)).andExpect(jsonPath("$[0].nome").value("Test User"))
				.andExpect(jsonPath("$[0].username").value("testuser"))
				.andExpect(jsonPath("$[0].email").value("test@example.com"));

		verify(usuarioService, times(1)).listarTodos();
		verifyNoMoreInteractions(usuarioService);
	}

	@Test
	void buscarPorId_ShouldReturnUsuario() throws Exception {
		// Arrange
		Long id = 1L;
		Usuario usuario = new Usuario();
		usuario.setId(id);
		usuario.setNome("Test User");
		usuario.setUsername("testuser");
		usuario.setEmail("test@example.com");
		when(usuarioService.buscarPorId(id)).thenReturn(usuario);

		// Act & Assert
		mockMvc.perform(get("/usuarios/{id}", id).contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(id)).andExpect(jsonPath("$.nome").value("Test User"))
				.andExpect(jsonPath("$.username").value("testuser"))
				.andExpect(jsonPath("$.email").value("test@example.com"));

		verify(usuarioService, times(1)).buscarPorId(id);
		verifyNoMoreInteractions(usuarioService);
	}

	@Test
	void atualizar_ShouldUpdateUsuarioAndReturnOk() throws Exception {
		// Arrange
		Long id = 1L;
		Usuario usuario = new Usuario();
		usuario.setId(id);
		usuario.setNome("Updated User");
		usuario.setUsername("updateduser");
		usuario.setEmail("updated@example.com");
		when(usuarioService.atualizar(eq(id), any(Usuario.class))).thenReturn(usuario);

		String requestBody = objectMapper.writeValueAsString(usuario);

		// Act & Assert
		mockMvc.perform(put("/usuarios/{id}", id).contentType(MediaType.APPLICATION_JSON).content(requestBody))
				.andExpect(status().isOk()).andExpect(jsonPath("$.id").value(id))
				.andExpect(jsonPath("$.nome").value("Updated User"))
				.andExpect(jsonPath("$.username").value("updateduser"))
				.andExpect(jsonPath("$.email").value("updated@example.com"));

		verify(usuarioService, times(1)).atualizar(eq(id), any(Usuario.class));
		verifyNoMoreInteractions(usuarioService);
	}

	@Test
	void deletar_ShouldDeleteUsuarioAndReturnNoContent() throws Exception {
		// Arrange
		Long id = 1L;
		doNothing().when(usuarioService).deletar(id);

		// Act & Assert
		mockMvc.perform(delete("/usuarios/{id}", id).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNoContent());

		verify(usuarioService, times(1)).deletar(id);
		verifyNoMoreInteractions(usuarioService);
	}
}