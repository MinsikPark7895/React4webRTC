// components/CamDeviceSelector.jsx

import { FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export function CamDeviceSelector({
    disabled, 
    deviceId,
    onDisabledChanged, 
    onDeviceIdChanged
}) {
    const [devices, setDevices] = useState([]);
    const mediaPlayerRef = useRef(null);
    const mediaStreamRef = useRef(null);

    // 컴포넌트 언마운트 시 스트림 정리
    useEffect(() => {
        return () => {
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            }
        }
    }, []);

    // deviceId 변경 시 미디어 스트림 재설정
    useEffect(() => {
        if (!deviceId) return;

        // 기존 스트림 정리
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }

        const constraints = {
            video: { deviceId: deviceId === 'default' ? undefined : { exact: deviceId } },
            audio: false,
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(newMediaStream => {
                if (disabled) {
                    onDisabledChanged(false);
                }

                if (mediaPlayerRef.current) {
                    mediaPlayerRef.current.srcObject = newMediaStream;
                }
                mediaStreamRef.current = newMediaStream;
            })
            .catch(error => {
                console.error("미디어 스트림 생성 실패:", error);
                if (!disabled) {
                    onDisabledChanged(true);
                }
            });
    }, [deviceId, disabled, onDisabledChanged]);

    // 장치 목록 조회 함수
    const enumerateDevices = async () => {
        if (disabled) return;

        try {
            // 권한이 없다면 먼저 요청
            const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
            tempStream.getTracks().forEach(track => track.stop());

            // 장치 목록 조회
            const deviceInfos = await navigator.mediaDevices.enumerateDevices();
            const cams = deviceInfos.filter(
                deviceInfo => deviceInfo.kind === 'videoinput' && deviceInfo.deviceId !== 'default'
            );
            setDevices(cams);
        } catch (error) {
            console.error("장치 조회 실패:", error);
            setDevices([]);
        }
    };

    // 초기 장치 목록 조회
    useEffect(() => {
        if (!disabled) {
            enumerateDevices();
        }
    }, [disabled]);

    // 카메라 선택 핸들러
    const handleChangeCamId = (event) => {
        onDeviceIdChanged(event.target.value);
    };

    return (
        <Stack direction="column" spacing={1} sx={{justifyContent: 'center', alignItems: 'center'}}>
            <video 
                ref={mediaPlayerRef} 
                autoPlay 
                muted 
                style={{
                    width: '480px', 
                    height: '250px', 
                    background: 'black', 
                    objectFit: 'contain'
                }}
            />

            <FormControl fullWidth disabled={disabled}>
                <InputLabel>카메라 장치</InputLabel>
                <Select 
                    value={deviceId || 'default'} 
                    onOpen={enumerateDevices} 
                    onChange={handleChangeCamId}
                >
                    <MenuItem value="default">기본 장치</MenuItem>
                    {devices.map((device, index) => (
                        <MenuItem 
                            key={`cam-devices-${index}-${device.deviceId}`} 
                            value={device.deviceId}
                        >
                            {device.label || `카메라 ${index + 1}`}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>
    );
}
