// src/main/java/com/example/webmedia_back/model/ObjectMessageContainer.java
package com.example.webmedia_back.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ObjectMessageContainer {
    // 서버가 클라이언트로 보내는 메시지
    private String roomId;
    private String from;
    private String to;
    private MessageType type;
    private String messageId;

    private Object message;
}
