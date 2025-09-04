package com.leilao.backend.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.leilao.backend.model.Item;
import com.leilao.backend.model.Leilao;
import com.leilao.backend.repository.LeilaoRepository;
import com.leilao.backend.service.ItemService;

@RestController
@RequestMapping("/item")
@CrossOrigin(origins = "http://localhost:3000")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private LeilaoRepository leilaoRepository;

    @GetMapping
    public ResponseEntity<?> buscarTodos(@RequestParam Optional<Long> leilaoId, Pageable pageable) {
        if (leilaoId.isPresent()) {
            List<Item> items = itemService.buscarPorLeilaoId(leilaoId.get());
            return ResponseEntity.ok(items);
        } else {
            Page<Item> page = itemService.buscarTodos(pageable);
            return ResponseEntity.ok(page);
        }
    }

    @PostMapping
    public ResponseEntity<Item> inserir(@RequestBody ItemRequest request) {
        Item item = new Item();
        item.setNome(request.getNome());
        item.setDescricao(request.getDescricao());
        item.setPrecoInicial(BigDecimal.valueOf(request.getPrecoInicial()));

        if (request.getLeilao() != null && request.getLeilao().getId() != null) {
            Leilao leilao = leilaoRepository.findById(request.getLeilao().getId())
                    .orElseThrow(() -> new RuntimeException("Leilão não encontrado: " + request.getLeilao().getId()));
            item.setLeilao(leilao);
        }

        Item saved = itemService.inserir(item);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        itemService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    public static class ItemRequest {
        private String nome;
        private String descricao;
        private double precoInicial;
        private Leilao leilao;

        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }

        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }

        public double getPrecoInicial() { return precoInicial; }
        public void setPrecoInicial(double precoInicial) { this.precoInicial = precoInicial; }

        public Leilao getLeilao() { return leilao; }
        public void setLeilao(Leilao leilao) { this.leilao = leilao; }
    }
}
