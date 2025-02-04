import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

export default function VideoChat() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  const roomId = 'test-room'; // In a real app, generate this dynamically

  useEffect(() => {
    socketRef.current = io('https://bytecall-backend-services.onrender.com/');

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        peerConnectionRef.current = new RTCPeerConnection(configuration);

        stream.getTracks().forEach((track) => {
          if (peerConnectionRef.current) {
            peerConnectionRef.current.addTrack(track, stream);
          }
        });

        peerConnectionRef.current.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current?.emit('ice-candidate', {
              candidate: event.candidate,
              roomId,
            });
          }
        };

        socketRef.current?.emit('join-room', roomId);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    init();

    socketRef.current?.on('user-connected', async () => {
      try {
        const offer = await peerConnectionRef.current?.createOffer();
        await peerConnectionRef.current?.setLocalDescription(offer);
        socketRef.current?.emit('offer', { offer, roomId });
      } catch (error) {
        console.error('Error creating offer:', error);
      }
    });

    socketRef.current?.on('offer', async ({ offer }) => {
      try {
        await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current?.createAnswer();
        await peerConnectionRef.current?.setLocalDescription(answer);
        socketRef.current?.emit('answer', { answer, roomId });
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    });

    socketRef.current?.on('answer', async ({ answer }) => {
      try {
        await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    });

    socketRef.current?.on('ice-candidate', async ({ candidate }) => {
      try {
        await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ice candidate:', error);
      }
    });

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      peerConnectionRef.current?.close();
      socketRef.current?.disconnect();
    };
  }, []);

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const endCall = () => {
    localStream?.getTracks().forEach(track => track.stop());
    peerConnectionRef.current?.close();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#1a1818] p-4">
      <div className="max-w-6xl mx-auto">
        <div className=" gap-4">
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg bg-[gray-800] aspect-video object-cover mb-6"
            />
            <p className="absolute bottom-4 left-4 text-white bg-black/50 px-2 py-1 rounded">
              You
            </p>
          </div>
          <div className="relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg bg-gray-800 aspect-video object-cover"
            />
            <p className="absolute bottom-4 left-4 text-white bg-black/50 px-2 py-1 rounded">

            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full ${
              isAudioEnabled ? 'bg-gray-700' : 'bg-red-500'
            } hover:opacity-80 transition-opacity`}
          >
            {isAudioEnabled ? (
              <Mic className="w-6 h-6 text-white" />
            ) : (
              <MicOff className="w-6 h-6 text-white" />
            )}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${
              isVideoEnabled ? 'bg-gray-700' : 'bg-red-500'
            } hover:opacity-80 transition-opacity`}
          >
            {isVideoEnabled ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </button>
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-500 hover:opacity-80 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="m136-304-92-90q-12-12-12-28t12-28q88-95 203-142.5T480-640q118 0 232.5 47.5T916-450q12 12 12 28t-12 28l-92 90q-11 11-25.5 12t-26.5-8l-116-88q-8-6-12-14t-4-18v-114q-38-12-78-19t-82-7q-42 0-82 7t-78 19v114q0 10-4 18t-12 14l-116 88q-12 9-26.5 8T136-304Zm104-198q-29 15-56 34.5T128-424l40 40 72-56v-62Zm480 2v60l72 56 40-38q-29-26-56-45t-56-33Zm-480-2Zm480 2Z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
