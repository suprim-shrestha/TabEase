import path, { resolve } from "path";
import { defineConfig } from "vite";
export default defineConfig({
  root: "./src/",
  server: {
    port: 4000,
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src', 'index.html'),
        login: resolve(__dirname, 'src', 'views/auth/login/index.html'),
        signup: resolve(__dirname, 'src', 'views/auth/signup/index.html'),
        home: resolve(__dirname, 'src', 'views/home/index.html')
      }
    }
  },
  resolve: {
    alias: {
      "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
      "~normalize": path.resolve(__dirname, "node_modules/normalize.css"),
    },
  },
});
