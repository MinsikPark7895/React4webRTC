// src/main/java/com/example/webmedia_back/model/message/JoinRequestMethod.java

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
public class JoinRequeestMethod {
    private String roomId;
    
    

}
