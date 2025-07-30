package com.example.webmedia_back.model;

public enum MessageType {
    JoinRequest,

    JoinResponse,
    ErrorResponse,

    UserPublisherChangeReport,

    UserJoinedEvent,
    UserLeftEvent,
    UserStateChangedEvent;
}
