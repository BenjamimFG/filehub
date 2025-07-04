package br.com.projetounifor.filehub.dto;

import br.com.projetounifor.filehub.domain.model.enums.Perfil;
import lombok.Data;

@Data
public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String username;
    private Perfil perfil;
}
