package com.leilao.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leilao.backend.model.Leilao;

public interface LeilaoRepository extends JpaRepository<Leilao, Long> {

}