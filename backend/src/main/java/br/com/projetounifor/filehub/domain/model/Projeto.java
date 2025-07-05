package br.com.projetounifor.filehub.domain.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Projeto {
    @Id
    @GeneratedValue
    private Long id;
    private String nome;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime dataCriacao;

    @ManyToOne
    private Usuario criador;

    @ManyToMany
    private Set<Usuario> usuarios;

    @ManyToMany
    private Set<Usuario> aprovadores;

    @OneToMany(mappedBy = "projeto")
    private List<Documento> documentos;

    @PrePersist
    private void prePersist() {
        this.dataCriacao = LocalDateTime.now();
    }

}
