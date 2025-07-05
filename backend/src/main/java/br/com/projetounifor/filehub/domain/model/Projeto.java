package br.com.projetounifor.filehub.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.Set;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Projeto {
    @Id @GeneratedValue
    private Long id;
    private String nome;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dataCriacao;

    @ManyToOne
    private Usuario criador;

    @ManyToMany
    private Set<Usuario> usuarios;

    @ManyToMany
    private Set<Usuario> aprovadores;
    
 // Método executado automaticamente antes de persistir a entidade
    @PrePersist
    private void prePersist() {
        this.dataCriacao = new Date();
    }
}
