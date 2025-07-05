package br.com.projetounifor.filehub.controller;

import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.com.projetounifor.filehub.config.JWTUtil;
import br.com.projetounifor.filehub.domain.model.Documento;
import br.com.projetounifor.filehub.domain.model.Projeto;
import br.com.projetounifor.filehub.dto.DocumentoDTO;
import br.com.projetounifor.filehub.service.DocumentoService;
import br.com.projetounifor.filehub.service.S3Service;
import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/documentos")
@RequiredArgsConstructor
@Tag(name = "Documentos", description = "Operações relacionadas ao gerenciamento de documentos no sistema GED")
public class DocumentoController {

        private final DocumentoService documentoService;
        private final JWTUtil jwtUtil;
        private final S3Service s3Service;

        @PostMapping(value = "/submeter", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @Operation(summary = "Submete um novo documento", description = "Realiza o upload de um novo documento associando a um projeto e a um usuário.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Documento submetido com sucesso"),
                        @ApiResponse(responseCode = "400", description = "Requisição inválida"),
                        @ApiResponse(responseCode = "401", description = "Não autorizado")
        })
        public ResponseEntity<DocumentoDTO> submeter(
                        @Parameter(description = "ID do projeto ao qual o documento pertence", example = "1") @RequestParam Long projetoId,
                        @Parameter(description = "ID do usuário que está submetendo o documento", example = "42") @RequestParam Long usuarioId,
                        @Parameter(description = "Arquivo a ser submetido", required = true) @RequestParam MultipartFile file) {

                DocumentoDTO doc = documentoService.submeterDocumento(projetoId, usuarioId, file);
                return ResponseEntity.ok(doc);
        }

        @PostMapping("/aprovar")
        @Operation(summary = "Aprova um documento", description = "Realiza a aprovação de um documento por um usuário aprovador")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Documento aprovado com sucesso"),
                        @ApiResponse(responseCode = "400", description = "Dados inválidos ou documento inexistente"),
                        @ApiResponse(responseCode = "401", description = "Não autorizado")
        })
        public ResponseEntity<Documento> aprovar(
                        @Parameter(description = "ID do documento a ser aprovado", example = "10") @RequestParam Long documentoId,
                        @Parameter(description = "ID do usuário que está aprovando", example = "7") @RequestParam Long aprovadorId) {
                return ResponseEntity.ok(documentoService.aprovar(documentoId, aprovadorId));
        }

        @GetMapping("/projeto/{projetoId}")
        @Operation(summary = "Lista documentos de um projeto", description = "Retorna todos os documentos vinculados a um projeto específico")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
                        @ApiResponse(responseCode = "404", description = "Projeto não encontrado")
        })
        public ResponseEntity<List<DocumentoDTO>> listarPorProjeto(
                        @Parameter(description = "ID do projeto", example = "1") @PathVariable Long projetoId) {

                List<DocumentoDTO> documentos = documentoService.consultarPorProjeto(projetoId);

                System.out.println("length: " + documentos.size());

                return ResponseEntity.ok(documentos);
        }

        @PostMapping(value = "/nova-versao", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @Operation(summary = "Submete nova versão de documento", description = "Cria uma nova versão de um documento já existente")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Nova versão enviada com sucesso"),
                        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
                        @ApiResponse(responseCode = "401", description = "Não autorizado")
        })
        public ResponseEntity<Documento> novaVersao(
                        @Parameter(description = "ID do documento original", example = "5") @RequestParam Long documentoOriginalId,
                        @Parameter(description = "ID do usuário que está enviando a nova versão", example = "42") @RequestParam Long usuarioId,
                        @Parameter(description = "Arquivo da nova versão", required = true) @RequestParam MultipartFile file) {
                return ResponseEntity.ok(documentoService.novaVersao(documentoOriginalId, usuarioId, file));
        }

        @GetMapping("/{documentoId}")
        @Operation(summary = "Retorna o arquivo do documento")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Arquivo retornado com sucesso"),
                        @ApiResponse(responseCode = "404", description = "Documento não encontrado")
        })
        public ResponseEntity<Object> getDocumento(
                        @Parameter(description = "ID do documento", example = "1") @PathVariable Long documentoId,
                        HttpServletRequest request) {

                String authHeader = request.getHeader("Authorization");

                if (!authHeader.startsWith("Bearer ")) {
                        return ResponseEntity.status(403).build();
                }

                String jwt = authHeader.substring(7);

                Claims claims = jwtUtil.parseToken(jwt);

                Long userId = claims.get("id", Long.class);

                Documento doc = documentoService.getDocumento(documentoId);
                Projeto p = doc.getProjeto();

                boolean userInProject = p.getUsuarios().stream().filter(u -> u.getId() == userId).findFirst()
                                .isPresent();

                if (!userInProject && p.getCriador().getId() != userId) {
                        return ResponseEntity.status(403).build();
                }

                ResponseInputStream<GetObjectResponse> s3Object = s3Service.downloadFile("filehub-document-bucket",
                                doc.getCaminhoArquivo());
                GetObjectResponse objectMetadata = s3Object.response();

                return ResponseEntity.ok()
                                .header(HttpHeaders.CONTENT_DISPOSITION,
                                                "attachment; filename=\"" + doc.getNomeArquivo() + "\"")
                                .contentType(MediaType.parseMediaType(objectMetadata.contentType()))
                                .contentLength(objectMetadata.contentLength())
                                .body(new InputStreamResource(s3Object));
        }
}
