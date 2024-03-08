import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    // adjusting chunkSizeWarningLimit only because @mui lib is huge
    chunkSizeWarningLimit: 560,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => splitByGroups(id),
      },
    },
  },
});

const splitByGroups = (id: string) => {
  const chunkBigGroups = ["@mui", "@zxing", "@refinedev", "react-dom"];
  if (id.includes("node_modules")) {
    return chunkBigGroups.find((group) => id.includes(group)) ?? "vendor";
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const splitByModules = (id: string) => {
  if (id.includes('node_modules')) return id.toString().split('node_modules/')[1].split('/')[0].toString();
};


