`useTextInput` is a simple hook that manages a text input's state and its error (optional).

It optionally receives an object with `initialValue` and `validators`. `validators` is an array of validator functions that throw an error if `value` does not pass the validation. If a validator function throws an error, the `value` state persists but the `error` state will be updated accordingly.
