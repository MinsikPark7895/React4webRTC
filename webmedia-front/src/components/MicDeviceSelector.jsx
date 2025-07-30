// components/MicDeviceSelector.jsx

import { Button, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material'
import { useEffect, useRef, useState } from 'react'


export function MicDeviceSelector(
    disabled, deviceId,
    onDisabledChanged, onDeviceIdChanged
) {
    const [devices, setDevices] = useState([]);
    const [animationStarted, setAnimationStarted ] = useState(false);
    const mediaStreamRef = useRef(null);
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const analyserNodeRef = useRef(null);
    const destNodeRef = useRef(null);

    useEffect(() => {
        if(mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if(audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
    }, []);

    useEffect(() => {
        if(mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        const constraints = {
            video: false,
            audio: {
                deviceId,
                echoCancellation: false,
                noiseSuppression: true,
            }
        }
        navigator.mediaDevices.getUserMedia(constraints)
            .then(newMediaStream => {
                if(disabled) {
                    onDisabledChanged(false);
                }

                mediaStreamRef.current = newMediaStream;
                configureAudioNode();
            })
            .catch(error => {
                if(!disabled) {
                    onDisabledChanged(true);
                }
                mediaStreamRef.current = null;
            })
    }, [deviceId]);

    const enumerateDevices = () => {
        if(!disabled) {
            navigator.mediaDevices.enumerateDevices()
                .then(deviceInfos => {
                    const mics = diviceInfos.filter(
                        deviceInfo => deviceInfo.kind === 'audioinput' && deviceInfo.deviceId !== 'default'
                    );

                    setDevices(mics);
                })
                .catch(error => {
                    console.log("부르기를 실패했습니다", error)
                    setDevices([])
                })
        }
    }

    const handleChangeMicId = (event) => {
        onDeviceIdChanged(event.target.value);
    }

    const configureAudioNode = () => {
        if(audioContextRef.current && mediaStreamRef.current) {
            const audioContext = audioContextRef.current;

            const sourceNode = audioContext.createMediaStreamSource(mediaStreamRef.current);
            const analyserNode = audioContext.createAnalyser();
            const destNode = audioContext.createMediaStreamDestination();

            analyserNode.fftSize = 256;

            sourceNode.connect(analyserNode);
            analyserNode.connect(destNode);
            
            sourceNodeRef.current = sourceNode;
            analyserNodeRef.current = analyserNode;
            destNodeRef.current = destNode;
        }
    }

    const startAnimation = () => {
        if(!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }

        const audioContext = audioContextRef.current;
        if(audioContext.state === 'suspended'){
            audioContext.resume()
                .then(() => {
                    configureAudioNode();
                    window.requestAnimationFrame(captureAudio);
                    setAnimationStarted(true);
                })
                .catch(error => {
                    audioContext.close();
                    audioContextRef.current = null;
                    setAnimationStarted(false);
                })
        } else if(audioContext.state === 'running') {
            configureAudioNode();
            window.requestAnimationFrame(captureAudio);
            setAnimationStarted(true);
        } else {
            console.log("AudioContext가 적절한 상태가 아님", audioContext.state);
        }
    }

    const captureAudio = () => {
        if(audioContextRef.current) {
            if(analyserNodeRef.current) {
                const bufferLen = analyserNodeRef.current.freqencyBinCount;
                const buffer = new Uint8Array(bufferLen);
                analyserNodeRef.current.getByteFrequencyData(buffer);

                drawAudioData(buffer, bufferLen);
            } else {
                drawAudioData(null, 0);
            }

            window.requestAnimationFrame(captureAudio);
        } else {
            console.log("Animation 중지");
        }
    }

    const drawAudioData = (buffer, bufferLen) => {
        if(canvasRef.current) {
            const canvas = canvasRef.current;
            const canvasContext = canvas.getContext('2d');
            if(canvasContext) {
                canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                canvasContext.fillStyle = '#00FF00';

                if(buffer) {
                    let sum = 0;
                    for(let i=0; i < bufferLen; i++){
                        sum += (buffer[i] / 256) * canvas.width;
                    }

                    const avg = sum / buffer.length;
                    canvasContext.fillRect(0, 0, avg, canvas.height);
                }
            }
        }
    }

    return (
        <Stack direction="column" spacing={0} sx={{justifyContent: 'center', alignItems:'center'}}>
            <FormControl fullWidth disabled={disabled}>
                <InputLabel>마이크 장치</InputLabel>
                <Select value={deviceId} onOpen={enumerateDevices} onChange={handleChangeMicId}>
                    <MenuItem value={'default'}>기본 장치</MenuItem>
                    {devices && devices.map((device, index) => {
                        <MenuItem key={`mic-devices-${index}-${device.deviceId}`} value={device.deviceId}>
                            {device.label}
                        </MenuItem>
                    })}
                </Select>
            </FormControl>

            <Stack direction="row" spacing={1} sx={{justifyContent: 'center', alignItems: 'center', width: '400px'}}>
                <canvas ref={canvasRef} width="400" height="16" style={{width: '300px', height: '16px', background: 'transparent', objectFit: 'contain'}}/>
                <Button disabled={disabled || animationStarted} onClick={startAnimation}>동작 확인</Button>
                
            </Stack>
        </Stack>
    )
}


