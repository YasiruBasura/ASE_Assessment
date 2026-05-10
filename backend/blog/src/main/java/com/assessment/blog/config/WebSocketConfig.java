package com.assessment.blog.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // This is the prefix for the "chat rooms" users will subscribe to
        config.enableSimpleBroker("/topic");

        // This is the prefix for messages sent FROM the client to the server (we won't use this much since we use REST for posting)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This is the URL React will use to establish the initial connection
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173", "http://127.0.0.1:5500")
                .withSockJS(); // Fallback for browsers that don't support raw WebSockets
    }
}