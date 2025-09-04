package com.leilao.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.leilao.backend.exception.NaoEncontradoExcecao;
import com.leilao.backend.model.Leilao;
import com.leilao.backend.repository.LeilaoRepository;

@Service
public class LeilaoService {
    @Autowired
    private LeilaoRepository leilaoRepository;

    public Leilao inserir(Leilao leilao) {
        return leilaoRepository.save(leilao);
    }

    public Leilao alterar(Leilao leilao) {
        Leilao leilaoBanco = buscarPorId(leilao.getId());
        leilaoBanco.setTitulo(leilao.getTitulo());
        leilaoBanco.setDescricao(leilao.getDescricao());
        leilaoBanco.setValorInicial(leilao.getValorInicial());
        leilaoBanco.setDataInicio(leilao.getDataInicio());
        leilaoBanco.setDataFim(leilao.getDataFim());
        leilaoBanco.setCategoria(leilao.getCategoria());
        return leilaoRepository.save(leilaoBanco);
    }

    public void excluir(Long id) {
        Leilao leilaoBanco = buscarPorId(id);
        leilaoRepository.delete(leilaoBanco);
    }

    public Leilao buscarPorId(Long id) {
        return leilaoRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Leilão não encontrado: " + id));
    }

    public Page<Leilao> buscarTodos(Pageable pageable) {
        return leilaoRepository.findAll(pageable);
    }
}

