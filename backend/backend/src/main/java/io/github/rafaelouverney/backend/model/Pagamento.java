package io.github.rafaelouverney.backend.model;


import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "pagamento")
public class Pagamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Float valor;
    private Integer nota;
    @DateTimeFormat
    private LocalDateTime dataHora;
}
