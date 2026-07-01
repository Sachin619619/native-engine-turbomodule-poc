# Native Engine Stack POC - Simple Points

- React Native is used for the mobile UI.

- When the user clicks a button, the request starts from the React Native screen.

- React Native calls a TypeScript API function.

- The TypeScript API works like a clean wrapper between UI and native code.

- The UI does not directly call Android or C++ code.

- The TypeScript API calls the React Native native module.

- The Android native module receives the request from the JavaScript side.

- The Android layer converts the request into a format the native side can understand.

- The Android layer calls the JNI bridge.

- JNI is the connection between Android code and C/C++ code.

- JNI passes the input data to the C/C++ native engine.

- The C/C++ engine runs the business logic or algorithm.

- The C/C++ engine returns the calculated result back to JNI.

- JNI sends the result back to the Android native module.

- The Android native module sends the result back to the TypeScript API.

- The TypeScript API sends the final response back to the React Native UI.

- The React Native UI displays the result to the user.

## Main Flow

```text
React Native UI
  -> TypeScript API
  -> Android native module
  -> JNI bridge
  -> C/C++ engine
  -> Business logic
  -> Result returns back through the same layers
```

## What We Learned

- React Native can be used only for UI, while heavy logic can stay in native code.

- TypeScript API is useful because it hides native implementation details from the UI.

- Android native module is required to connect React Native with Android native code.

- JNI is required to connect Android native code with C/C++ code.

- C/C++ engine should be independent from the mobile UI.

- Keeping business logic in C/C++ makes it reusable and easier to test separately.

- Each layer should have only one responsibility.

- Logs are important at every layer because the request passes through multiple boundaries.

- If an issue happens, logs help identify whether the failure is in UI, TypeScript API, Android module, JNI, or C++ engine.

- This architecture is more complex than a normal React Native app, so setup documentation is important.

## Why This Layered Approach Is Useful

- UI remains simple.

- Native logic remains separate.

- Business rules can be reused.

- Performance-sensitive code can run in C/C++.

- Platform-specific code is isolated inside the Android layer.

- Future changes are easier because UI and native engine are not tightly coupled.

## Simple Meeting Update

- We implemented a sample React Native to native engine flow.

- The request starts from React Native UI and reaches C/C++ through TypeScript API, Android native module, and JNI.

- The C/C++ engine runs the business logic and returns the result back to the UI.

- Main learning: React Native can handle UI, and native C/C++ can handle reusable or performance-sensitive logic.

- The layered approach gives clean separation between UI, bridge code, and business algorithm.

