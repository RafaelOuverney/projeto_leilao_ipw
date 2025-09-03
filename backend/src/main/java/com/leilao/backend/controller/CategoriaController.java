package com.leilao.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.leilao.backend.model.Categoria;
import com.leilao.backend.repository.CategoriaRepository;

import java.net.URI;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/categoria")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoriaController {

    private static final Logger logger = LoggerFactory.getLogger(CategoriaController.class);

    @Autowired
    private CategoriaRepository repository;

    @GetMapping
    public ResponseEntity<?> listar(@RequestParam Optional<Integer> page, @RequestParam Optional<Integer> size) {
        if (page.isPresent() && size.isPresent()) {
            Pageable pageable = PageRequest.of(page.get(), size.get());
            Page<Categoria> p = repository.findAll(pageable);
            return ResponseEntity.ok(p);
        }
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> buscar(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> criar(@RequestBody Categoria categoria) {
        if (categoria == null || categoria.getNome() == null || categoria.getNome().trim().isEmpty()) {
            logger.warn("POST /categoria - payload inválido");
            Map<String, String> err = new HashMap<>();
            err.put("error", "Payload inválido");
            err.put("detail", "Campo 'nome' é obrigatório");
            return ResponseEntity.badRequest().body(err);
        }

        try {

            categoria.setId(null);
            logger.info("POST /categoria payload nome={}", categoria.getNome());
            Categoria c = repository.save(categoria);
            logger.info("Categoria criada id={} nome={}", c.getId(), c.getNome());
            return ResponseEntity.created(URI.create("/categoria/" + c.getId())).body(c);
        } catch (Exception ex) {
            logger.error("Erro ao salvar categoria", ex);
            Map<String, String> err = new HashMap<>();
            err.put("error", "Erro ao salvar categoria");
            err.put("detail", ex.getMessage());
            return ResponseEntity.status(500).body(err);
        }
    }

    @PutMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> alterar(@RequestBody Categoria categoria) {
        if (categoria == null || categoria.getId() == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Payload inválido");
            err.put("detail", "Campo 'id' é obrigatório para atualização");
            return ResponseEntity.badRequest().body(err);
        }
        if (!repository.existsById(categoria.getId())) return ResponseEntity.notFound().build();
        try {
            Categoria saved = repository.save(categoria);
            return ResponseEntity.ok(saved);
        } catch (Exception ex) {
            logger.error("Erro ao atualizar categoria id={}", categoria.getId(), ex);
            Map<String, String> err = new HashMap<>();
            err.put("error", "Erro ao atualizar categoria");
            err.put("detail", ex.getMessage());
            return ResponseEntity.status(500).body(err);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

