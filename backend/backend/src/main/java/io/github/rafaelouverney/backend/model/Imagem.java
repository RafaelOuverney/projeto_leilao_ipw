package io.github.rafaelouverney.backend.model;


import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "imagem")
public class Imagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @DateTimeFormat
    private LocalDateTime dataHoraCadastro;
    private String nomeImagem;
}
