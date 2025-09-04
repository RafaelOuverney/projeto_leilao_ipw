package com.leilao.backend.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.leilao.backend.model.Categoria;
import com.leilao.backend.model.Item;
import com.leilao.backend.model.Leilao;
import com.leilao.backend.repository.CategoriaRepository;
import com.leilao.backend.service.LeilaoService;

@RestController
@RequestMapping("/leilao")
@CrossOrigin(origins = "http://localhost:3000")
public class LeilaoController {

    @Autowired
    private LeilaoService leilaoService;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @GetMapping
    public ResponseEntity<Page<Leilao>> buscarTodos(Pageable pageable) {
        return ResponseEntity.ok(leilaoService.buscarTodos(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Leilao> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(leilaoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Leilao> inserir(@RequestBody LeilaoRequest request) {
        Leilao leilao = new Leilao();
        leilao.setTitulo(request.getTitulo());
        leilao.setDescricao(request.getDescricao());
        leilao.setValorInicial(BigDecimal.valueOf(request.getValorInicial()));
        leilao.setDataInicio(request.getDataInicio());
        leilao.setDataFim(request.getDataFim());

        if (request.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoria não encontrada: " + request.getCategoriaId()));
            leilao.setCategoria(categoria);
        }

        if (request.getItens() != null) {
            for (Item item : request.getItens()) {
                item.setLeilao(leilao);
            }
            leilao.setItens(request.getItens());
        }

        Leilao saved = leilaoService.inserir(leilao);
        return ResponseEntity.ok(saved);
    }

    @PutMapping
    public ResponseEntity<Leilao> alterar(@RequestBody Leilao leilao) {
        return ResponseEntity.ok(leilaoService.alterar(leilao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        leilaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    // DTO for request
    public static class LeilaoRequest {
        private String titulo;
        private String descricao;
        private double valorInicial;
        private LocalDateTime dataInicio;
        private LocalDateTime dataFim;
        private Long categoriaId;
        private List<Item> itens;

        // Getters and Setters
        public String getTitulo() { return titulo; }
        public void setTitulo(String titulo) { this.titulo = titulo; }

        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }

        public double getValorInicial() { return valorInicial; }
        public void setValorInicial(double valorInicial) { this.valorInicial = valorInicial; }

        public LocalDateTime getDataInicio() { return dataInicio; }
        public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }

        public LocalDateTime getDataFim() { return dataFim; }
        public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }

        public Long getCategoriaId() { return categoriaId; }
        public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }

        public List<Item> getItens() { return itens; }
        public void setItens(List<Item> itens) { this.itens = itens; }
    }
}