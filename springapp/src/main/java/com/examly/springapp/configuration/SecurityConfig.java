package com.examly.springapp.configuration;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import jakarta.servlet.http.HttpServletResponse;



import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Stateless JWT Bearer security using Spring Security's OAuth2 Resource Server.
 * Exposes:
 *  - SecurityFilterChain with /api/auth/** and OpenAPI endpoints permitted
 *  - JwtDecoder based on HS256 secret
 *  - JwtAuthenticationConverter mapping "roles" claim -> GrantedAuthorities
 *  - Basic CORS for localhost dev
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
//@Profile("!test") // <-- active in prod/dev, NOT in tests
public class SecurityConfig {

    @Value("${app.jwt.secret:ThisIsADevOnlySecretChangeMeToAtLeast32Chars}")
    private String jwtSecret;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/**",
                    "/actuator/health",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()

                .requestMatchers(HttpMethod.GET, "/api/tournaments/**", "/api/matches/**")
        .permitAll() // Everyone can view tournament info & schedules

    .requestMatchers(HttpMethod.GET, "/api/teams/**")
        .permitAll()

    .requestMatchers(HttpMethod.GET, "/api/players/**")
        .permitAll()

    // ------------------------
    // 🔹 Team & Player management
    // ------------------------
    .requestMatchers(HttpMethod.POST, "/api/teams/**")
        .hasAnyRole("TEAM_MANAGER", "FIFA_ADMIN") // Only managers/admins can register teams

    .requestMatchers(HttpMethod.PUT, "/api/teams/**")
        .hasAnyRole("TEAM_MANAGER", "COACH", "FIFA_ADMIN") // Coach & manager manage squads

    .requestMatchers(HttpMethod.DELETE, "/api/teams/**")
        .hasRole("FIFA_ADMIN") // Only admin can delete teams

    // Player profile management
    .requestMatchers(HttpMethod.POST, "/api/players/**")
        .hasAnyRole("COACH", "TEAM_MANAGER", "FIFA_ADMIN")
    .requestMatchers(HttpMethod.PUT, "/api/players/**")
        .hasAnyRole("PLAYER", "COACH", "TEAM_MANAGER", "FIFA_ADMIN")
    .requestMatchers(HttpMethod.DELETE, "/api/players/**")
        .hasAnyRole("TEAM_MANAGER", "FIFA_ADMIN")

    // ------------------------
    // 🔹 Match management
    // ------------------------
    .requestMatchers(HttpMethod.POST, "/api/matches/**")
        .hasAnyRole("TOURNAMENT_DIRECTOR", "FIFA_ADMIN") // schedule
    .requestMatchers(HttpMethod.PUT, "/api/matches/**")
        .hasAnyRole("TOURNAMENT_DIRECTOR", "FIFA_ADMIN") // record results
    .requestMatchers(HttpMethod.DELETE, "/api/matches/**")
        .hasRole("FIFA_ADMIN")

    // ------------------------
    
    // 🔹 Reports & analytics
    // ------------------------
    .requestMatchers("/api/reports/**")
        .hasAnyRole("COACH", "TEAM_MANAGER", "FIFA_ADMIN")
    .requestMatchers("/api/analytics/**")
        .hasAnyRole("COACH", "TEAM_MANAGER", "TOURNAMENT_DIRECTOR", "FIFA_ADMIN")

    // ------------------------
    // 🔹 Administrative sections
    // ------------------------
    .requestMatchers("/api/users/**", "/api/config/**", "/api/audit/**")
        .hasRole("FIFA_ADMIN")

    .requestMatchers("/api/audit/view")
        .hasAnyRole("FIFA_ADMIN", "TOURNAMENT_DIRECTOR") // limited audit visibility

    // ------------------------
    // 🔹 Payments and tickets
    // ------------------------
    .requestMatchers("/api/payments/**")
        .hasAnyRole("GUEST", "PLAYER", "TEAM_MANAGER", "FIFA_ADMIN")
    .requestMatchers(HttpMethod.POST, "/api/tickets/**")
        .hasRole("GUEST")
    .requestMatchers(HttpMethod.GET, "/api/tickets/my")
        .hasAnyRole("GUEST")

    // ------------------------
    // 🔹 Default rule
    // ------------------------
    .anyRequest().authenticated()
)
.exceptionHandling(ex -> ex
    // 401 Unauthorized → not logged in
    .authenticationEntryPoint((request, response, authException) -> {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"You need to log in to access this resource\"}");
    })
    // 403 Forbidden → logged in but role not allowed
    .accessDeniedHandler((request, response, accessDeniedException) -> {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"You are not authorized to access this resource\"}");
    })
)
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            );

        return http.build();
    }

    /** Use the same HS256 key for verifying JWTs as used by JWTUtil to sign them. */
    @Bean
    public JwtDecoder jwtDecoder() {
        SecretKey key = secretKeyFrom(jwtSecret);
        return NimbusJwtDecoder
                .withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

    private SecretKey secretKeyFrom(String secret) {
        try {
            // Prefer Base64 if provided
            return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        } catch (IllegalArgumentException ignored) {
            return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }
    }

    /**
     * Map "roles" claim to GrantedAuthorities. We expect values like "ROLE_USER".
     * (If your tokens use plain names like "USER", setAuthorityPrefix("ROLE_") instead.)
     */
    @Bean
    public Converter<Jwt, ? extends AbstractAuthenticationToken> jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter delegate = new JwtGrantedAuthoritiesConverter();
        delegate.setAuthoritiesClaimName("roles");
        delegate.setAuthorityPrefix(""); // roles already include ROLE_ prefix from JWTUtil

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(delegate);
        return converter;
    }

    /** Password encoder for any form/login flows (useful for issuing tokens). */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /** Simple permissive CORS for local dev; tighten for production. */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of(
            "https://8081-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io",
            "http://localhost:3000"
        ));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*")); // allow all headers for simplicity
        cfg.setAllowCredentials(true);
    
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
    
}
