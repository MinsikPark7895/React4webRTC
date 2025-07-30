// src/main/java/com/example/webmedia_back/model/message/UserStateChangedEventMessage.java
package com.example.webmedia_back.model.message;

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
public class UserStateChangedEventMessage {
    private String userId;
    private boolean published;
}
