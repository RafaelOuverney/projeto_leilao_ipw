package io.github.rafaelouverney.backend.controller;

import io.github.rafaelouverney.backend.model.Perfil;
import io.github.rafaelouverney.backend.service.PerfilService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/perfil") // Corrigido
public class PerfilController {

    @Autowired
    private PerfilService perfilService; // Corrigido

    @GetMapping
    public ResponseEntity<Page<Perfil>> buscarTodos(Pageable pageable){ // Corrigido
        return ResponseEntity.ok(perfilService.buscarTodos(pageable));
    }

    @PostMapping
    public ResponseEntity<Perfil> inserir(@Valid @RequestBody Perfil perfil){ // Corrigido
        return ResponseEntity.ok(perfilService.inserir(perfil));
    }

    @PutMapping
    public ResponseEntity<Perfil> atualizar(@Valid @RequestBody Perfil perfil){ // Corrigido
        return ResponseEntity.ok(perfilService.atualizar(perfil));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluir(@PathVariable("id") Long id){
        perfilService.excluir(id);
        return ResponseEntity.ok("Perfil excluído com sucesso!");
    }
}