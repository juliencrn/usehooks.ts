A Simple hook to get user's preference about reduced motion.

It returns a boolean value indicating if the user has requested reduced motion based on the `prefers-reduced-motion` media query.
It will return `null` if called in SSR or if the browser does not support the `prefers-reduced-motion` media query.

The query used to check the user's preference is `(prefers-reduced-motion)`. This means that if the user has not set a preference, it will return `false`.
