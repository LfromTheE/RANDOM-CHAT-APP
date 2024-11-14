"use client";

import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";

const socket = io(); // 클라이언트 소켓 초기화

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [peerConnected, setPeerConnected] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("offer", async (offer) => {
      const peerConnection = createPeerConnection();
      peerConnectionRef.current = peerConnection;
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answer", answer);
    });

    socket.on("answer", async (answer) => {
      await peerConnectionRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", (candidate) => {
      peerConnectionRef.current?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));
      });

    return peerConnection;
  };

  const startChat = async () => {
    const peerConnection = createPeerConnection();
    peerConnectionRef.current = peerConnection;
    setConnected(true);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", offer);
  };

  const endChat = () => {
    if (confirm("정말 채팅을 끝내시겠습니까?")) {
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;
      setConnected(false);
      setPeerConnected(false);
    }
  };

  return (
    <div>
      <h1>랜덤 채팅</h1>
      {!connected ? (
        <button onClick={startChat}>채팅 시작하기</button>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              style={{ width: "45%" }}
            ></video>
            <video
              ref={remoteVideoRef}
              autoPlay
              style={{ width: "45%" }}
            ></video>
          </div>
          <button onClick={endChat} style={{ marginTop: "10px" }}>
            채팅 종료
          </button>
        </div>
      )}
    </div>
  );
}
