// src/main/java/com/example/webmedia_back/configuration/WebSocketConfiguration.java

package com.example.webmedia_back.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.example.webmedia_back.controller.WebMediaHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer{
    private final WebMediaHandler webMediaHandler;

    @Autowired
    public WebSocketConfiguration(WebMediaHandler webMediaHandler) {
        this.webMediaHandler = webMediaHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry){
        registry.addHandler(webMediaHandler, "/webmedia-ws")
                .setAllowedOrigins("*");
    }
}
