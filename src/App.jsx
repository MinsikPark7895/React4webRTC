import {useState, useRef, useEffect} from 'react';
import './App.css'

function App() {
  // const [mediaStream, setMediaStream] = useState(null);
  // const [isMuted, setIsMuted] = useState(true);
  // const mediaPlayerRef = useRef(null);

  // const requestMediaStream = () => {
  //   const constraints = {
  //     video: true,
  //     audio: true,
  //   };
  //   // getUserMedia
  //   navigator.mediaDevices.getDisplayMedia(constraints)
  //     .then(newMediaStream => {
  //       console.log("MediaStream 요청 성공", newMediaStream);

  //       // setMediaStream(newMediaStream);
  //       if (mediaPlayerRef.current){
  //         const mediaPlayerElement = mediaPlayerRef.current;

  //         mediaPlayerElement.srcObject = newMediaStream;
  //         setMediaStream(newMediaStream);
  //       }
  //     })
  //     .catch(error => {
  //       console.log("MediaStream 요청 실패", error);
  //     })
    
  // }

  // const toggleMuted = () => {
  //   if(mediaPlayerRef.current){
  //     const mediaPlayerElement = mediaPlayerRef.current;

  //     mediaPlayerElement.muted = !isMuted;
  //     setIsMuted(!isMuted);
  //   }
  // }

  // // const playMediaStream = () => {
  // //   if(mediaPlayerRef.current && mediaStream) {
  // //     const mediaPlayerElement = mediaPlayerRef.current;

  // //     mediaPlayerElement.srcObject = mediaStream;
  // //     mediaPlayerElement.play()
  // //       .then(() => {
  // //         console.log("Play 성공");
  // //       })
  // //       .catch(() => {
  // //         console.log("Play 실패");
  // //       })
  // //   }
  // // }

  // const releaseMediaStream = () => {
  //   if(mediaStream) {
  //     mediaStream.getTracks().forEach(track => track.stop());
  //     setMediaStream(null);
  //   }
  // }

  const [mediaDevices, setMediaDevices] = useState([]);
  const enumerateDevices = () => {
    navigator.mediaDevices.enumerateDevices()
      .then(deviceInfos => {
        console.log("장치 조회 성공", deviceInfos);

        const filteredDeviceInfos = deviceInfos.filter(deviceInfo => deviceInfo.deviceId && deviceInfo.deviceId !== 'default');


        setMediaDevices(filteredDeviceInfos);
        // setMediaDevices(deviceInfos);
      })
      .catch(error => {
        console.log("장치 조회 실패", error);
      })
  }

  const requestPermissionAndEnumerateDevices = () => {
    const constraints = {
      video: true,
      audio: true,
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(newMediaStream => {
        newMediaStream.getTracks().forEach(track => track.stop());

        enumerateDevices();
      })
      .catch(error => {
        console.log("권한 획득 실패", error);
      })
  }

  const onMediaDeviceChanged = () => {
    console.log("장치 변경됨");

    enumerateDevices();
  }

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', onMediaDeviceChanged);
    console.log("장치 변경 핸들러 등록");

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', onMediaDeviceChanged);
      console.log("장치 변경 핸들러 제거");
    }
  }, []);

  return (
    <>
      <div className='horizontal-start-box'>
        {/* <input type="button" value="장치 조회" onClick={enumerateDevices}/> */}
        <input type="button" value="장치 조회" onClick={requestPermissionAndEnumerateDevices}/>
        <select>
          {mediaDevices.map((device, index) => (
            <option key={`mediadevice-${index}-${device.deviceId}`} value={device.deviceId}>
              {device.label || `장치 ${index + 1}`}
            </option>
          ))}


          {/* {mediaDevices.map(device => {
            <option key={`mediadevice-${device.diviceId}`} value={device.diviceId}>{device.label}</option>
          })} */}
        </select>
        {/* <input type="button" value="미디어 재생" disabled={!mediaStream} onClick={playMediaStream}/> */}
        {/* <input type="button" value={isMuted ? '소리켜기' : '소리끄기'} disabled={!mediaStream} onClick={toggleMuted}/>
        <input type="button" value="미디어 해제" disabled={!mediaStream} onClick={releaseMediaStream}/> */}
      </div>
      <div className='relative-container'>
        {/* <video ref={mediaPlayerRef} autoPlay muted style={{width: '640px', height: '320px', background : 'black', objectFit: 'contain'}} /> */}
        <video  autoPlay muted style={{width: '640px', height: '320px', background : 'black', objectFit: 'contain'}} />
      </div>
    </>
  )
}

export default App
