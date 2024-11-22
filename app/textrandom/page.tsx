"use client";

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://random-chat-app-six.vercel.app/");

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
    <div style={{ maxWidth: "60%", margin: "0 auto", paddingTop: "20px" }}>
      {!connected ? (
        <button onClick={startChat}>채팅 시작하기</button>
      ) : (
        <div
          style={{
            position: "relative",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          {/* 채팅 종료 버튼 */}
          <button
            onClick={endChat}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "0.9em",
            }}
          >
            채팅 종료
          </button>

          {/* 메시지 표시 창 */}
          <div
            style={{
              height: "300px",
              overflowY: "auto",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              marginBottom: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: "5px" }}>
                {msg}
              </div>
            ))}
          </div>

          {/* 메시지 입력 창 */}
          <div style={{ display: "flex", gap: "5px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="메시지를 입력하세요..."
              style={{
                flex: "1",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <button onClick={sendMessage} style={{ padding: "8px 12px" }}>
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
