import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import vue from "@vitejs/plugin-vue";

export default defineConfig(() => {
  return {
    build: {
      target: "es2020",
      lib: {
        entry: ['./src/index.qwik.ts'],
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        external: [
          '@builder.io/qwik',
          '@builder.io/qwik/build',
          "vue",
          "vue/runtime",
          'vue/server-renderer',
        ],
      }
    },
    plugins: [
      vue({}),
      qwikVite()
    ],
  };
});
