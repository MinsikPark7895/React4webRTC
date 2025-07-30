// components/RoomConnector.jsx

import { Button, Stack, TextField } from '@mui/material'
import { use, useState } from 'react'

export function RoomConnector(joining, onJoin) {
    const [roomId, setRoomId ] = useState('');
    const [roomIdInvalid, setRoomIdInvalid] = useState(true);

    const validateRoomId = (roomId) => {
        const pattern = /^[a-z0-9]{6,12}$/;
        return pattern.test(roomId);
    }

    const handleChangeRoomId = (event) => {
        const newName = event.target.value;

        setRoomId(newName);
        setRoomIdInvalid(!validateRoomId(newName));
    }

    const handleClickJoin = () => {
        onJoin(roomId);
    }

    return (
        <Stack direction="row" spacing={1} sx={{justifyContent: 'flex-end', alignItems: 'center'}}>
            <TextField label="방 이름" variant="outlined" placeholder="영문과 숫자로만 구성한 6~12 길이의 문자"
                        style={{flex: 1}} value={roomId} onChange={handleChangeRoomId}>

            </TextField>
            <Button variant="contained" style={{flex: 0}}
                    loading={joining} disabled={roomIdInvalid} onClick={handleClickJoin}>
                입 장</Button>
        </Stack>
    )
}