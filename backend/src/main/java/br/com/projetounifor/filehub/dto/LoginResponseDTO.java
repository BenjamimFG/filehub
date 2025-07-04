package br.com.projetounifor.filehub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private String token;
    private Long id;
    private String nome;
    private String perfil;
    private List<Long> repositoriosMembro;

}
