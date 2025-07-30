// src/main/java/com/example/webmedia_back/controller/WebMediaHandler.java
package com.example.webmedia_back.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.example.webmedia_back.model.MessageType;
import com.example.webmedia_back.model.StringMessageContainer;
import com.example.webmedia_back.service.MessageSender;
import com.example.webmedia_back.service.RoomAgent;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class WebMediaHandler extends TextWebSocketHandler{
    private final ObjectMapper objectMapper;
    private final MessageSender messageSender;

    private final Object lockObj;
    private final Map<String, RoomAgent> agentMap;

    public WebMediaHandler(ObjectMapper objectMapper, MessageSender messageSender){
        this.objectMapper = objectMapper;
        this.messageSender = messageSender;

        this.lockObj = new Object();
        this.agentMap = new HashMap<>();
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.debug("Connection established : sessionId={}", session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.debug("Connection closed : sessionId={}, status={}", session.getId(), status);
        
        synchronized (lockObj) {
            for(RoomAgent agent: agentMap.values()) {
                agent.handlerUserLeft(session);

                if(agent.getUserCount() == 0) {
                    agentMap.remove(agent.getRoomId());

                    log.debug("Room destroyed : roomId={}", agent.getRoomId());
                }
            }
        }
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        final String payload = message.getPayload();

        try {
            final StringMessageContainer messageContainer = objectMapper.readValue(payload, StringMessageContainer.class);
            RoomAgent agent = null;

            if(MessageType.JoinRequest.equals(messageContainer.getType())){
                final String roomId = messageContainer.getRoomId();

                // 하나의 스레드만 허용하는 것이 바로 아래 synchronized block, 여러개의 스레드가 오면 순서대로 진행
                synchronized (lockObj) {
                    if(agentMap.containsKey(roomId)) {
                        agent = agentMap.get(roomId);
                    } else {
                        agent = new RoomAgent(objectMapper, messageSender, roomId);
                        agentMap.put(roomId, agent);
                    }
                } 
            } else {
                // join request가 필요 없는 경우
                synchronized (lockObj) {
                    agent = agentMap. get(messageContainer.getRoomId());
                }
            }

            agent.handleMessage(session, messageContainer.getMessageId(), messageContainer.getType(), messageContainer.getMessage());
        } catch (Exception e) {
            log.debug("handleTextMessage error", e);

            session.close(new CloseStatus(3000, "알 수 없는 에러"));   // 에러 발생 시 웹소켓 컨넥션을 클라이언트와 연결되어 있는 컨넥션을 끊어줌
        }
    }
}
