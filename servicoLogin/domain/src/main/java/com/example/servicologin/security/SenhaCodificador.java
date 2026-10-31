package com.example.servicologin.security;

// porta: o dominio so sabe que existe "alguem" que codifica senha
public interface SenhaCodificador {
    String codificar(String senhaPura);

    boolean confere(String senhaPura, String senhaCodificada);
}
