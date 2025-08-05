package io.github.rafaelouverney.backend.enums;


public enum StatusLeilao {
    ABERTO("Aberto"),
    ENCERRADO("Encerrado"),
    CANCELADO("Cancelado"),
    EM_ANALISE("Em Análise");

    private final String descricao;

    StatusLeilao(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
