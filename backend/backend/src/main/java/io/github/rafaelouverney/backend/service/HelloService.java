package io.github.rafaelouverney.backend.service;

import io.github.rafaelouverney.backend.model.Calculadora;
import org.springframework.stereotype.Service;


@Service
public class HelloService {
    public Calculadora somar(Calculadora calculadora) {
        calculadora.setResultado(calculadora.getValor1() + calculadora.getValor2());
        return calculadora;
    }
}
