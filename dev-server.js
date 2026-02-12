// dev-server.js
// 로컬 개발용 API 서버 — Vercel 서버리스 함수를 로컬에서 실행
// 사용법:
//   1. .env.local 파일에 GEMINI_API_KEY=your_key 작성
//   2. node dev-server.js  (터미널 1)
//   3. npm run dev          (터미널 2 — Vite)

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // .env.local 파일에서 키 로드

import express from "express";
import cors from "cors";

// Vercel 서버리스 함수 import
import generateHandler from "./api/generate.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Vercel 함수를 Express 핸들러로 연결
app.post("/api/generate", (req, res) => {
  generateHandler(req, res);
});

// 헬스체크
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    keyPreview: process.env.GEMINI_API_KEY
      ? `${process.env.GEMINI_API_KEY.slice(0, 6)}...`
      : "NOT SET",
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 로컬 API 서버 실행 중: http://localhost:${PORT}`);
  console.log(`   헬스체크: http://localhost:${PORT}/api/health`);
  console.log(
    `   API 키: ${process.env.GEMINI_API_KEY ? "✅ 설정됨" : "❌ 미설정 (.env.local 확인)"}`
  );
  console.log(`\n📌 Vite를 별도 터미널에서 실행하세요: npm run dev\n`);
});