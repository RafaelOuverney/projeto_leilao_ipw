package io.github.rafaelouverney.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import io.github.rafaelouverney.backend.model.Pessoa;
public interface PessoaRepository extends JpaRepository<Pessoa, Long> {

}
