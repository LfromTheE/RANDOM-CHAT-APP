"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function HomePage() {
  const router = useRouter();

  const handleVideoChat = () => {
    router.push("/videorandom");
  };

  const handleTextChat = () => {
    router.push("/textrandom");
  };

  return (
    <div>
      <h1>랜덤 채팅 선택</h1>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={handleVideoChat}>화상 랜덤 채팅</button>
        <button onClick={handleTextChat}>일반 랜덤 채팅</button>
      </div>
    </div>
  );
}
