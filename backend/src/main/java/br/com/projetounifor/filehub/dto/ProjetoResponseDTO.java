package br.com.projetounifor.filehub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjetoResponseDTO {
    private Long id;
    private String nome;
    private Long criadorId;
    private List<Long> usuariosIds;
    private List<Long> aprovadoresIds;
}
