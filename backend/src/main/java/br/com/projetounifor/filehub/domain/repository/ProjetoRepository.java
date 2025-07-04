package br.com.projetounifor.filehub.domain.repository;

import br.com.projetounifor.filehub.domain.model.Projeto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjetoRepository extends JpaRepository<Projeto, Long> {}

