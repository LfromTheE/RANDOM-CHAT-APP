"use client";
import React from "react";

export default function Signup() {
  return (
    <div>
      <h1>회원가입</h1>
      <form>
        <label>
          이메일:
          <input type="email" required />
        </label>
        <br />
        <label>
          비밀번호:
          <input type="password" required />
        </label>
        <br />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}
