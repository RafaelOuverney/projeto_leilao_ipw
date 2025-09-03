package com.leilao.backend.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "item")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String nome;
    private String descricao;
    private BigDecimal precoInicial;

    @ManyToOne
    @JoinColumn(name = "leilao_id")
    @JsonIgnore
    private Leilao leilao;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getPrecoInicial() { return precoInicial; }
    public void setPrecoInicial(BigDecimal precoInicial) { this.precoInicial = precoInicial; }

    public Leilao getLeilao() { return leilao; }
    public void setLeilao(Leilao leilao) { this.leilao = leilao; }
}