package com.leilao.backend.service;

// ...existing imports...

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import com.leilao.backend.exception.NaoEncontradoExcecao;
import com.leilao.backend.model.Pessoa;
import com.leilao.backend.repository.PessoaRepository;
import com.leilao.backend.model.PessoaPerfil;
import com.leilao.backend.repository.PerfilRepository;

@Service
public class PessoaService implements UserDetailsService {
    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PerfilRepository perfilRepository;

    public Pessoa inserir(Pessoa pessoa) {
        Pessoa pessoaCadastrada = pessoaRepository.save(pessoa);
        // emailService.enviarEmailSimples(pessoaCadastrada.getEmail(), "Cadastrado com
        // Sucesso", "Cadastro no Sistema de Leilão XXX foi feito com sucesso!");
        enviarEmailSucesso(pessoaCadastrada);
        return pessoaCadastrada;
    }

    private void enviarEmailSucesso(Pessoa pessoa) {
        Context context = new Context();
        context.setVariable("nome", pessoa.getNome());
        emailService.emailTemplate(pessoa.getEmail(), "Cadastro Sucesso", context, "cadastroSucesso");
    }

    public Pessoa alterar(Pessoa pessoa) {
        // return pessoaRepository.save(pessoa);
        Pessoa pessoaBanco = buscarPorId(pessoa.getId());
        pessoaBanco.setNome(pessoa.getNome());
        pessoaBanco.setEmail(pessoa.getEmail());
        // update pessoaPerfil if provided (mutate existing collection to avoid orphanRemoval errors)
        if (pessoa.getPessoaPerfil() != null) {
            java.util.List<PessoaPerfil> existing = pessoaBanco.getPessoaPerfil();
            java.util.List<PessoaPerfil> toAdd = new java.util.ArrayList<>();
            for (PessoaPerfil pp : pessoa.getPessoaPerfil()) {
                if (pp.getPerfil() != null && pp.getPerfil().getId() != null) {
                    var perfilBanco = perfilRepository.findById(pp.getPerfil().getId())
                            .orElseThrow(() -> new RuntimeException("Perfil não encontrado: " + pp.getPerfil().getId()));
                    PessoaPerfil novo = new PessoaPerfil();
                    novo.setPerfil(perfilBanco);
                    novo.setPessoa(pessoaBanco);
                    toAdd.add(novo);
                }
            }
            if (existing == null) {
                // safe to set when there was no previous collection
                pessoaBanco.setPessoaPerfil(toAdd);
            } else {
                existing.clear();
                existing.addAll(toAdd);
            }
        }

        return pessoaRepository.save(pessoaBanco);
    }

    public void excluir(Long id) {
        Pessoa pessoaBanco = buscarPorId(id);
        pessoaRepository.delete(pessoaBanco);
    }

    public Pessoa buscarPorId(Long id) {
        return pessoaRepository.findById(id)
                .orElseThrow(() -> new NaoEncontradoExcecao(messageSource.getMessage("pessoa.notfound",
                        new Object[] { id }, LocaleContextHolder.getLocale())));
    }

    public Page<Pessoa> buscarTodos(Pageable pageable) {
        return pessoaRepository.findAll(pageable);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return pessoaRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Pessoa não encontrada"));
    }

}
