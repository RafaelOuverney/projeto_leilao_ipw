package io.github.rafaelouverney.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "lance")
public class Lance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Float valorLance;
    @DateTimeFormat
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "id_leilao")
    private Leilao leilao;
}
