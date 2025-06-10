package io.github.rafaelouverney.backend.controller;

import io.github.rafaelouverney.backend.service.HelloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import io.github.rafaelouverney.backend.model.Calculadora;


@RestController
public class Hello {

    @Autowired
    private HelloService calculadora;
    @Autowired
    private HelloService helloService;

    @GetMapping("/")
    public String hello() {
        return "Hello Spring!";
    }

    @GetMapping("/somar")
        public Integer somar (@RequestParam("v1") Integer valor1, @RequestParam("v2") Integer valor2){
            return valor1 + valor2;
        }

    @PostMapping("/somar")
    public Calculadora somar(@RequestBody Calculadora calculadora) {
        return helloService.somar(calculadora);
    }

}
