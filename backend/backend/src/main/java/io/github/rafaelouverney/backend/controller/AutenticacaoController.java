package io.github.rafaelouverney.backend.controller;

import io.github.rafaelouverney.backend.dto.PessoaRequisicaoDTO;
import io.github.rafaelouverney.backend.service.AutenticacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/autenticacao")
public class AutenticacaoController {
    @Autowired
    private AutenticacaoService autenticacaoService;

    @PostMapping("/login")
    public String login(@RequestBody PessoaRequisicaoDTO pessoa) {
        return autenticacaoService.autenticar(pessoa);
    }
}
