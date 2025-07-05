package br.com.projetounifor.filehub.dto;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjetoRequestDTO {
    private String nome;
    private Long criadorId;
    private List<Long> usuariosIds;
    private List<Long> aprovadoresIds;
}
