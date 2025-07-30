// // src/main/java/com/example/webmedia_back/model/StringMessageContainer.java
package com.example.webmedia_back.model;

import com.example.webmedia_back.service.JsonStringMessageDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

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
public class StringMessageContainer {
    // 바디 부분을 서로 클라이언트 그리고 서버가 주고 받았을 때 원활하 동작하기 위한 필요한 부가적인 정보들을 나타냄
    private String roomId;
    private String from;
    private String to;
    private MessageType type;
    private String messageId;

    @JsonDeserialize(using = JsonStringMessageDeserializer.class)
    private String message;    // body 실제 받고자 하는 데이터

}
