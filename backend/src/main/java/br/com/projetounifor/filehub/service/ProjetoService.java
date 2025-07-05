package br.com.projetounifor.filehub.service;


import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetounifor.filehub.domain.model.Projeto;
import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.domain.repository.ProjetoRepository;
import br.com.projetounifor.filehub.domain.repository.UsuarioRepository;
import br.com.projetounifor.filehub.dto.ProjetoResponseDTO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjetoService {

    private final ProjetoRepository projetoRepository;
    private final UsuarioRepository usuarioRepository;

    public ProjetoResponseDTO toDTO(Projeto projeto) {
        return new ProjetoResponseDTO(
                projeto.getId(),
                projeto.getNome(),
                projeto.getCriador().getId(),
                projeto.getUsuarios().stream().map(u -> u.getId()).toList(),
                projeto.getAprovadores().stream().map(u -> u.getId()).toList()
        );
    }

    // Criar projeto novo
    public ProjetoResponseDTO criarProjeto(String nome, Long idCriador, List<Long> usuariosIds, List<Long> aprovadoresIds) {
        Usuario criador = usuarioRepository.findById(idCriador)
                .orElseThrow(() -> new RuntimeException("Usuário criador não encontrado"));

        Projeto projeto = new Projeto();
        projeto.setNome(nome);
        projeto.setCriador(criador);
        projeto.setUsuarios(Set.copyOf(usuarioRepository.findAllById(usuariosIds)));
        projeto.setAprovadores(Set.copyOf(usuarioRepository.findAllById(aprovadoresIds)));
        return toDTO(projetoRepository.save(projeto));
    }

    public List<ProjetoResponseDTO> listarTodos() {
        return projetoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }



    // Buscar projeto por ID
    public ProjetoResponseDTO buscarPorIdDTO(Long id) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Projeto não encontrado com id: " + id));
        return toDTO(projeto);
    }

    public Projeto buscarPorId(Long id) {
        return projetoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Projeto não encontrado com id: " + id));
    }

    // Atualizar projeto por ID
    public ProjetoResponseDTO atualizar(Long id, String nome, Long idCriador, List<Long> usuariosIds, List<Long> aprovadoresIds) {
        Projeto projetoExistente = buscarPorId(id);

        Usuario criador = usuarioRepository.findById(idCriador)
                .orElseThrow(() -> new RuntimeException("Usuário criador não encontrado"));

        projetoExistente.setNome(nome);
        projetoExistente.setCriador(criador);
        projetoExistente.setUsuarios(new HashSet<>(usuarioRepository.findAllById(usuariosIds)));
        projetoExistente.setAprovadores(new HashSet<>(usuarioRepository.findAllById(aprovadoresIds)));

        return toDTO(projetoRepository.save(projetoExistente));
    }

    // Deletar projeto por ID
    public void deletar(Long id) {
        if (!projetoRepository.existsById(id)) {
            throw new NoSuchElementException("Projeto não encontrado com id: " + id);
        }
        projetoRepository.deleteById(id);
    }

    public ProjetoResponseDTO adicionarMembro(Long projetoId, Long usuarioId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        projeto.getUsuarios().add(usuario);
        projeto.getAprovadores().remove(usuario);
        return toDTO(projetoRepository.save(projeto));
    }

    public ProjetoResponseDTO removerMembro(Long projetoId, Long usuarioId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        projeto.getUsuarios().remove(usuario);
        return toDTO(projetoRepository.save(projeto));
    }

    public ProjetoResponseDTO adicionarAprovador(Long projetoId, Long usuarioId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        projeto.getAprovadores().add(usuario);
        projeto.getUsuarios().remove(usuario);
        return toDTO(projetoRepository.save(projeto));
    }

    public ProjetoResponseDTO removerAprovador(Long projetoId, Long usuarioId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        projeto.getAprovadores().remove(usuario);
        return toDTO(projetoRepository.save(projeto));
    }

}
