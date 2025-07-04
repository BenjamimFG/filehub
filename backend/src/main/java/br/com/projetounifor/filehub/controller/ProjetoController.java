package br.com.projetounifor.filehub.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.projetounifor.filehub.domain.model.Projeto;
import br.com.projetounifor.filehub.dto.ProjetoDTO;
import br.com.projetounifor.filehub.service.ProjetoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
    public ResponseEntity<Projeto> criar(
            @Parameter(description = "Dados do projeto a ser criado")
            @RequestBody ProjetoDTO dto
    ) {
        dto.getUsuariosIds().add(dto.getCriadorId());
        dto.getAprovadoresIds().add(dto.getCriadorId());
        Projeto projeto = projetoService.criarProjeto(
                dto.getNome(),
                dto.getCriadorId(),
                dto.getUsuariosIds(),
                dto.getAprovadoresIds()
        );
        URI uri = URI.create("/projetos/" + projeto.getId());
        return ResponseEntity.created(uri).body(projeto);
    }

    @GetMapping
    @Operation(
            summary = "Lista todos os projetos",
            description = "Retorna uma lista com todos os projetos cadastrados no sistema."
    )
    @ApiResponse(responseCode = "200", description = "Lista de projetos retornada com sucesso")
    public ResponseEntity<List<Projeto>> listarTodos() {
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
    public ResponseEntity<Projeto> buscarPorId(
            @Parameter(description = "ID do projeto", example = "1")
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(projetoService.buscarPorId(id));
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
    public ResponseEntity<Projeto> atualizar(
            @Parameter(description = "ID do projeto a ser atualizado", example = "1")
            @PathVariable Long id,

            @Parameter(description = "Novos dados do projeto")
            @RequestBody ProjetoDTO dto
    ) {
        Projeto projetoAtualizado = projetoService.atualizar(
                id,
                dto.getNome(),
                dto.getCriadorId(),
                dto.getUsuariosIds(),
                dto.getAprovadoresIds()
        );
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
}
