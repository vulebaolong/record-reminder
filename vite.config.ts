import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
   plugins: [react()],
   base: "./", // ✅ Đường dẫn tương đối quan trọng cho Electron!
   build: {
      outDir: "dist",
      emptyOutDir: true,
   },
});
