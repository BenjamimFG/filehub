package br.com.projetounifor.filehub.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProjetoDTO {
    private String nome;
    private Long criadorId;
    private List<Long> usuariosIds;
    private List<Long> aprovadoresIds;
}
