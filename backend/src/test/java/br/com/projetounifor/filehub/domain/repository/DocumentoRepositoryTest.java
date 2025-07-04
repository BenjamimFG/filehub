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

import br.com.projetounifor.filehub.domain.model.Documento;

@ExtendWith(MockitoExtension.class)
class DocumentoRepositoryTest {

    @Mock
    private DocumentoRepository documentoRepository;

    @Test
    void findByProjetoId_ShouldReturnListOfDocumentos() {
        // Arrange
        Long projetoId = 1L;
        Documento documento = new Documento();
        documento.setId(1L);
        documento.setNomeArquivo("Documento Teste");
        List<Documento> documentos = List.of(documento);
        when(documentoRepository.findByProjetoId(projetoId)).thenReturn(documentos);

        // Act
        List<Documento> result = documentoRepository.findByProjetoId(projetoId);

        // Assert
        assertNotNull(result, "A lista de documentos não deve ser nula");
        assertEquals(1, result.size(), "A lista deve conter exatamente um documento");
        assertEquals(documento, result.get(0), "O documento retornado deve ser o esperado");
        verify(documentoRepository, times(1)).findByProjetoId(projetoId);
        verifyNoMoreInteractions(documentoRepository);
    }

    @Test
    void findById_ShouldReturnDocumento() {
        // Arrange
        Long id = 1L;
        Documento documento = new Documento();
        documento.setId(id);
        documento.setNomeArquivo("Documento Teste");
        when(documentoRepository.findById(id)).thenReturn(Optional.of(documento));

        // Act
        Optional<Documento> result = documentoRepository.findById(id);

        // Assert
        assertTrue(result.isPresent(), "O documento deve estar presente");
        assertEquals(documento, result.get(), "O documento retornado deve ser o esperado");
        assertEquals(id, result.get().getId(), "O ID do documento deve ser o esperado");
        verify(documentoRepository, times(1)).findById(id);
        verifyNoMoreInteractions(documentoRepository);
    }

    @Test
    void save_ShouldReturnSavedDocumento() {
        // Arrange
        Documento documento = new Documento();
        documento.setId(1L);
        documento.setNomeArquivo("Documento Teste");
        when(documentoRepository.save(any(Documento.class))).thenReturn(documento);

        // Act
        Documento result = documentoRepository.save(documento);

        // Assert
        assertNotNull(result, "O documento salvo não deve ser nulo");
        assertEquals(documento, result, "O documento retornado deve ser o esperado");
        assertEquals(1L, result.getId(), "O ID do documento deve ser o esperado");
        verify(documentoRepository, times(1)).save(any(Documento.class));
        verifyNoMoreInteractions(documentoRepository);
    }

    @Test
    void deleteById_ShouldDeleteDocumento() {
        // Arrange
        Long id = 1L;
        doNothing().when(documentoRepository).deleteById(id);

        // Act
        documentoRepository.deleteById(id);

        // Assert
        verify(documentoRepository, times(1)).deleteById(id);
        verifyNoMoreInteractions(documentoRepository);
    }
}