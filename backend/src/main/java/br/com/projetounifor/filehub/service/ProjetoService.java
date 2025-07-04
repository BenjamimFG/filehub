package br.com.projetounifor.filehub.service;


import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

import br.com.projetounifor.filehub.domain.model.Projeto;
import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.domain.repository.ProjetoRepository;
import br.com.projetounifor.filehub.domain.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjetoService {

    private final ProjetoRepository projetoRepository;
    private final UsuarioRepository usuarioRepository;

    // Criar projeto novo
    public Projeto criarProjeto(String nome, Long idCriador, List<Long> usuariosIds, List<Long> aprovadoresIds) {
        Usuario criador = usuarioRepository.findById(idCriador)
                .orElseThrow(() -> new RuntimeException("Usuário criador não encontrado"));

        Projeto projeto = new Projeto();
        projeto.setNome(nome);
        projeto.setCriador(criador);
        projeto.setUsuarios(Set.copyOf(usuarioRepository.findAllById(usuariosIds)));
        projeto.setAprovadores(Set.copyOf(usuarioRepository.findAllById(aprovadoresIds)));
        return projetoRepository.save(projeto);
    }

    // Listar todos os projetos
    public List<Projeto> listarTodos() {
        return projetoRepository.findAll();
    }

    // Buscar projeto por ID
    public Projeto buscarPorId(Long id) {
        return projetoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Projeto não encontrado com id: " + id));
    }

    // Atualizar projeto por ID
    public Projeto atualizar(Long id, String nome, Long idCriador, List<Long> usuariosIds, List<Long> aprovadoresIds) {
        Projeto projetoExistente = buscarPorId(id);

        Usuario criador = usuarioRepository.findById(idCriador)
                .orElseThrow(() -> new RuntimeException("Usuário criador não encontrado"));

        projetoExistente.setNome(nome);
        projetoExistente.setCriador(criador);
        projetoExistente.setUsuarios(Set.copyOf(usuarioRepository.findAllById(usuariosIds)));
        projetoExistente.setAprovadores(Set.copyOf(usuarioRepository.findAllById(aprovadoresIds)));

        return projetoRepository.save(projetoExistente);
    }

    // Deletar projeto por ID
    public void deletar(Long id) {
        if (!projetoRepository.existsById(id)) {
            throw new NoSuchElementException("Projeto não encontrado com id: " + id);
        }
        projetoRepository.deleteById(id);
    }

    public Projeto adicionarMembro(Long projetoId, Long usuarioId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        projeto.getUsuarios().add(usuario);
        projeto.getAprovadores().remove(usuario);
        return projetoRepository.save(projeto);
    }

    public Projeto removerMembro(Long projetoId, Long usuarioId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        projeto.getUsuarios().remove(usuario);
        return projetoRepository.save(projeto);
    }

    public Projeto adicionarAprovador(Long projetoId, Long usuarioId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        projeto.getAprovadores().add(usuario);
        projeto.getUsuarios().remove(usuario);
        return projetoRepository.save(projeto);
    }

    public Projeto removerAprovador(Long projetoId, Long usuarioId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        projeto.getAprovadores().remove(usuario);
        return projetoRepository.save(projeto);
    }

}
