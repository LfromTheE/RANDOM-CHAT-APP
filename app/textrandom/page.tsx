"use client";

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io();

export default function TextRandomChat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to text chat");
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startChat = () => {
    setConnected(true);
  };

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input);
      setMessages((prevMessages) => [...prevMessages, `나: ${input}`]);
      setInput("");
    }
  };

  const endChat = () => {
    if (confirm("정말 채팅을 끝내시겠습니까?")) {
      setConnected(false);
      setMessages([]);
    }
  };

  return (
    <div>
      <h1>일반 텍스트 랜덤 채팅</h1>
      {!connected ? (
        <button onClick={startChat}>채팅 시작하기</button>
      ) : (
        <div>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              maxHeight: "300px",
              overflowY: "scroll",
            }}
          >
            {messages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="메시지를 입력하세요..."
          />
          <button onClick={sendMessage}>전송</button>
          <button onClick={endChat} style={{ marginTop: "10px" }}>
            채팅 종료
          </button>
        </div>
      )}
    </div>
  );
}
