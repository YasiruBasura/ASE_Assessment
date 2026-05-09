package com.assessment.blog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF so Postman and React can send POST requests without tokens for now
                .csrf(AbstractHttpConfigurer::disable)

                // Configure route authorization
                .authorizeHttpRequests(auth -> auth
                        // Explicitly open up all our post endpoints to the public
                        .requestMatchers("/api/posts/**").permitAll()

                        // Keep everything else locked down
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}