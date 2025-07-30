// src/main/java/com/example/webmedia_back/model/message/ErrorResponse.java
package com.example.webmedia_back.model.message;

import com.example.webmedia_back.model.ErrorCode;

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
public class ErrorResponseMessage {
    private ErrorCode errorCode;
    private String message;
}
