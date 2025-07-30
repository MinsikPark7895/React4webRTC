// Room.jsx

import { observer } from "mobx-react-lite";
import { IconButton, Stack  } from "@mui/material";
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from './store.js'
import { useVideoStream } from "./hooks/useVideoStream.js";

function Room() {
    const navigate = useNavigate();
    const { roomStore } = useStore();
    const { isJoinSuccess, publishStream, subscribeStream } = roomStore();
    const { isMuted, setIsMuted } = useState(true);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        if(remoteVideoRef.current) {
            remoteVideoRef.current.addEventListener('volumechange', onVolumeChange);
        }

        return () => {
            if(remoteVideoRef.current){
                remoteVideoRef.current.removeEventListener('volumechange', onVolumeChange)
            }
        }
    }, []);

    useEffect(() => {
        if(isJoinSuccess) {
            roomStore.publish();
        } else {
            navigate('/');
        }
    }, [isJoinSuccess]);

    useVideoStream(localVideoRef, publishStream);
    useVideoStream(remoteVideoRef, subscribeStream);

    const toggleMuted = () => {
        if(remoteVideoRef.current){
            remoteVideoRef.current.muted = !isMuted;
        }
    }
    const onVolumeChange = (event) => {
        setIsMuted(event.target.muted);
    }

    const handleClickExit = () => {
        roomStore.exit();
    }

    // useEffect(() => {
    //     if(publishStream) {
    //         const currentStreamId = localVideoRef.current.dataset.streamId;
    //         if(currentStreamId !== publishStream.id) {
    //             localVideoRef.current.srcObject = publishStream;
    //             localVideoRef.current.dataset.streamId = publishStream.id;
    //         }
    //     } else {
    //         localVideoRef.current.srcObject = null;
    //         localVideoRef.current.dataset.streamId = null;
    //     }
    // }, [publishStream]);

    return (
        <div style={{position: 'relative', width: '100%', height: '100vh'}}>
            <video ref={remoteVideoRef} autoPlay muted 
                style={{position: 'absolute', 
                        left: '0px', top: '0px', width: '100%', height: '100%', 
                        background: 'black', objectFit:'contain'}}/>
            <video ref={localVideoRef} autoPlay muted
                    style={{position: 'absolute',
                            right: '24px', bottom: '24px', width: '35%', height: '35%',
                            background: 'transparent', objectFit: 'contain'}}/>
            <Stack direction="row" spacing={1} 
                    sx={{justifyContent: 'flex-end', alignItems: 'center',
                        position: 'absolute', top: '16px', right: '16px'}}>
                <IconButton disabled={!subscribeStream} style={{color: !subscribeStream ? 'grey' : (isMuted ? 'red' : 'lightgrey')}}
                         onClick={toggleMuted}>
                    <VolumeUpIcon/>
                </IconButton>
                <IconButton style={{color: 'gray'}} onClick={handleClickExit}>
                    <ExitToAppIcon/>
                </IconButton>
            </Stack>
        </div>
    );
}

export default observer(Room)
