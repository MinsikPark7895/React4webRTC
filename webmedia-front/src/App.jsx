// App.jsx

import { observer } from 'mobx-react-lite'
import { Stack } from '@mui/material'
import { CamDeviceSelector } from './components/CamDeviceSelector'
import { MicDeviceSelector } from './components/MicDeviceSelector'
import { RoomConnector } from './components/RoomConnector'
import { useStore } from './store.js'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


function App() {
    const { roomStore } = useStore();
    const { camDisabled, selectedCamId, micDisabled, selectMicId, isJoining, isJoinSuccess } = roomStore;
    const navigate = useNavigate();

    useEffect(() => {
        if(isJoinSuccess) {
            navigate('/room');
        }
    }, [isJoinSuccess]);

    const handleChangeCamDisabled = (disabled) => {
        roomStore.setCamDisabled(disabled);
    }

    const handleChangeSelectedCamId = (deviceId) => {
        roomStore.setSelectedCamId(deviceId);
    }

    const handleChangeMicDisabled = (disabled) => {
        roomStore.setMicDisabled(disabled);
    }

    const handleChangeSelectedMicId = (deviceId) => {
        roomStore.setSelectedMicId(deviceId);
    }

    const handleJoin = (roomId) => {
        roomStore.join(roomId);
    }

    return(
        <Stack direction={{xs: 'column', md: 'row'}} spacing={2} 
            sx={{justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
            <Stack direction="column" spacing={2}
                sx={{justifyContent: 'center', alignItems: 'center', padding: '16px'}}>
                    <h1>Web MediaStream 강좌에서 만든</h1>
                    <h1>화상 대화에 참여하세요.</h1>
            </Stack>
            <Stack direction="column" spacing={1} sx={{justifyContent: 'center', alignItems: 'stretch', width: '400px'}}>
                <CamDeviceSelector disabled={camDisabled} deviceId={selectedCamId}
                                    onDisabledChanged={handleChangeCamDisabled}
                                    onDeviceIdChanged={handleChangeSelectedCamId}
                />
                <MicDeviceSelector disabled={micDisabled} deviceId={selectMicId}
                                    onDisabledChanged={handleChangeMicDisabled}
                                    onDeviceIdChanged={handleChangeSelectedMicId}
                />
                <RoomConnector joining={isJoining} onJoin={handleJoin}/>
            </Stack>
        </Stack>

    )
}

export default observer(App)

