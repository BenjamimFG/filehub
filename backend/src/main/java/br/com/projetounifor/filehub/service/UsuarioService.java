package br.com.projetounifor.filehub.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.domain.repository.UsuarioRepository;
import br.com.projetounifor.filehub.dto.UsuarioDTO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Cadastrar novo usuário
    public UsuarioDTO cadastrar(UsuarioDTO  usuarioDTO) {
        Usuario usuario = fromDTO(usuarioDTO);
        usuario.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));
        return toDTO(usuarioRepository.save(usuario));
    }

    // Buscar todos os usuários
    public List<UsuarioDTO> listarTodos() {
            return usuarioRepository.findAll()
                    .stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
    }

    // Buscar usuário por ID
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuário não encontrado com id: " + id));
    }

    // Atualizar usuário (por id)
    public Usuario atualizar(Long id, Usuario usuarioAtualizado) {
        Usuario usuarioExistente = buscarPorId(id);

        // Atualize os campos que deseja permitir alteração
        usuarioExistente.setNome(usuarioAtualizado.getNome());
        usuarioExistente.setEmail(usuarioAtualizado.getEmail());
        usuarioExistente.setSenha(usuarioAtualizado.getSenha());
        usuarioExistente.setPerfil(usuarioAtualizado.getPerfil());
        usuarioExistente.setProjetos(usuarioAtualizado.getProjetos());

        return usuarioRepository.save(usuarioExistente);
    }

    // Deletar usuário por ID
    public void deletar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new NoSuchElementException("Usuário não encontrado com id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    public UsuarioDTO toDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setUsername(usuario.getUsername());
        dto.setPerfil(usuario.getPerfil());
        return dto;
    }

    public Usuario fromDTO(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setUsername(dto.getUsername());
        usuario.setSenha(dto.getSenha());
        usuario.setPerfil(dto.getPerfil());
        return usuario;
    }

}