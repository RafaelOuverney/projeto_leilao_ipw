package com.leilao.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.leilao.backend.exception.NaoEncontradoExcecao;
import com.leilao.backend.model.Item;
import com.leilao.backend.repository.ItemRepository;

@Service
public class ItemService {
    @Autowired
    private ItemRepository itemRepository;

    public Item inserir(Item item) {
        return itemRepository.save(item);
    }

    public Item alterar(Item item) {
        Item itemBanco = buscarPorId(item.getId());
        itemBanco.setNome(item.getNome());
        itemBanco.setDescricao(item.getDescricao());
        itemBanco.setPrecoInicial(item.getPrecoInicial());
        itemBanco.setLeilao(item.getLeilao());
        return itemRepository.save(itemBanco);
    }

    public void excluir(Long id) {
        Item itemBanco = buscarPorId(id);
        itemRepository.delete(itemBanco);
    }

    public Item buscarPorId(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao("Item não encontrado: " + id));
    }

    public Page<Item> buscarTodos(Pageable pageable) {
        return itemRepository.findAll(pageable);
    }

    public List<Item> buscarPorLeilaoId(Long leilaoId) {
        return itemRepository.findByLeilaoId(leilaoId);
    }
}

