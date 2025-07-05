package br.com.projetounifor.filehub.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import br.com.projetounifor.filehub.dto.UsuarioRequestDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetounifor.filehub.domain.model.Usuario;
import br.com.projetounifor.filehub.domain.repository.UsuarioRepository;
import br.com.projetounifor.filehub.dto.UsuarioResponseDTO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;

	// Cadastrar novo usuário
	public UsuarioResponseDTO cadastrar(UsuarioRequestDTO usuarioDTO) {
		Usuario usuario = fromResquestDTO(usuarioDTO);
		usuario.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));
		return toDTO(usuarioRepository.save(usuario));
	}

	// Buscar todos os usuários
	public List<UsuarioResponseDTO> listarTodos() {
		return usuarioRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
	}

	// Buscar usuário por ID
	public Usuario buscarPorId(Long id) {
		return usuarioRepository.findById(id)
				.orElseThrow(() -> new NoSuchElementException("Usuário não encontrado com id: " + id));
	}

	// Atualizar usuário (por id)
	public Usuario atualizar(Long id, Usuario usuarioAtualizado) {
		Usuario usuarioExistente = buscarPorId(id);

		// Atualiza apenas os campos não nulos fornecidos
		if (usuarioAtualizado.getNome() != null) {
			usuarioExistente.setNome(usuarioAtualizado.getNome());
		}
		if (usuarioAtualizado.getEmail() != null) {
			usuarioExistente.setEmail(usuarioAtualizado.getEmail());
		}
		if (usuarioAtualizado.getSenha() != null) {
			usuarioExistente.setSenha(usuarioAtualizado.getSenha());
		}
		if (usuarioAtualizado.getPerfil() != null) {
			usuarioExistente.setPerfil(usuarioAtualizado.getPerfil());
		}
		if (usuarioAtualizado.getProjetos() != null) {
			usuarioExistente.setProjetos(usuarioAtualizado.getProjetos());
		}

		return usuarioRepository.save(usuarioExistente);
	}

	// Deletar usuário por ID
	public void deletar(Long id) {
		if (!usuarioRepository.existsById(id)) {
			throw new NoSuchElementException("Usuário não encontrado com id: " + id);
		}
		usuarioRepository.deleteById(id);
	}

	public UsuarioResponseDTO toDTO(Usuario usuario) {
		UsuarioResponseDTO dto = new UsuarioResponseDTO();
		dto.setId(usuario.getId());
		dto.setNome(usuario.getNome());
		dto.setEmail(usuario.getEmail());
		dto.setUsername(usuario.getUsername());
		dto.setPerfil(usuario.getPerfil());
		return dto;
	}

	public Usuario fromResquestDTO(UsuarioRequestDTO dto) {
		Usuario usuario = new Usuario();
		usuario.setNome(dto.getNome());
		usuario.setEmail(dto.getEmail());
		usuario.setUsername(dto.getUsername());
		usuario.setSenha(dto.getSenha());
		usuario.setPerfil(dto.getPerfil());
		return usuario;
	}

	public Usuario buscarPorUsername(String username) {
		return usuarioRepository.findByUsername(username)
				.orElseThrow(() -> new NoSuchElementException("Usuário não encontrado com username: " + username));
	}
}