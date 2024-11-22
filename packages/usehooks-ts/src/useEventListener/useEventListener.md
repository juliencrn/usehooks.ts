## Use EventListener with simplicity by React Hook.

Supports `Window`, `Element`, `Document`, `EventTarget` Based and custom events with almost the same parameters as the native [`addEventListener` options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#syntax). See examples below.

If you want to use your CustomEvent using Typescript follow one of three options:

## 1. Globally Declared CustomEventMap, intersects all DOM Elements EventMaps

```ts
// globals.d.ts
declare global {
  /** Extends EventMap declarations for all DOM Elements (intersection)*/
  interface CustomEventMap {
    'my-custom-event': CustomEvent<{ isCustom: boolean }>
    order: { orderId: number; name: string }
    delivery: { itemCount: number }
  }
}

// page.tsx

useEventListener('delivery', ({ itemCount }) => {
  console.log('count', itemCount)
})

useEventListener('my-custom-event', event => {
  console.log('boolean:', event.detail.isCustom)
})
```

## 2. Use EventMap generic override:

```typescript
type OrderEventMap = {
  order: { orderId: number; name: string }
  delivery: { itemCount: number }
}
useEventListener<OrderEventMap>('order', ({ orderId }) => {
  console.log('id', orderId)
})
```

## 3. Declare the event type as an intersection of the specific Element EventMap:

```ts
// global.d.ts
declare global {
  /** Intersects EventMap declarations for DOM Window Element (default DOM target for hook listener) */
  interface WindowEventMap {
    'my-custom-event': CustomEvent<{ exampleArg: string }>
  }
}
```

Available EventMap at useEventListener.ts

- `WindowEventMap`
- `HTMLElementEventMap`
- `DocumentEventMap`

Event Targets:

- `MediaQueryListEventMap`
- `RTCDataChannelEventMap`
- `RTCPeerConnectionEventMap`
- `SpeechSynthesisEventMap`
- `SpeechSynthesisUtteranceEventMap`
