// api/story-generate.js
// Vercel Serverless Function — 스토리 모드 (4컷 만화 생성)
// @google/genai SDK + gemini-3-pro-image-preview 모델 사용
// 사용자 사진(선택) + 텍스트 프롬프트 → 4컷 만화 이미지

import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });

  try {
    const { prompt, photo, photoMimeType, meta } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt is required" });

    console.log("[story] book:", meta?.book_title);
    console.log("[story] has_photo:", !!photo);
    console.log("[story] prompt:", prompt.slice(0, 200));

    // ─── @google/genai SDK ───
    const ai = new GoogleGenAI({ apiKey });

    // contents 구성: 텍스트 + (선택) 사진
    const contents = [];

    // 사진이 있으면 이미지 파트 추가
    if (photo) {
      contents.push({
        inlineData: {
          mimeType: photoMimeType || "image/jpeg",
          data: photo,
        },
      });
    }

    // 텍스트 프롬프트
    contents.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: contents,
      config: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    });

    // 응답에서 이미지/텍스트 추출
    const parts = response.candidates?.[0]?.content?.parts || [];
    let imageData = null;
    let textResponse = "";

    for (const part of parts) {
      if (part.inlineData) {
        imageData = {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType || "image/png",
        };
      }
      if (part.text) {
        textResponse += part.text;
      }
    }

    if (!imageData) {
      console.warn("[story] No image in response. Text:", textResponse.slice(0, 200));
      return res.status(400).json({
        error: "NO_IMAGE",
        message: textResponse || "스토리 이미지가 생성되지 않았습니다. 다시 시도해주세요.",
      });
    }

    console.log("[story] ✅ 스토리 이미지 생성 성공");

    return res.status(200).json({
      success: true,
      image: {
        base64: imageData.base64,
        mimeType: imageData.mimeType,
        dataUrl: `data:${imageData.mimeType};base64,${imageData.base64}`,
      },
      text: textResponse || null,
      meta: { prompt: prompt.slice(0, 300), ...meta },
    });

  } catch (error) {
    console.error("[story] Error:", error.message || error);

    if (error.message?.includes("SAFETY") || error.message?.includes("blocked")) {
      return res.status(400).json({
        error: "IMAGE_BLOCKED",
        message: "안전 필터에 의해 차단되었습니다. 다른 묘사로 다시 시도해주세요.",
      });
    }

    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: error.message || "서버 오류가 발생했습니다.",
    });
  }
}