package br.com.projetounifor.filehub.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import br.com.projetounifor.filehub.domain.model.Documento;
import br.com.projetounifor.filehub.domain.model.Projeto;
import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.domain.model.enums.StatusDocumento;
import br.com.projetounifor.filehub.domain.repository.DocumentoRepository;
import br.com.projetounifor.filehub.domain.repository.ProjetoRepository;
import br.com.projetounifor.filehub.domain.repository.UsuarioRepository;
import br.com.projetounifor.filehub.dto.DocumentoDTO;

@ExtendWith(MockitoExtension.class)
class DocumentoServiceTest {

	@Mock
	private DocumentoRepository documentoRepository;

	@Mock
	private ProjetoRepository projetoRepository;

	@Mock
	private UsuarioRepository usuarioRepository;

	@InjectMocks
	private DocumentoService documentoService;

	private MockMultipartFile mockFile;

	@BeforeEach
	void setUp() {
		mockFile = new MockMultipartFile("file", "test.pdf", "application/pdf", "Test content".getBytes());
	}

	@Test
	void submeterDocumento_ShouldCreateAndSaveDocumento() throws IOException {
		// Arrange
		Long projetoId = 1L;
		Long usuarioId = 2L;
		Projeto projeto = new Projeto();
		projeto.setId(projetoId);
		Usuario usuario = new Usuario();
		usuario.setId(usuarioId);
		Documento documento = new Documento();
		documento.setId(1L);
		documento.setNomeArquivo("test.pdf");
		documento.setCaminhoArquivo(System.getProperty("user.dir") + "/uploads/test.pdf");
		documento.setStatus(StatusDocumento.PENDENTE);
		documento.setProjeto(projeto);
		documento.setCriadoPor(usuario);
		documento.setVersao(1);

		when(projetoRepository.findById(projetoId)).thenReturn(Optional.of(projeto));
		when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
		when(documentoRepository.save(any(Documento.class))).thenReturn(documento);

		// Act
		DocumentoDTO result = documentoService.submeterDocumento(projetoId, usuarioId, mockFile);

		// Assert
		assertNotNull(result, "O DocumentoDTO retornado não deve ser nulo");
		assertEquals(1L, result.getId(), "O ID do documento deve ser o esperado");
		assertEquals("test.pdf", result.getNomeArquivo(), "O nome do arquivo deve ser o esperado");
		assertEquals(StatusDocumento.PENDENTE, result.getStatus(), "O status deve ser PENDENTE");
		assertEquals(projetoId, result.getProjetoId(), "O projetoId deve ser o esperado");
		assertEquals(usuarioId, result.getCriadoPorId(), "O criadoPorId deve ser o esperado");
		verify(projetoRepository, times(1)).findById(projetoId);
		verify(usuarioRepository, times(1)).findById(usuarioId);
		verify(documentoRepository, times(1)).save(any(Documento.class));
		verifyNoMoreInteractions(projetoRepository, usuarioRepository, documentoRepository);
	}

	@Test
	void submeterDocumento_WhenProjetoNotFound_ShouldThrowException() {
		// Arrange
		Long projetoId = 1L;
		Long usuarioId = 2L;
		when(projetoRepository.findById(projetoId)).thenReturn(Optional.empty());

		// Act & Assert
		RuntimeException exception = assertThrows(RuntimeException.class, () -> {
			documentoService.submeterDocumento(projetoId, usuarioId, mockFile);
		});
		assertEquals("Projeto não encontrado", exception.getMessage(), "A mensagem de erro deve ser a esperada");
		verify(projetoRepository, times(1)).findById(projetoId);
		verifyNoInteractions(usuarioRepository, documentoRepository);
	}

	@Test
	void aprovar_ShouldUpdateDocumentoStatusAndAprovador() {
		// Arrange
		Long documentoId = 1L;
		Long aprovadorId = 2L;
		Documento documento = new Documento();
		documento.setId(documentoId);
		documento.setStatus(StatusDocumento.PENDENTE);
		Usuario aprovador = new Usuario();
		aprovador.setId(aprovadorId);
		when(documentoRepository.findById(documentoId)).thenReturn(Optional.of(documento));
		when(usuarioRepository.findById(aprovadorId)).thenReturn(Optional.of(aprovador));
		when(documentoRepository.save(any(Documento.class))).thenReturn(documento);

		// Act
		Documento result = documentoService.aprovar(documentoId, aprovadorId);

		// Assert
		assertNotNull(result, "O documento retornado não deve ser nulo");
		assertEquals(StatusDocumento.APROVADO, result.getStatus(), "O status deve ser APROVADO");
		assertEquals(aprovador, result.getAprovadoPor(), "O aprovador deve ser o esperado");
		assertNotNull(result.getAprovadoEm(), "A data de aprovação não deve ser nula");
		verify(documentoRepository, times(1)).findById(documentoId);
		verify(usuarioRepository, times(1)).findById(aprovadorId);
		verify(documentoRepository, times(1)).save(any(Documento.class));
		verifyNoMoreInteractions(documentoRepository, usuarioRepository);
	}

	@Test
	void aprovar_WhenDocumentoNotFound_ShouldThrowException() {
		// Arrange
		Long documentoId = 1L;
		Long aprovadorId = 2L;
		when(documentoRepository.findById(documentoId)).thenReturn(Optional.empty());

		// Act & Assert
		RuntimeException exception = assertThrows(RuntimeException.class, () -> {
			documentoService.aprovar(documentoId, aprovadorId);
		});
		assertEquals("Documento não encontrado", exception.getMessage(), "A mensagem de erro deve ser a esperada");
		verify(documentoRepository, times(1)).findById(documentoId);
		verifyNoInteractions(usuarioRepository, documentoRepository);
	}

