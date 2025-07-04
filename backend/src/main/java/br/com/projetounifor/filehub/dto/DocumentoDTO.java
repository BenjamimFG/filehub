package br.com.projetounifor.filehub.dto;

import java.time.LocalDateTime;

import br.com.projetounifor.filehub.domain.model.enums.StatusDocumento;
import lombok.Data;

@Data
public class DocumentoDTO {
    private Long id;
    private String nomeArquivo;
    private String caminhoArquivo;
    private Integer versao;
    private StatusDocumento status;

    private Long projetoId;
    private Long criadoPorId;
    private Long aprovadoPorId;

    private LocalDateTime criadoEm;
    private LocalDateTime aprovadoEm;
}

