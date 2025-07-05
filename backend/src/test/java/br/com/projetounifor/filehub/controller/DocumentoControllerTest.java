package br.com.projetounifor.filehub.controller;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import br.com.projetounifor.filehub.domain.model.Documento;
import br.com.projetounifor.filehub.dto.DocumentoDTO;
import br.com.projetounifor.filehub.service.DocumentoService;

@ExtendWith(MockitoExtension.class)
class DocumentoControllerTest {

	private MockMvc mockMvc;

	@Mock
	private DocumentoService documentoService;

	@InjectMocks
	private DocumentoController documentoController;

	@BeforeEach
	void setUp() {
		// Configura o MockMvc manualmente com o controlador
		mockMvc = MockMvcBuilders.standaloneSetup(documentoController).build();
	}

	@Test
	void submeter_ShouldReturnDocumentoDTO() throws Exception {
		// Arrange
		Long projetoId = 1L;
		Long usuarioId = 2L;
		MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf",
				"Test content".getBytes());
		DocumentoDTO documentoDTO = new DocumentoDTO();
		documentoDTO.setId(1L);
		when(documentoService.submeterDocumento(projetoId, usuarioId, file)).thenReturn(documentoDTO);

		// Act & Assert
		mockMvc.perform(multipart("/documentos/submeter").file(file).param("projetoId", projetoId.toString())
				.param("usuarioId", usuarioId.toString()).contentType(MediaType.MULTIPART_FORM_DATA))
				.andExpect(status().isOk()).andExpect(jsonPath("$.id").value(1L));

		verify(documentoService, times(1)).submeterDocumento(projetoId, usuarioId, file);
		verifyNoMoreInteractions(documentoService);
	}

	@Test
	void aprovar_ShouldReturnDocumento() throws Exception {
		// Arrange
		Long documentoId = 1L;
		Long aprovadorId = 2L;
		Documento documento = new Documento();
		documento.setId(documentoId);
		when(documentoService.aprovar(documentoId, aprovadorId)).thenReturn(documento);

		// Act & Assert
		mockMvc.perform(post("/documentos/aprovar").param("documentoId", documentoId.toString())
				.param("aprovadorId", aprovadorId.toString()).contentType(MediaType.APPLICATION_FORM_URLENCODED))
				.andExpect(status().isOk()).andExpect(jsonPath("$.id").value(documentoId));

		verify(documentoService, times(1)).aprovar(documentoId, aprovadorId);
		verifyNoMoreInteractions(documentoService);
	}

	@Test
	void listarPorProjeto_ShouldReturnListOfDocumentos() throws Exception {
		// Arrange
		Long projetoId = 1L;
		DocumentoDTO documento = new DocumentoDTO();
		documento.setId(1L);
		List<DocumentoDTO> documentos = List.of(documento);
		when(documentoService.consultarPorProjeto(projetoId)).thenReturn(documentos);

		// Act & Assert
		mockMvc.perform(get("/documentos/projeto/{projetoId}", projetoId).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk()).andExpect(jsonPath("$[0].id").value(1L));

		verify(documentoService, times(1)).consultarPorProjeto(projetoId);
		verifyNoMoreInteractions(documentoService);
	}

	@Test
	void novaVersao_ShouldReturnDocumento() throws Exception {
		// Arrange
		Long documentoOriginalId = 1L;
		Long usuarioId = 2L;
		MockMultipartFile file = new MockMultipartFile("file", "new_version.pdf", "application/pdf",
				"New version content".getBytes());
		Documento documento = new Documento();
		documento.setId(2L);
		when(documentoService.novaVersao(documentoOriginalId, usuarioId, file)).thenReturn(documento);

		// Act & Assert
		mockMvc.perform(multipart("/documentos/nova-versao").file(file)
				.param("documentoOriginalId", documentoOriginalId.toString()).param("usuarioId", usuarioId.toString())
				.contentType(MediaType.MULTIPART_FORM_DATA)).andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(2L));

		verify(documentoService, times(1)).novaVersao(documentoOriginalId, usuarioId, file);
		verifyNoMoreInteractions(documentoService);
	}
}