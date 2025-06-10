package io.github.rafaelouverney.backend.controller;

import io.github.rafaelouverney.backend.model.Pessoa;
import io.github.rafaelouverney.backend.service.PessoaService;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pessoa")
public class PessoaController {
    @Autowired
    private PessoaService pessoaService;
    @GetMapping
    public ResponseEntity<List<Pessoa>> buscarTodos(){
            return  ResponseEntity.ok(pessoaService.buscarTodos());
    }

    @PostMapping
    public ResponseEntity<Pessoa> inserir (@Valid @RequestBody Pessoa pessoa){
        return   ResponseEntity.ok(pessoaService.inserir(pessoa));
    }

    @PutMapping
    public ResponseEntity<Pessoa> atualizar (@Valid @RequestBody Pessoa pessoa){
        return   ResponseEntity.ok(pessoaService.atualizar(pessoa));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluir (@Valid @PathParam("id") Long id){
        pessoaService.excluir(id);
        return ResponseEntity.ok("Excluido com sucesso!");
    }
}
