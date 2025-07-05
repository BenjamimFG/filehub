package br.com.projetounifor.filehub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjetoRequestDTO {
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    @NotNull(message = "Criador é obrigatório")
    private Long criadorId;
    private List<Long> usuariosIds;
    private List<Long> aprovadoresIds;
}