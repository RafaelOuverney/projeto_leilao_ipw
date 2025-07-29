package io.github.rafaelouverney.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import io.github.rafaelouverney.backend.model.Pessoa;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {

//    @Query("from pessoa where email=:email")
//    public Page<Pessoa> findByEmail(@Param("email") String email, Pageable pageable);

    public Optional<Pessoa> findByEmail(String email);
}
