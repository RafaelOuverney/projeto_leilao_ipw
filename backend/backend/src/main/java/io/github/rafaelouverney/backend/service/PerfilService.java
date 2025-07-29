package io.github.rafaelouverney.backend.service;

import io.github.rafaelouverney.backend.model.Perfil;
import io.github.rafaelouverney.backend.repository.PerfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.util.NoSuchElementException;

@Service
public class PerfilService {

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private MessageSource messageSource;


    public Perfil inserir(Perfil perfil) {
        Perfil perfilCadastrado = perfilRepository.save(perfil);
        return perfilCadastrado;
    }

    public Perfil atualizar(Perfil perfil) {
        Perfil perfilBanco = buscarPorId(perfil.getId());
        perfilBanco.setNome(perfil.getNome());
        return perfilRepository.save(perfilBanco);
    }

    public void excluir(Long id) {
        Perfil perfil = buscarPorId(id);
        perfilRepository.delete(perfil);
    }

    public Perfil buscarPorId(Long id) {
        return perfilRepository.findById(id).orElseThrow(() -> new NoSuchElementException(messageSource.getMessage("perfil.notfound", new Object[]{id},
                LocaleContextHolder.getLocale())));
    }

    public Page<Perfil> buscarTodos(Pageable pageable) {
        return perfilRepository.findAll(pageable);
    }

}