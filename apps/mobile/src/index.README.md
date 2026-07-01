# `apps/mobile/src/index.js`

## Why This File Exists

This is a source-level entry variant. The main app currently uses `apps/mobile/index.js`, but this file keeps the same registration pattern available inside `src`.

## Full Flow

```text
React Native runtime
  -> src/index.js
  -> App
  -> AppRegistry registration
```

## Why Keep It

It makes the source folder self-contained if the entry path is changed later. It is also useful for explaining that React Native always needs a registration point.

## Logs

This file logs:

```text
[apps/mobile/src/index.js] Registering root component from src entrypoint.
```
