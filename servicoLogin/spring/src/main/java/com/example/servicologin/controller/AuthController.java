package com.example.servicologin.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.servicologin.controller.adapter.AuthControllerAdapter;
import com.example.servicologin.controller.dto.request.CriarUsuarioRequest;
import com.example.servicologin.controller.dto.request.LoginRequest;
import com.example.servicologin.controller.dto.request.RegistroRequest;
import com.example.servicologin.controller.dto.response.LoginResponse;
import com.example.servicologin.controller.dto.response.UsuarioResponse;
import com.example.servicologin.entity.Sessao;
import com.example.servicologin.security.TokenCookie;
import com.example.servicologin.service.AuthService;

// Quem pode chamar cada rota e decidido no GATEWAY (este servico nao tem Spring Security).
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final TokenCookie tokenCookie;

    public AuthController(AuthService authService, TokenCookie tokenCookie) {
        this.authService = authService;
        this.tokenCookie = tokenCookie;
    }

    // publico: tela "criar conta" do cliente
    @PostMapping("/registrar")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse registrar(@RequestBody RegistroRequest request) {
        return AuthControllerAdapter.castResponse(
                authService.registrar(request.nome(), request.email(), request.senha()));
    }

    // publico. O token NAO vai no corpo: vai num cookie HttpOnly (header Set-Cookie).
    // O corpo so devolve o que a tela precisa mostrar: nome e perfil.
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Sessao sessao = authService.login(request.email(), request.senha());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, tokenCookie.criar(sessao.token()).toString())
                .body(AuthControllerAdapter.castResponse(sessao));
    }

    // como o cookie e HttpOnly, o front nao consegue apaga-lo sozinho: pede para o servidor expira-lo
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, tokenCookie.apagar().toString())
                .build();
    }

    // so ADMIN (regra no gateway): cria usuario da COZINHA, outro ADMIN, etc.
    @PostMapping("/usuarios")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse criarUsuario(@RequestBody CriarUsuarioRequest request) {
        return AuthControllerAdapter.castResponse(
                authService.registrarComPerfil(
                        request.nome(),
                        request.email(),
                        request.senha(),
                        AuthControllerAdapter.castPerfil(request.perfil())));
    }
}
