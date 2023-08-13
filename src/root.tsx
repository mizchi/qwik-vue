import { component$, useSignal } from "@builder.io/qwik";
// @ts-ignore
import VueApp from "./components/App.vue";
import { qwikifyVue$ } from "./vue";

const QApp = qwikifyVue$<{counter: number}>(VueApp, {
  eagerness: 'load',
});

const Root = component$(() => {
  const counter = useSignal(1);
  return (
    <>
      <h2>Qwik</h2>
      <button onClick$={() => counter.value++}>{counter.value}</button>
      <hr />
      <h3>Vue</h3>
      <QApp counter={counter.value} />
    </>
  );
});

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <Root />
        {/* <QApp name="svelte"/> */}
      </body>
    </>
  );
};
