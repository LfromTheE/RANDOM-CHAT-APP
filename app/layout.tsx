import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata = {
  title: "랜덤 채팅",
  description: "WebRTC와 Socket.io로 구성한 랜덤 채팅 서비스",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
          <Link href="/">홈</Link> | <Link href="/signup">회원가입</Link>
        </header>
        <main style={{ padding: "20px" }}>{children}</main>
      </body>
    </html>
  );
}
