package br.com.projetounifor.filehub.domain.repository;

import java.util.List;

import br.com.projetounifor.filehub.domain.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DocumentoRepository extends JpaRepository<Documento, Long> {
    List<Documento> findByProjetoId(Long projetoId);
}
