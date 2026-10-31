package com.example.servicopedido.controller;

// o header X-User-Id (preenchido pelo gateway) nao veio ou nao e um numero
public class UsuarioNaoIdentificadoException extends RuntimeException {
    public UsuarioNaoIdentificadoException(String mensagem) {
        super(mensagem);
    }
}
