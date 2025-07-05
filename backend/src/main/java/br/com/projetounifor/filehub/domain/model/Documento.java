package br.com.projetounifor.filehub.domain.model;

import br.com.projetounifor.filehub.domain.model.enums.StatusDocumento;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Documento {
    @Id
    @GeneratedValue
    private Long id;
    private String nomeArquivo;
    private String caminhoArquivo;
    private Integer versao;

    @Enumerated(EnumType.STRING)
    private StatusDocumento status;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Projeto projeto;

    @ManyToOne
    private Usuario criadoPor;

    @ManyToOne
    private Usuario aprovadoPor;

    private LocalDateTime criadoEm;
    private LocalDateTime aprovadoEm;
}
