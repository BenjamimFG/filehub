package br.com.projetounifor.filehub.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetounifor.filehub.dto.ProjetoRequestDTO;
import br.com.projetounifor.filehub.dto.ProjetoResponseDTO;
import br.com.projetounifor.filehub.service.ProjetoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/projetos")
@RequiredArgsConstructor
@Tag(name = "Projetos", description = "Gerenciamento de projetos no sistema GED")
public class ProjetoController {

    private final ProjetoService projetoService;

    @PostMapping
    @Operation(
            summary = "Cria um novo projeto",
            description = "Cria um novo projeto no sistema e associa usuários e aprovadores ao projeto. O criador é incluído automaticamente nas listas."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Projeto criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "409", description = "Projeto com mesmo nome já existe")
    })
    public ResponseEntity<ProjetoResponseDTO> criar(
            @Parameter(description = "Dados do projeto a ser criado")
            @Valid @RequestBody ProjetoRequestDTO dto
    ) {
        ProjetoResponseDTO projeto = projetoService.criarProjeto(dto);
        URI uri = URI.create("/projetos/" + projeto.getId());
        return ResponseEntity.created(uri).body(projeto);
    }

    @GetMapping
    @Operation(
            summary = "Lista todos os projetos",
            description = "Retorna uma lista com todos os projetos cadastrados no sistema."
    )
    @ApiResponse(responseCode = "200", description = "Lista de projetos retornada com sucesso")
    public ResponseEntity<List<ProjetoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(projetoService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Busca projeto por ID",
            description = "Retorna os dados de um projeto específico, com base no ID fornecido."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Projeto encontrado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Projeto não encontrado")
    })
    public ResponseEntity<ProjetoResponseDTO> buscarPorId(
            @Parameter(description = "ID do projeto", example = "1")
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(projetoService.buscarPorIdDTO(id));
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Atualiza um projeto",
            description = "Atualiza os dados de um projeto existente, incluindo nome, criador, usuários e aprovadores."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Projeto atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Projeto não encontrado")
    })
    public ResponseEntity<ProjetoResponseDTO> atualizar(
            @Parameter(description = "ID do projeto a ser atualizado", example = "1")
            @PathVariable Long id,
            @Parameter(description = "Novos dados do projeto")
            @Valid @RequestBody ProjetoRequestDTO dto
    ) {
        ProjetoResponseDTO projetoAtualizado = projetoService.atualizar(id, dto);
        return ResponseEntity.ok(projetoAtualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Exclui um projeto",
            description = "Remove um projeto do sistema com base no ID fornecido."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Projeto removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Projeto não encontrado")
    })
    public ResponseEntity<Void> deletar(
            @Parameter(description = "ID do projeto a ser removido", example = "1")
            @PathVariable Long id
    ) {
        projetoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/membros/{usuarioId}")
    @Operation(summary = "Adiciona membro ao projeto", description = "Inclui um novo usuário na lista de membros do projeto.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Membro adicionado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Projeto ou usuário não encontrado")
    })
    public ResponseEntity<ProjetoResponseDTO> adicionarMembro(
            @PathVariable Long id,
            @PathVariable Long usuarioId
    ) {
        ProjetoResponseDTO projetoAtualizado = projetoService.adicionarMembro(id, usuarioId);
        return ResponseEntity.ok(projetoAtualizado);
    }

    @DeleteMapping("/{id}/membros/{usuarioId}")
    @Operation(summary = "Remove membro do projeto", description = "Remove um usuário da lista de membros do projeto.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Membro removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Projeto ou usuário não encontrado")
    })
    public ResponseEntity<ProjetoResponseDTO> removerMembro(
            @PathVariable Long id,
            @PathVariable Long usuarioId
    ) {
        ProjetoResponseDTO projetoAtualizado = projetoService.removerMembro(id, usuarioId);
        return ResponseEntity.ok(projetoAtualizado);
    }

    @PatchMapping("/{id}/aprovadores/{usuarioId}")
    @Operation(summary = "Adiciona aprovador ao projeto", description = "Adiciona um usuário como aprovador do projeto.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Aprovador adicionado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Projeto ou usuário não encontrado")
    })
    public ResponseEntity<ProjetoResponseDTO> adicionarAprovador(
            @PathVariable Long id,
            @PathVariable List<Long> usuarioId
    ) {
        ProjetoResponseDTO projetoAtualizado = projetoService.adicionarAprovador(id, usuarioId);
        return ResponseEntity.ok(projetoAtualizado);
    }

    @DeleteMapping("/{id}/aprovadores/{usuarioId}")
    @Operation(summary = "Remove aprovador do projeto", description = "Remove um usuário da lista de aprovadores do projeto.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Aprovador removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Projeto ou usuário não encontrado")
    })
    public ResponseEntity<ProjetoResponseDTO> removerAprovador(
            @PathVariable Long id,
            @PathVariable Long usuarioId
    ) {
        ProjetoResponseDTO projetoAtualizado = projetoService.removerAprovador(id, usuarioId);
        return ResponseEntity.ok(projetoAtualizado);
    }
}