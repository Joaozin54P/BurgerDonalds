package com.example.servicologin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.servicologin.repository.UsuarioRepository;
import com.example.servicologin.security.SenhaCodificador;
import com.example.servicologin.security.TokenEmissor;
import com.example.servicologin.service.AuthService;

// o AuthService vive no modulo domain (sem anotacao do Spring),
// entao registramos ele como bean aqui
@Configuration
public class AuthServiceConfig {

    @Bean
    public AuthService authService(UsuarioRepository usuarioRepository,
                                   SenhaCodificador senhaCodificador,
                                   TokenEmissor tokenEmissor) {
        return new AuthService(usuarioRepository, senhaCodificador, tokenEmissor);
    }
}
