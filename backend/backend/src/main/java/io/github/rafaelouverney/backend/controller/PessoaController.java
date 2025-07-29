package io.github.rafaelouverney.backend.controller;

import io.github.rafaelouverney.backend.model.Pessoa;
import io.github.rafaelouverney.backend.service.PessoaService;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pessoa")
public class PessoaController {
    @Autowired
    private PessoaService pessoaService;
    @GetMapping
    public ResponseEntity<Page<Pessoa>> buscarTodos(Pageable pageable){
            return  ResponseEntity.ok(pessoaService.buscarTodos(pageable));
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
