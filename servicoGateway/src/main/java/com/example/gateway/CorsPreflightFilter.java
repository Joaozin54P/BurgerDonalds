package com.example.gateway;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsPreflightFilter extends OncePerRequestFilter {

    private final Set<String> allowedOrigins;

    public CorsPreflightFilter(
            @Value("${app.cors.allowed-origins:http://localhost:8081,http://localhost:3000,http://localhost:4200,http://localhost:5173,https://burgerdonalds-front.vercel.app}") String originsConfig) {
        this.allowedOrigins = Arrays.stream(originsConfig.split(","))
                .map(String::trim)
                .map(url -> url.replaceAll("/+$", ""))
                .filter(url -> !url.isEmpty())
                .collect(Collectors.toUnmodifiableSet());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String origin = request.getHeader(HttpHeaders.ORIGIN);
        String normalizedOrigin = origin != null ? origin.replaceAll("/+$", "") : null;

        if (normalizedOrigin == null || !allowedOrigins.contains(normalizedOrigin)) {
            chain.doFilter(request, response);
            return;
        }

        response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, origin);
        // o token agora viaja em cookie: sem isto o navegador esconde a resposta (e nao guarda o cookie do login)
        response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
        response.setHeader(HttpHeaders.VARY, HttpHeaders.ORIGIN);

        if (CorsUtils.isPreFlightRequest(request)) {
            String requestHeaders = request.getHeader(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS);
            response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS,
                    "GET,POST,PUT,PATCH,DELETE,OPTIONS");
            response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS,
                    requestHeaders != null ? requestHeaders : "Content-Type, Authorization");
            response.setHeader(HttpHeaders.ACCESS_CONTROL_MAX_AGE, "1800");
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // o gateway já tratou o CORS: os serviços não precisam ver o Origin
        chain.doFilter(new HttpServletRequestWrapper(request) {
            @Override public String getHeader(String name) {
                return HttpHeaders.ORIGIN.equalsIgnoreCase(name) ? null : super.getHeader(name);
            }
            @Override public Enumeration<String> getHeaders(String name) {
                return HttpHeaders.ORIGIN.equalsIgnoreCase(name)
                        ? Collections.emptyEnumeration() : super.getHeaders(name);
            }
            @Override public Enumeration<String> getHeaderNames() {
                return Collections.enumeration(Collections.list(super.getHeaderNames()).stream()
                        .filter(h -> !HttpHeaders.ORIGIN.equalsIgnoreCase(h)).toList());
            }
        }, response);
    }
}