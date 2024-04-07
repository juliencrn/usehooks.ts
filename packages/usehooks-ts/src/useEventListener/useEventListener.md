Use EventListener with simplicity by React Hook.

Supports `Window`, `Element` and `Document` and custom events with almost the same parameters as the native [`addEventListener` options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#syntax). See examples below.

If you want to use your CustomEvent using Typescript, you have to declare the event type.
Find which kind of Event you want to extends:

- `MediaQueryListEventMap`
- `WindowEventMap`
- `HTMLElementEventMap`
- `DocumentEventMap`

This hook also supports any implementation of the `EventTarget` interface, however this doesn't bring the same level of type-safety that the `*EventMap`s do.

Then declare your custom event:

```ts
declare global {
  interface DocumentEventMap {
    'my-custom-event': CustomEvent<{ exampleArg: string }>
  }
}
```
