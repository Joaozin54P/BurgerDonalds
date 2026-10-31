package com.example.servicologin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.servicologin.entity.Perfil;
import com.example.servicologin.service.AuthService;

// garante que sempre existe um ADMIN e um usuario da COZINHA para testar
// (se ja existirem no banco, nao faz nada). Dados no application.yaml.
@Configuration
public class UsuariosIniciaisConfig {

    @Bean
    public CommandLineRunner criarUsuariosIniciais(AuthService authService,
                                                   @Value("${app.admin.nome}") String adminNome,
                                                   @Value("${app.admin.email}") String adminEmail,
                                                   @Value("${app.admin.senha}") String adminSenha,
                                                   @Value("${app.cozinha.nome}") String cozinhaNome,
                                                   @Value("${app.cozinha.email}") String cozinhaEmail,
                                                   @Value("${app.cozinha.senha}") String cozinhaSenha) {
        return args -> {
            authService.garantirUsuario(adminNome, adminEmail, adminSenha, Perfil.ADMIN);
            authService.garantirUsuario(cozinhaNome, cozinhaEmail, cozinhaSenha, Perfil.COZINHA);
        };
    }
}
