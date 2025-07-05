package br.com.projetounifor.filehub.domain.model;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import br.com.projetounifor.filehub.dto.ProjetoRequestDTO;
import br.com.projetounifor.filehub.dto.ProjetoResponseDTO;

public class ProjetoMapper {
    public static Projeto toEntity(ProjetoRequestDTO dto, Usuario criador, Set<Usuario> usuarios, Set<Usuario> aprovadores) {
        Projeto projeto = new Projeto();
        projeto.setNome(dto.getNome());
        projeto.setCriador(criador);
        projeto.setUsuarios(new HashSet<>(usuarios));
        projeto.setAprovadores(new HashSet<>(aprovadores));
        // dataCriacao é definida pelo @PrePersist
        return projeto;
    }

    public static ProjetoResponseDTO toResponseDTO(Projeto projeto) {
        ProjetoResponseDTO dto = new ProjetoResponseDTO();
        dto.setId(projeto.getId());
        dto.setNome(projeto.getNome());
        dto.setDataCriacao(projeto.getDataCriacao());
        dto.setCriadorId(projeto.getCriador().getId());
        dto.setUsuariosIds(projeto.getUsuarios().stream().map(Usuario::getId).collect(Collectors.toList()));
        dto.setAprovadoresIds(projeto.getAprovadores().stream().map(Usuario::getId).collect(Collectors.toList()));
        return dto;
    }
}