	@Test
	void consultarPorProjeto_ShouldReturnListOfDocumentos() {
		// Arrange
		Long projetoId = 1L;
		Documento documento = new Documento();
		documento.setId(1L);
		documento.setNomeArquivo("test.pdf");
		List<Documento> documentos = List.of(documento);
		when(documentoRepository.findByProjetoId(projetoId)).thenReturn(documentos);

		// Act
		List<Documento> result = documentoService.consultarPorProjeto(projetoId);

		// Assert
		assertNotNull(result, "A lista de documentos não deve ser nula");
		assertEquals(1, result.size(), "A lista deve conter exatamente um documento");
		assertEquals(documento, result.get(0), "O documento retornado deve ser o esperado");
		verify(documentoRepository, times(1)).findByProjetoId(projetoId);
		verifyNoMoreInteractions(documentoRepository);
	}

	@Test
	void novaVersao_ShouldCreateNewVersion() throws IOException {
		// Arrange
		Long documentoOriginalId = 1L;
		Long usuarioId = 2L;
		Documento documentoOriginal = new Documento();
		documentoOriginal.setId(documentoOriginalId);
		documentoOriginal.setVersao(1);
		Projeto projeto = new Projeto();
		projeto.setId(1L);
		documentoOriginal.setProjeto(projeto);
		Usuario usuario = new Usuario();
		usuario.setId(usuarioId);
		Documento novaVersao = new Documento();
		novaVersao.setId(2L);
		novaVersao.setVersao(2);
		novaVersao.setNomeArquivo("new_version.pdf");
		when(documentoRepository.findById(documentoOriginalId)).thenReturn(Optional.of(documentoOriginal));
		when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
		when(documentoRepository.save(any(Documento.class))).thenReturn(novaVersao);

		MockMultipartFile newFile = new MockMultipartFile("file", "new_version.pdf", "application/pdf",
				"New content".getBytes());

		// Act
		Documento result = documentoService.novaVersao(documentoOriginalId, usuarioId, newFile);

		// Assert
		assertNotNull(result, "O documento retornado não deve ser nulo");
		assertEquals(2, result.getVersao(), "A versão deve ser 2");
		assertEquals("new_version.pdf", result.getNomeArquivo(), "O nome do arquivo deve ser o esperado");
		assertEquals(StatusDocumento.PENDENTE, result.getStatus(), "O status deve ser PENDENTE");
		assertEquals(projeto, result.getProjeto(), "O projeto deve ser o mesmo do documento original");
		verify(documentoRepository, times(1)).findById(documentoOriginalId);
		verify(usuarioRepository, times(1)).findById(usuarioId);
		verify(documentoRepository, times(1)).save(any(Documento.class));
		verifyNoMoreInteractions(documentoRepository, usuarioRepository);
	}

	@Test
	void novaVersao_WhenDocumentoNotFound_ShouldThrowException() {
		// Arrange
		Long documentoOriginalId = 1L;
		Long usuarioId = 2L;
		when(documentoRepository.findById(documentoOriginalId)).thenReturn(Optional.empty());

		// Act & Assert
		RuntimeException exception = assertThrows(RuntimeException.class, () -> {
			documentoService.novaVersao(documentoOriginalId, usuarioId, mockFile);
		});
		assertEquals("Documento original não encontrado", exception.getMessage(),
				"A mensagem de erro deve ser a esperada");
		verify(documentoRepository, times(1)).findById(documentoOriginalId);
		verifyNoInteractions(usuarioRepository, documentoRepository);
	}

	@Test
	void toDTO_ShouldConvertDocumentoToDTO() {
		// Arrange
		Documento documento = new Documento();
		documento.setId(1L);
		documento.setNomeArquivo("test.pdf");
		documento.setCaminhoArquivo("/uploads/test.pdf");
		documento.setVersao(1);
		documento.setStatus(StatusDocumento.PENDENTE);
		Projeto projeto = new Projeto();
		projeto.setId(1L);
		documento.setProjeto(projeto);
		Usuario criadoPor = new Usuario();
		criadoPor.setId(2L);
		documento.setCriadoPor(criadoPor);
		LocalDateTime criadoEm = LocalDateTime.now();
		documento.setCriadoEm(criadoEm);
		Usuario aprovadoPor = new Usuario();
		aprovadoPor.setId(3L);
		documento.setAprovadoPor(aprovadoPor);
		LocalDateTime aprovadoEm = LocalDateTime.now();
		documento.setAprovadoEm(aprovadoEm);

		// Act
		DocumentoDTO result = documentoService.toDTO(documento);

		// Assert
		assertNotNull(result, "O DocumentoDTO não deve ser nulo");
		assertEquals(1L, result.getId(), "O ID deve ser o esperado");
		assertEquals("test.pdf", result.getNomeArquivo(), "O nome do arquivo deve ser o esperado");
		assertEquals("/uploads/test.pdf", result.getCaminhoArquivo(), "O caminho do arquivo deve ser o esperado");
		assertEquals(1, result.getVersao(), "A versão deve ser a esperada");
		assertEquals(StatusDocumento.PENDENTE, result.getStatus(), "O status deve ser o esperado");
		assertEquals(1L, result.getProjetoId(), "O projetoId deve ser o esperado");
		assertEquals(2L, result.getCriadoPorId(), "O criadoPorId deve ser o esperado");
		assertEquals(3L, result.getAprovadoPorId(), "O aprovadoPorId deve ser o esperado");
		assertEquals(criadoEm, result.getCriadoEm(), "A data de criação deve ser a esperada");
		assertEquals(aprovadoEm, result.getAprovadoEm(), "A data de aprovação deve ser a esperada");
	}
}