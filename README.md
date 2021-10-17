# Orderbook

This is an awesome orderbook built with NextJS, Tailwind and Redux Sagas!

## Getting Started

```bash
yarn dev
```

## Implementation Details

Here is a list of relevant changes for performance 🚀

<details>
  <summary>Configure babel to transpile to newest browsers</summary>
  The default target for NextJS builds is ES5.
  We build for new browsers in order to use built-in generators.
</details>

<details>
  <summary>Use browser's dir property to avoid layout shift</summary>
  We need to change the order of text in screen, CSS text-align seems to trigger layout.
  Then dir property was adopted to avoid that.
  Notice that this could have been flex-direction too.
</details>

<details>
  <summary>Dinamically batch redux dispatch using redux-saga based on client performance</summary>
  We use browser's performance API to calculate the time used to dispatch and re-render the interface.
  Based on that number we decide for how long we should delay the next dispatch.
  This makes the main thread free for other computings in the interface.
</details>

<details>
  <summary>Apply socket patches into a sorted array in-place to avoid sorting</summary>
  The orderbook have an descending order in most of the cases, in one we have a descending order.
  Every time we receive updates from the socket we place them in the right position in the orders array, descending.
  This makes us avoid sorting completely in VERTICAL (mobile), and sort only one side in HORIZONTAL (desktop).
</details>
