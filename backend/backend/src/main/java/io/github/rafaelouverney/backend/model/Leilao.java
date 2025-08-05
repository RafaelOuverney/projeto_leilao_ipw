package io.github.rafaelouverney.backend.model;


import io.github.rafaelouverney.backend.enums.StatusLeilao;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table (name = "leilao")
public class Leilao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotEmpty(message = "{validation.title.notblank}")
    private String titulo;
    private String descricao;
    private String descricaoDetalhada;
    @NotEmpty(message = "{validation.startdate.notblank}")
    private LocalDateTime dataHoraInicio;
    @NotEmpty(message = "{validation.enddate.notblank}")
    private LocalDateTime dataHoraFim;
    @Enumerated(EnumType.STRING)
    private StatusLeilao statusLeilao;
    private String observacao;
    private Float valorIncremento;
    private Float lanceMinimo;

    @ManyToMany
    @JoinTable(
        name = "leilao_lance",
        joinColumns = @JoinColumn(name = "id_leilao"),
        inverseJoinColumns = @JoinColumn(name = "id_lance")
    )
    private List<Lance> lances;
}
