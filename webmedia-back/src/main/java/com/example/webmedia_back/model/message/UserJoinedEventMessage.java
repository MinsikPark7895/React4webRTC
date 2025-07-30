// src/main/java/com/example/webmedia_back/model/message/UserJoinedEventMessage.java
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
public class UserJoinedEventMessage {
    private RoomUser user;
    
}
