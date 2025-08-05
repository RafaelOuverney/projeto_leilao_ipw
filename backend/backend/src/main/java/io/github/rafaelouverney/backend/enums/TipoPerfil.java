package io.github.rafaelouverney.backend.enums;

public enum TipoPerfil {
    ADMIN("Administrador"),
    COMPRADOR("Comprador"),
    VENDEDOR("Vendedor");

    private final String descricao;

    TipoPerfil(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

}
