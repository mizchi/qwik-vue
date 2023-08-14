// based qwikify-react on https://github.com/BuilderIO/qwik/blob/main/packages/qwik-react/src/react/qwikify.tsx
import {
  RenderOnce,
  SSRRaw,
  component$,
  implicit$FirstArg,
  noSerialize,
  useSignal,
  useTask$,
  type NoSerialize,
  type QRL,
  $,
  useOn,
  useOnDocument,
  SkipRender,
} from '@builder.io/qwik';
import { isBrowser, isServer } from '@builder.io/qwik/build';
import type { QwikifyProps } from "./types";
import { h, createSSRApp, ref, type Ref } from "vue";
import { renderToString } from "vue/server-renderer";
import { type Component as VueComponent, ComponentPublicInstance } from "vue";

interface QwikifyOptions {
  tagName?: string;
  eagerness?: 'load' | 'visible' | 'idle' | 'hover';
  event?: string | string[];
  clientOnly?: boolean;
}

type VueClientCtx<P> = {instance: ComponentPublicInstance, ssrCtx: Ref<P>}
// TODO: Slot not supported yet
export function qwikifyVueQrl<PROPS extends {}>(
  Cmp$: QRL<VueComponent>,
  opts?: QwikifyOptions
) {
  return component$((props: QwikifyProps<PROPS>) => {
    const hostRef = useSignal<Element>();
    const appState = useSignal<NoSerialize<VueClientCtx<PROPS>>>();
    const [signal, isClientOnly] = useWakeupSignal(props, opts);
    const TagName = opts?.tagName ?? ('qwik-vue' as any);
    useTask$(async ({ track }) => {
      const trackedProps = track(() => ({ ...props }));
      track(signal);
      if (!isBrowser) return;
      const Cmp: any = await Cmp$.resolve();
      if (appState.value) {
        appState.value.ssrCtx.value = {...toVueProps(trackedProps)} as PROPS;
        return;
      }
      if (hostRef.value) {
        const ssrCtx = ref({...toVueProps(trackedProps)}) as Ref<PROPS>;
        const instance = createSSRApp({
          inject: ['__ssrCtx'],
          render() {
            return h(Cmp, ssrCtx.value)
          },
        })
          .provide('__ssrCtx', ssrCtx)
          .mount(hostRef.value, true);
        appState.value = noSerialize({
          instance,
          ssrCtx,
        });
      }
    });
    if (isServer && !isClientOnly) {
      const cmpLoading = Cmp$.resolve();
      return <RenderOnce>
        <TagName ref={hostRef}>
          {cmpLoading.then(async (Cmp: any) => {
            const ssrApp = createSSRApp({
              render() {
                return h(Cmp, toVueProps(props))
              },
            });
            const html = await renderToString(ssrApp);
            return <SSRRaw data={html}/>;  
          })}
        </TagName>
      </RenderOnce>;
    }
    return (
      <RenderOnce>
        <TagName
          {...props}
          ref={hostRef}
        >
          {SkipRender}
        </TagName>
      </RenderOnce>
    );
  });
}

const HOST_PREFIX = 'host:';
const toVueProps = (props: Record<string, any>): Record<string, any> => {
  return Object.entries(props).reduce((acc, [key, val]) => {
    if (!key.startsWith('client:') && !key.startsWith(HOST_PREFIX)) {
      return {...acc, [key.endsWith('$') ? key.slice(0, -1) : key]: val};
    }
    return acc;
  }, {})
};

const useWakeupSignal = (props: QwikifyProps<{}>, opts: QwikifyOptions = {}) => {
  const signal = useSignal(false);
  const activate = $(() => (signal.value = true));
  const clientOnly = !!(props['client:only'] || opts?.clientOnly);
  if (isServer) {
    if (props['client:visible'] || opts?.eagerness === 'visible') {
      useOn('qvisible', activate);
    }
    if (props['client:idle'] || opts?.eagerness === 'idle') {
      useOnDocument('qidle', activate);
    }
    if (props['client:load'] || clientOnly || opts?.eagerness === 'load') {
      useOnDocument('qinit', activate);
    }
    if (props['client:hover'] || opts?.eagerness === 'hover') {
      useOn('mouseover', activate);
    }
    if (props['client:event']) {
      useOn(props['client:event'], activate);
    }
    if (opts?.event) {
      useOn(opts?.event, activate);
    }
  }
  return [signal, clientOnly, activate] as const;
};



export const qwikifyVue$ = /*#__PURE__*/ implicit$FirstArg(qwikifyVueQrl);