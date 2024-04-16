Type-safe React hooks for debugging React component's changed props (and states), which returns the dependencies that changed on each iteration within the console.

## `useDebugInfo` Reference

### Parameter Explanation

- `componentName`: This changes the debug label outputted with the changed deps in the console.
- `props`: The props you want to observe for changes.
- `logOnlyWhenPropsChange`: If you want to display in console only when any prop changes.

### Parameter Types

- `effectConsoleName`: `string`
- `props`: `object`
- `logOnlyWhenPropsChange`: `boolean`

## Extra Details

- `useDebugInfo` just requires a `componentName` to be displayed in console and an object with all the props needed to be observed for changes.
- `useDebugInfo` has a final (optional) parameter `logOnlyWhenPropsChange` if you want displayed in the console only when anything changes and not every render.
- For `useDebugInfo`, besides which props have changed, the `renderCount` and `renderTime` is also displayed.

Standalone hook original source package for reference: https://www.npmjs.com/package/react-use-debug-hooks
