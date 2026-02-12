// api/generate.js
// Vercel Serverless Function — Gemini 이미지 생성 프록시
// @google/genai SDK + gemini-2.5-flash-image 모델 사용

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
    const { prompt, meta } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt is required" });

    console.log("[generate] channel:", meta?.channel);
    console.log("[generate] prompt:", prompt.slice(0, 200));

    // ─── @google/genai SDK 사용 ───
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
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
      console.warn("[generate] No image in response. Text:", textResponse.slice(0, 200));
      return res.status(400).json({
        error: "NO_IMAGE",
        message: textResponse || "이미지가 생성되지 않았습니다. 다른 스타일로 다시 시도해주세요.",
      });
    }

    console.log("[generate] ✅ 이미지 생성 성공, mimeType:", imageData.mimeType);

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
    console.error("[generate] Error:", error.message || error);

    // 안전 필터 차단
    if (error.message?.includes("SAFETY") || error.message?.includes("blocked")) {
      return res.status(400).json({
        error: "IMAGE_BLOCKED",
        message: "안전 필터에 의해 차단되었습니다. 다른 스타일로 다시 시도해주세요.",
      });
    }

    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: error.message || "서버 오류가 발생했습니다.",
    });
  }
}