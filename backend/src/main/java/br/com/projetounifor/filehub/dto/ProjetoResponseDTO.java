package br.com.projetounifor.filehub.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjetoResponseDTO {
    private Long id;
    private String nome;
    private LocalDateTime dataCriacao;
    private Long criadorId;
    private List<Long> usuariosIds;
    private List<Long> aprovadoresIds;
}