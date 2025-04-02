import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      "/api/square": {
        target: "https://connect.squareup.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/square/, ""),
        secure: true,
      },
      "/api/catalog": {  // Correct proxy for your backend
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,  // Since it's localhost
      },
    },
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));




// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   server: {
//     proxy: {
//       "/api/square": {
//         target: "https://connect.squareup.com",
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api\/square/, ""),
//         secure: true,
//       }
//     },
//     host: "::",
//     port: 8080,
//   },
//   plugins: [
//     react(),
//     mode === 'development' &&
//     componentTagger(),
//   ].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));
