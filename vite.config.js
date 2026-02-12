import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api 요청을 로컬 dev-server.js (포트 3001)로 프록시
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});