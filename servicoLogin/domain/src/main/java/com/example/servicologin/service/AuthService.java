package com.example.servicologin.service;

import com.example.servicologin.entity.Perfil;
import com.example.servicologin.entity.Sessao;
import com.example.servicologin.entity.Usuario;
import com.example.servicologin.exception.CredenciaisInvalidasException;
import com.example.servicologin.exception.RegraDeNegocioException;
import com.example.servicologin.repository.UsuarioRepository;
import com.example.servicologin.security.SenhaCodificador;
import com.example.servicologin.security.TokenEmissor;

public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final SenhaCodificador senhaCodificador;
    private final TokenEmissor tokenEmissor;

    public AuthService(UsuarioRepository usuarioRepository,
                       SenhaCodificador senhaCodificador,
                       TokenEmissor tokenEmissor) {
        this.usuarioRepository = usuarioRepository;
        this.senhaCodificador = senhaCodificador;
        this.tokenEmissor = tokenEmissor;
    }

    // cadastro publico (tela de "criar conta"): sempre CLIENTE
    public Usuario registrar(String nome, String email, String senha) {
        return criar(nome, email, senha, Perfil.CLIENTE);
    }

    // so o ADMIN chega aqui (regra no SecurityConfig): cria funcionario da COZINHA ou outro ADMIN
    public Usuario registrarComPerfil(String nome, String email, String senha, Perfil perfil) {
        if (perfil == null) {
            throw new RegraDeNegocioException("Informe o perfil (CLIENTE, COZINHA ou ADMIN)");
        }
        return criar(nome, email, senha, perfil);
    }

    // usado na subida da aplicacao para garantir os usuarios iniciais.
    // se o email ja existir, nao mexe nele.
    public Usuario garantirUsuario(String nome, String email, String senha, Perfil perfil) {
        return usuarioRepository.buscarPorEmail(normalizar(email))
                .orElseGet(() -> criar(nome, email, senha, perfil));
    }

    public Sessao login(String email, String senha) {
        Usuario usuario = usuarioRepository.buscarPorEmail(normalizar(email))
                .orElseThrow(() -> new CredenciaisInvalidasException("Email ou senha invalidos"));

        if (senha == null || !senhaCodificador.confere(senha, usuario.senha())) {
            throw new CredenciaisInvalidasException("Email ou senha invalidos");
        }

        String token = tokenEmissor.emitir(usuario.id(), usuario.email(), usuario.nome(), usuario.perfil());
        return new Sessao(token, usuario.nome(), usuario.perfil());
    }

    private Usuario criar(String nome, String email, String senha, Perfil perfil) {
        if (vazio(nome) || vazio(email) || vazio(senha)) {
            throw new RegraDeNegocioException("Nome, email e senha sao obrigatorios");
        }

        String emailNormalizado = normalizar(email);

        if (!emailNormalizado.contains("@")) {
            throw new RegraDeNegocioException("Email invalido");
        }
        if (usuarioRepository.existePorEmail(emailNormalizado)) {
            throw new RegraDeNegocioException("Email ja cadastrado");
        }

        Usuario usuario = new Usuario(null, nome.trim(), emailNormalizado, senhaCodificador.codificar(senha), perfil);
        return usuarioRepository.salvar(usuario);
    }

    // "Ana@X.com " e "ana@x.com" sao o mesmo usuario
    private String normalizar(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private boolean vazio(String valor) {
        return valor == null || valor.isBlank();
    }
}
