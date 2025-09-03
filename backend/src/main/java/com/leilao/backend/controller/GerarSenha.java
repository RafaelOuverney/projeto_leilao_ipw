package com.leilao.backend.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GerarSenha {
    public static void main(String[] args) {
        BCryptPasswordEncoder enconde = new BCryptPasswordEncoder();
        System.out.println(enconde.encode("123"));
    }
}
