package io.github.rafaelouverney.backend.service;

import io.github.rafaelouverney.backend.model.Pessoa;
import io.github.rafaelouverney.backend.repository.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;


import java.util.NoSuchElementException;

@Service
public class PessoaService {
    @Autowired
    private PessoaRepository pessoaRepository;

    private MessageSource messageSource;

    @Autowired
    private EmailService emailService;

    public Pessoa inserir(Pessoa pessoa){
        Pessoa pessoaCadastrada = pessoaRepository.save(pessoa);
        enviarEmailSucesso(pessoaCadastrada);
        //emailService.enviarEmailSimples(pessoaCadastrada.getEmail(), "Cadastro Realizado com sucesso",  "Cadastro no sistema de leilão");
        return pessoaCadastrada;
    }

    public Pessoa atualizar(Pessoa pessoa){
        Pessoa pessoaBanco =  buscarPorId(pessoa.getId());
        pessoa.setNome(pessoa.getNome());
        pessoa.setEmail(pessoa.getEmail());
        pessoa.setSenha(pessoa.getSenha());
        return pessoaRepository.save(pessoaBanco);

    }

    public void excluir(Long id){
        Pessoa pessoaBanco =  buscarPorId(id);
        pessoaRepository.delete(pessoaBanco);
    }

    public Pessoa buscarPorId(Long id){
        return pessoaRepository.findById(id).orElseThrow(() -> new NoSuchElementException(messageSource.getMessage("pessoa.notfound",new Object[]{id},
                LocaleContextHolder.getLocale())));
    }

    public Page<Pessoa> buscarTodos(Pageable pageable) {
        return pessoaRepository.findAll(pageable);
    }

    private void enviarEmailSucesso(Pessoa pessoa){
        Context context = new Context();
        context.setVariable("nome", pessoa.getNome());
        emailService.emailTemplate(pessoa.getEmail(), "Cadastro Sucesso", context, "cadastroSucesso");
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return pessoaRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("Pessoa não encontrada"));
    }
}
