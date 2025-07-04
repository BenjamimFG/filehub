package br.com.projetounifor.filehub.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetounifor.filehub.domain.model.Projeto;
import br.com.projetounifor.filehub.dto.ProjetoDTO;
import br.com.projetounifor.filehub.service.ProjetoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/projetos")
@RequiredArgsConstructor
public class ProjetoController {
    private final ProjetoService projetoService;

    @PostMapping
    public ResponseEntity<Projeto> criar(@RequestBody ProjetoDTO dto) {
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
    public ResponseEntity<List<Projeto>> listarTodos() {
        return ResponseEntity.ok(projetoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Projeto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(projetoService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Projeto> atualizar(@PathVariable Long id, @RequestBody ProjetoDTO dto) {
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
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        projetoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
