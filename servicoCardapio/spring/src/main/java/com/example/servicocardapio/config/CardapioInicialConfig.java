package com.example.servicocardapio.config;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.servicocardapio.entity.Adicional;
import com.example.servicocardapio.entity.Categoria;
import com.example.servicocardapio.entity.Produto;
import com.example.servicocardapio.service.AdicionalService;
import com.example.servicocardapio.service.CategoriaService;
import com.example.servicocardapio.service.ProdutoService;

// carrega um cardapio de exemplo so quando o banco esta vazio,
// para o front e o servicoPedido terem o que mostrar logo de cara
@Configuration
public class CardapioInicialConfig {

    @Bean
    public CommandLineRunner carregarCardapioInicial(CategoriaService categorias,
                                                     ProdutoService produtos,
                                                     AdicionalService adicionais) {
        return args -> {
            if (!categorias.listarTodas().isEmpty()) {
                return;
            }

            Long lanches = categorias.criar(new Categoria(null, "Lanches")).id();
            Long acompanhamentos = categorias.criar(new Categoria(null, "Acompanhamentos")).id();
            Long bebidas = categorias.criar(new Categoria(null, "Bebidas")).id();
            Long sobremesas = categorias.criar(new Categoria(null, "Sobremesas")).id();

            produtos.criar(produto(lanches, "Burger Classico", "Pao, hamburguer, queijo, alface e tomate", "24.90", "https://img.magnific.com/fotos-gratis/delicioso-cheeseburger-classico-com-alface-e-queijo-derretido_84443-72937.jpg?semt=ais_hybrid&w=740&q=80"));
            produtos.criar(produto(lanches, "Burger Duplo", "Dois hamburgueres, queijo e molho da casa", "32.90", "https://st.depositphotos.com/1364311/1252/i/450/depositphotos_12522409-stock-photo-hamburger.jpg"));
            produtos.criar(produto(lanches, "Burger Bacon", "Hamburguer, queijo, bacon crocante e molho barbecue", "29.90", "https://img.magnific.com/psd-premium/isolamento-de-hamburguer-de-bacon-em-fundo-transparente_1231285-722.jpg?semt=ais_hybrid&w=740&q=80"));
            produtos.criar(produto(lanches, "Chicken Crocante", "Frango empanado, alface e maionese", "27.90", "https://img.criativodahora.com.br/homologacao/thumbs/2025/07/20/01982aba-910e-70d6-92f1-7555325266b6.jpg"));
            produtos.criar(produto(acompanhamentos, "Batata Media", "Batata frita crocante", "12.90", "https://t4.ftcdn.net/jpg/07/44/06/97/360_F_744069723_ZxfFr76qZRy0sZ37MEzWIYQwZnHKRD9y.jpg"));
            produtos.criar(produto(acompanhamentos, "Onion Rings", "Aneis de cebola empanados", "14.90", "https://t4.ftcdn.net/jpg/21/99/32/03/360_F_2199320366_yF9HcU43fh2wgvvGS5fySlEEYX0xzfCX.jpg"));
            produtos.criar(produto(bebidas, "Coca-Cola Lata", "350 ml", "7.50", "https://d3sn2rlrwxy0ce.cloudfront.net/site_Coca.png?mtime=20260512091824&focal=none"));
            produtos.criar(produto(bebidas, "Suco Natural One® Laranja", "Laranja, 300 ml", "9.90", "https://d3sn2rlrwxy0ce.cloudfront.net/site_Suco_Laranja.png?mtime=20260512091847&focal=none"));
            produtos.criar(produto(bebidas, "Suco Natural One® Uva", "Uva, 300 ml", "9.90", "https://d3sn2rlrwxy0ce.cloudfront.net/site_Suco_Uva.png?mtime=20260512091854&focal=none"));
            produtos.criar(produto(sobremesas, "Sundae Chocolate", "Sorvete de creme com calda de chocolate", "11.90", "https://api-middleware-mcd.mcdonaldscupones.com/media/image/product$kpXuLeTy/200/200/original?country=br"));
            produtos.criar(produto(sobremesas, "Sundae Morango", "Sorvete de creme com calda de morango", "11.90", "https://api-middleware-mcd.mcdonaldscupones.com/media/image/product$kpXNtbWx/200/200/original?country=br"));
            produtos.criar(produto(sobremesas, "Casquinha de Baunilha", "Deliciosa sobremesa servida numa casquinha muuuito crocante, sabor Baunilha.", "2.99", "https://d3sn2rlrwxy0ce.cloudfront.net/site_Casquinha_Baunilha.png?mtime=20260507135932&focal=none"));

            adicionais.criar(new Adicional(null, "Bacon extra", new BigDecimal("4.00"), true));
            adicionais.criar(new Adicional(null, "Queijo extra", new BigDecimal("3.00"), true));
            adicionais.criar(new Adicional(null, "Molho especial", new BigDecimal("2.00"), true));
        };
    }

    private Produto produto(Long categoriaId, String nome, String descricao, String preco, String imagemUrl) {
        return new Produto(null, categoriaId, nome, descricao, new BigDecimal(preco), imagemUrl, true);
    }
}
