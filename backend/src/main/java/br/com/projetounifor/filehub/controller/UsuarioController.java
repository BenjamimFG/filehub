package br.com.projetounifor.filehub.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.dto.UsuarioDTO;
import br.com.projetounifor.filehub.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuários", description = "Operações de gerenciamento de usuários no sistema GED")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    @Operation(
            summary = "Cadastra um novo usuário",
            description = "Cria um novo usuário no sistema e retorna os dados do usuário criado."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "409", description = "Usuário já existe")
    })
    public ResponseEntity<UsuarioDTO> cadastrar(
            @Parameter(description = "Dados do novo usuário")
            @RequestBody UsuarioDTO usuarioDTO
    ) {
        UsuarioDTO criado = usuarioService.cadastrar(usuarioDTO);
        URI uri = URI.create("/usuarios/" + criado.getId());
        return ResponseEntity.created(uri).body(criado);
    }

    @GetMapping
    @Operation(
            summary = "Lista todos os usuários",
            description = "Retorna uma lista com todos os usuários cadastrados no sistema."
    )
    @ApiResponse(responseCode = "200", description = "Lista de usuários retornada com sucesso")
    public ResponseEntity<List<UsuarioDTO>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Busca usuário por ID",
            description = "Retorna os dados do usuário correspondente ao ID fornecido."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuário encontrado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<Usuario> buscarPorId(
            @Parameter(description = "ID do usuário a ser buscado", example = "1")
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Atualiza dados de um usuário",
            description = "Atualiza as informações de um usuário existente com base no ID fornecido."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuário atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<Usuario> atualizar(
            @Parameter(description = "ID do usuário a ser atualizado", example = "1")
            @PathVariable Long id,

            @Parameter(description = "Dados atualizados do usuário")
            @RequestBody Usuario usuario
    ) {
        Usuario atualizado = usuarioService.atualizar(id, usuario);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Remove um usuário",
            description = "Exclui um usuário do sistema com base no ID fornecido."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Usuário removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    public ResponseEntity<Void> deletar(
            @Parameter(description = "ID do usuário a ser removido", example = "1")
            @PathVariable Long id
    ) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
