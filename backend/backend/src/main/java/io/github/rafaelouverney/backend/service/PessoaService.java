package io.github.rafaelouverney.backend.service;

import io.github.rafaelouverney.backend.model.Pessoa;
import io.github.rafaelouverney.backend.repository.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.rmi.NoSuchObjectException;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PessoaService {
    @Autowired
    private PessoaRepository pessoaRepository;

    private MessageSource messageSource;

    public Pessoa inserir(Pessoa pessoa){
        return pessoaRepository.save(pessoa);
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

    public List<Pessoa> buscarTodos(){
        return pessoaRepository.findAll();
    }
}
