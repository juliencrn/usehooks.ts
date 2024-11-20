# useContextMenu Hook

`useContextMenu` is a custom React hook that helps manage the visibility and position of a context menu. It tracks whether the menu is open or closed and updates its position based on the user's right-click location.

## Features
- Manage the visibility state of a context menu.
- Position the menu precisely based on the right-click coordinates.
- Automatically close the menu when the user clicks anywhere outside of it.

## Installation
To use this hook, simply copy the `useContextMenu` code into your project.

```typescript
import { useContextMenu } from 'usehooks-ts';
