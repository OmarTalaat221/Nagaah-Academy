import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: ["**/*.jsx", "**/*.tsx", "**/*.js", "**/*.ts"],
      babel: {
        parserOpts: {
          plugins: ["jsx", "typescript"],
        },
      },
    }),
  ],

  define: {
    "process.env": {},
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  esbuild: {
    loader: "tsx",
    include: /.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".jsx": "jsx",
        ".ts": "tsx",
        ".tsx": "tsx",
      },
    },
  },
});
