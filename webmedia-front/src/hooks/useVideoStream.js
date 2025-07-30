// src/hooks/useVideoStream.js

import { useEffect } from "react";

export function useVideoStream(videoRef, stream){
    useEffect(() => {
        if(stream){
            if(videoRef.current){
                const streamId = videoRef.current.dataset.streamId;
                if(streamId !== stream.id){
                    videoRef.current.srcObject = stream;
                    videoRef.current.dataset.streamId = stream.id;
                }
            }
        } else {
            if(videoRef.current){
                videoRef.current.srcObject = null;
                videoRef.current.dataset.streamId = null;
            }
        }

        return() => {
            if(videoRef.current){
                videoRef.current.srcObject = null;
                videoRef.current.dataset.streamId = null;
            }            
        }
    }, [videoRef, stream]);
}