package com.leilao.backend.exception;

public class NaoEncontradoExcecao extends RuntimeException {

    public NaoEncontradoExcecao(String mensagem) {
        super(mensagem);
    }

}
