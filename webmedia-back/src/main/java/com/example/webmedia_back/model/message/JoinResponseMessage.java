// src/main/java/com/example/webmedia_back/model/message/JoinResponseMessage.java
package com.example.webmedia_back.model.message;

import com.example.webmedia_back.model.RoomUser;

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
public class JoinResponseMessage {
    private String apiUrl;    // SDP 생성에서 offer, answer 진행을 클라이언트가 할 수 있음
    private String streamUrl;   
    private String roomId;
    private RoomUser user;
    private RoomUser anotherUser;
}
