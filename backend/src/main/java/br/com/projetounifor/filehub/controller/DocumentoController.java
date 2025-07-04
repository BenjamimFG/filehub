package br.com.projetounifor.filehub.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.com.projetounifor.filehub.domain.model.Documento;
import br.com.projetounifor.filehub.dto.DocumentoDTO;
import br.com.projetounifor.filehub.service.DocumentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/documentos")
@RequiredArgsConstructor
public class DocumentoController {

    private final DocumentoService documentoService;

    @PostMapping(value = "/submeter", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Submete um documento com upload de arquivo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Documento submetido com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<DocumentoDTO> submeter(
        @RequestParam Long projetoId,
        @RequestParam Long usuarioId,
        @Parameter(description = "Arquivo a ser submetido", required = true)
        @RequestParam MultipartFile file) {

        DocumentoDTO doc = documentoService.submeterDocumento(projetoId, usuarioId, file);
        return ResponseEntity.ok(doc);
    }

    @PostMapping("/aprovar")
    public ResponseEntity<Documento> aprovar(
            @RequestParam Long documentoId,
            @RequestParam Long aprovadorId) {
        return ResponseEntity.ok(documentoService.aprovar(documentoId, aprovadorId));
    }

    @GetMapping("/projeto/{projetoId}")
    public ResponseEntity<List<Documento>> listarPorProjeto(@PathVariable Long projetoId) {
        return ResponseEntity.ok(documentoService.consultarPorProjeto(projetoId));
    }

    @PostMapping("/nova-versao")
    public ResponseEntity<Documento> novaVersao(
            @RequestParam Long documentoOriginalId,
            @RequestParam Long usuarioId,
            @RequestParam MultipartFile file) {
        return ResponseEntity.ok(documentoService.novaVersao(documentoOriginalId, usuarioId, file));
    }
}
