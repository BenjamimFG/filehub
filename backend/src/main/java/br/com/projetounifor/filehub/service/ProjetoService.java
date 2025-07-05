package br.com.projetounifor.filehub.service;

import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetounifor.filehub.domain.model.Documento;
import br.com.projetounifor.filehub.domain.model.Projeto;
import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.domain.repository.ProjetoRepository;
import br.com.projetounifor.filehub.domain.repository.UsuarioRepository;
import br.com.projetounifor.filehub.dto.ProjetoRequestDTO;
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
                                projeto.getDataCriacao(),
                                projeto.getCriador().getId(),
                                projeto.getUsuarios().stream().map(Usuario::getId).toList(),
                                projeto.getAprovadores().stream().map(Usuario::getId).toList());
        }

        // Criar projeto novo usando ProjetoRequestDTO
        public ProjetoResponseDTO criarProjeto(ProjetoRequestDTO dto) {
                Usuario criador = usuarioRepository.findById(dto.getCriadorId())
                                .orElseThrow(() -> new RuntimeException("Usuário criador não encontrado"));

                Projeto projeto = new Projeto();
                projeto.setNome(dto.getNome());
                projeto.setCriador(criador);
                projeto.setUsuarios(dto.getUsuariosIds() != null
                                ? new HashSet<>(usuarioRepository.findAllById(dto.getUsuariosIds()))
                                : new HashSet<>());
                projeto.setAprovadores(dto.getAprovadoresIds() != null
                                ? new HashSet<>(usuarioRepository.findAllById(dto.getAprovadoresIds()))
                                : new HashSet<>());
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
        public ProjetoResponseDTO atualizar(Long id, ProjetoRequestDTO dto) {
                Projeto projetoExistente = buscarPorId(id);

                Usuario criador = usuarioRepository.findById(dto.getCriadorId())
                                .orElseThrow(() -> new RuntimeException("Usuário criador não encontrado"));

                projetoExistente.setNome(dto.getNome());
                projetoExistente.setCriador(criador);
                projetoExistente.setUsuarios(dto.getUsuariosIds() != null
                                ? new HashSet<>(usuarioRepository.findAllById(dto.getUsuariosIds()))
                                : new HashSet<>());
                projetoExistente.setAprovadores(dto.getAprovadoresIds() != null
                                ? new HashSet<>(usuarioRepository.findAllById(dto.getAprovadoresIds()))
                                : new HashSet<>());

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

        public ProjetoResponseDTO adicionarAprovador(Long projetoId, List<Long> usuarioId) {
                Projeto projeto = projetoRepository.findById(projetoId)
                                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

                for (var id : usuarioId) {
                        Usuario usuario = usuarioRepository.findById(id)
                                        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

                        projeto.getAprovadores().add(usuario);
                        projeto.getUsuarios().remove(usuario);
                }

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

        public List<Documento> getDocumentos(Long projetoId) {
                return projetoRepository.findById(projetoId).map(Projeto::getDocumentos)
                                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
        }
}