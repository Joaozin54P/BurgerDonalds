package com.example.servicologin.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.servicologin.entity.Perfil;
import com.example.servicologin.entity.Sessao;
import com.example.servicologin.entity.Usuario;
import com.example.servicologin.exception.CredenciaisInvalidasException;
import com.example.servicologin.exception.RegraDeNegocioException;
import com.example.servicologin.repository.UsuarioRepository;
import com.example.servicologin.security.SenhaCodificador;
import com.example.servicologin.security.TokenEmissor;

// teste do dominio puro: repositorio, senha e token sao "falsos" (sem Spring, sem banco)
class AuthServiceTest {

    private Map<String, Usuario> banco;
    private AuthService service;

    @BeforeEach
    void preparar() {
        banco = new HashMap<>();

        UsuarioRepository repository = new UsuarioRepository() {
            @Override
            public Usuario salvar(Usuario u) {
                Usuario salvo = new Usuario((long) banco.size() + 1, u.nome(), u.email(), u.senha(), u.perfil());
                banco.put(u.email(), salvo);
                return salvo;
            }

            @Override
            public Optional<Usuario> buscarPorEmail(String email) {
                return Optional.ofNullable(banco.get(email));
            }

            @Override
            public boolean existePorEmail(String email) {
                return banco.containsKey(email);
            }
        };

        SenhaCodificador senhas = new SenhaCodificador() {
            @Override
            public String codificar(String senhaPura) {
                return "#" + senhaPura;
            }

            @Override
            public boolean confere(String senhaPura, String senhaCodificada) {
                return ("#" + senhaPura).equals(senhaCodificada);
            }
        };

        TokenEmissor tokens = (id, email, nome, perfil) -> "token:" + id + ":" + perfil;

        service = new AuthService(repository, senhas, tokens);
    }

    @Test
    void cadastroPublicoCriaClienteComSenhaCodificada() {
        Usuario ana = service.registrar("Ana", "ana@x.com", "123");

        assertEquals(Perfil.CLIENTE, ana.perfil());
        assertEquals("#123", ana.senha()); // nunca guarda a senha pura
    }

    @Test
    void emailENormalizadoENaoPodeRepetir() {
        service.registrar("Ana", "Ana@X.com ", "123");

        assertTrue(banco.containsKey("ana@x.com"));
        assertThrows(RegraDeNegocioException.class, () -> service.registrar("Outra", "ANA@x.com", "456"));
    }

    @Test
    void recusaCamposVaziosEEmailInvalido() {
        assertThrows(RegraDeNegocioException.class, () -> service.registrar("", "a@x.com", "1"));
        assertThrows(RegraDeNegocioException.class, () -> service.registrar("Ana", null, "1"));
        assertThrows(RegraDeNegocioException.class, () -> service.registrar("Ana", "a@x.com", " "));
        assertThrows(RegraDeNegocioException.class, () -> service.registrar("Ana", "semarroba", "1"));
    }

    @Test
    void loginDevolveTokenComOPerfilDoUsuario() {
        service.garantirUsuario("Admin", "admin@x.com", "admin123", Perfil.ADMIN);

        Sessao sessao = service.login("ADMIN@x.com", "admin123");

        assertEquals(Perfil.ADMIN, sessao.perfil());
        assertEquals("Admin", sessao.nome());
        assertEquals("token:1:ADMIN", sessao.token()); // o token leva o ID do usuario (1o cadastrado), nao o e-mail
    }

    @Test
    void loginComSenhaErradaOuEmailInexistenteFalha() {
        service.registrar("Ana", "ana@x.com", "123");

        assertThrows(CredenciaisInvalidasException.class, () -> service.login("ana@x.com", "errada"));
        assertThrows(CredenciaisInvalidasException.class, () -> service.login("nao@existe.com", "123"));
        assertThrows(CredenciaisInvalidasException.class, () -> service.login("ana@x.com", null));
    }

    @Test
    void adminCriaFuncionarioDaCozinhaMasPerfilEObrigatorio() {
        Usuario cozinheiro = service.registrarComPerfil("Zé", "ze@x.com", "1", Perfil.COZINHA);

        assertEquals(Perfil.COZINHA, cozinheiro.perfil());
        assertThrows(RegraDeNegocioException.class, () -> service.registrarComPerfil("Y", "y@x.com", "1", null));
    }

    @Test
    void garantirUsuarioNaoDuplicaNemTrocaASenha() {
        service.garantirUsuario("Admin", "admin@x.com", "admin123", Perfil.ADMIN);
        service.garantirUsuario("Admin", "admin@x.com", "outra", Perfil.ADMIN);

        assertEquals(1, banco.size());
        assertEquals("#admin123", banco.get("admin@x.com").senha());
    }
}
