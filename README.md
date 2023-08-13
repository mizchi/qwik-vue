# @mizchi/qwik-vue

Qwikify vue components on qwik.

```bash
$ npm install @mizchi/qwik-vue @vitejs/plugin-vue vue -D
```

**CAUTION** - This is PoC phase. You should check it works on your app.

## How to use

### vite.config.ts

```ts
import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import vue from "@vitejs/plugin-vue";

export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      qwikVite()
    ],
  };
});
```

### Use vue components

```vue
<!-- src/components/App.vue -->
<script setup>
import { ref, defineProps } from 'vue';
const props = defineProps(["counter"]);
const count = ref(0);
</script>

<template>
  <div>{{props.counter}}</div>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

Render with `qwikifyVue$`

```tsx
import { component$ } from "@builder.io/qwik";
import App from "./components/App.vue";
import { qwikifyVue$ } from "@mizchi/qwik-vue";
const QApp = qwikifyVue$<{counter: number}>(App, {
  eagerness: 'load',
});
export default component$(() => {
  return <QApp counter={0} />;
});
```

---

# How to contribute

## develop

```bash
# clone
$ pnpm install
$ pnpm dev # check for src/root.tsx
$ pnpm build # emit lib files
```

## TODO

- [ ] unit testing
- [ ] `<Slot>`
- [ ] Props types for vue component

## LICENSE

MIT
