package br.com.projetounifor.filehub.controller;

import br.com.projetounifor.filehub.domain.model.Projeto;
import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import br.com.projetounifor.filehub.config.JWTUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Autenticação de usuários e geração de token JWT")
public class AuthenticationController {

        private final AuthenticationManager authManager;
        private final JWTUtil jwtUtil;
        private final UsuarioService usuarioService;

        @PostMapping("/login")
        @Operation(summary = "Realiza login do usuário", description = "Autentica um usuário com nome de usuário e senha e retorna um token JWT para acesso autenticado.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Login bem-sucedido e token retornado"),
                        @ApiResponse(responseCode = "401", description = "Usuário ou senha inválidos", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "\"Usuário ou senha inválidos\"")))
        })
        public ResponseEntity<?> login(
                        @RequestBody LoginRequest login) {
                try {
                        var authenticationToken = new UsernamePasswordAuthenticationToken(
                                        login.username().toUpperCase(), login.senha());
                        authManager.authenticate(authenticationToken);

                        Usuario usuario = usuarioService.buscarPorUsername(login.username().toUpperCase());
                        var token = jwtUtil.gerarToken(login.username(), usuario.getPerfil().name(), usuario.getId(),
                                        usuario.getEmail());

                        // Mapeando IDs dos repositórios
                        List<Long> repositoriosMembro = usuario.getProjetos()
                                        .stream()
                                        .map(Projeto::getId)
                                        .toList();

                        // Novo response com dados do usuário
                        var response = new LoginResponse(
                                        token,
                                        usuario.getId(),
                                        usuario.getNome(),
                                        usuario.getPerfil().name(),
                                        usuario.getEmail(),
                                        repositoriosMembro);

                        return ResponseEntity.ok(response);
                } catch (AuthenticationException e) {
                        return ResponseEntity.status(401).body("Usuário ou senha inválidos");
                }
        }

        // DTOs documentados
        public static record LoginRequest(
                        @Schema(description = "Nome de usuário", example = "admin") String username,

                        @Schema(description = "Senha do usuário", example = "123456") String senha) {
        }

        public static record LoginResponse(
                        @Schema(description = "Token JWT gerado após autenticação", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6...") String token,

                        @Schema(description = "ID do usuário", example = "1") Long id,

                        @Schema(description = "Nome do usuário", example = "João Silva") String nome,

                        @Schema(description = "Perfil do usuário", example = "USUARIO") String perfil,

                        @Schema(description = "Email do usuário", example = "usuario@example.com") String email,

                        @Schema(description = "IDs dos repositórios que o usuário é membro", example = "[1, 3, 5]") List<Long> repositoriosMembro) {
        }

}
