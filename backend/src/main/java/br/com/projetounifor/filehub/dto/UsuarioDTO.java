package br.com.projetounifor.filehub.dto;

import br.com.projetounifor.filehub.domain.model.enums.Perfil;
import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    private String nome;
    private String email;
    private String username;
    private String senha;
    private Perfil perfil;
}
