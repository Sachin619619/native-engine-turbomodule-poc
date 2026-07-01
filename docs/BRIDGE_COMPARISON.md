# Native Bridge Comparison

This document compares the two React Native bridge styles used for calling Android native code from JavaScript.

## Short Summary

| Topic | Classic Native Module Bridge | TurboModule Bridge |
| --- | --- | --- |
| Main idea | JavaScript calls native code through `NativeModules`. | JavaScript calls native code through a typed Codegen contract and `TurboModuleRegistry`. |
| React Native architecture | Old architecture. | New architecture. |
| Contract between JS and native | Mostly manual. JS and Android must stay in sync by developer discipline. | Generated from a TypeScript spec, so JS and Android are connected through a declared contract. |
| Native module lookup | Module is found through the classic bridge registry. | Module is found through `TurboModuleRegistry`. |
| Android base class | Usually extends `ReactContextBaseJavaModule`. | Extends a generated spec class such as `NativeEngineSpec`. |
| Package class | Usually implements `ReactPackage`. | Usually extends `TurboReactPackage`. |
| Build requirement | No Codegen contract is required. | Needs `codegenConfig`, a spec file, and New Architecture enabled. |
| Best fit | Simple apps, older React Native apps, or quick compatibility work. | New React Native apps, typed native APIs, long-term native integration work. |

## Implementation Difference In This POC Style

| Layer | Classic Bridge Implementation | TurboModule Implementation |
| --- | --- | --- |
| TypeScript API | Calls `NativeModules.NativeEngine.analyze(...)`. | Calls `NativeEngine.analyze(...)` from a typed TurboModule spec. |
| TypeScript native file | Manually defines the expected module shape or directly uses `NativeModules`. | Uses `TurboModule`, `TurboModuleRegistry`, and a typed `Spec` interface. |
| Android module | Extends `ReactContextBaseJavaModule`. | Extends generated `NativeEngineSpec`. |
| Android package | Registers module through a normal `ReactPackage`. | Registers module through `TurboReactPackage`. |
| Code generation | Not required. | Required. React Native generates the Android spec from TypeScript. |
| Runtime path | JS bridge serializes calls into the native module system. | JS calls the generated TurboModule entry, then Android receives the typed method call. |
| Error discovery | Many contract mistakes appear at runtime. | More contract mistakes are found earlier because the method contract is declared. |

## Advantages And Disadvantages

| Bridge | Advantages | Disadvantages |
| --- | --- | --- |
| Classic Native Module Bridge | Easier to start for old projects. Less setup. More examples available in older apps. Works well for simple native calls. | Manual contract can drift between JS and Android. Less suitable for New Architecture work. More runtime-only mistakes. Not the preferred direction for newer React Native native modules. |
| TurboModule Bridge | Typed contract between JS and native. Better fit for New Architecture. Cleaner for long-term native APIs. Codegen reduces manual mismatch. Good for reusable engine-style integrations. | More setup. Codegen must be configured correctly. Requires New Architecture knowledge. Build errors can be harder at first until the setup is understood. |

## Why TurboModule Is Better For This POC

This POC is not just calling one small Android utility. It is showing a layered native-engine stack:

```text
React Native UI
  -> TypeScript API
  -> TurboModule
  -> Android wrapper AAR
  -> JNI
  -> C++ engine
  -> business algorithm
```

For this kind of stack, TurboModule is better because:

- The JavaScript-to-native boundary is explicit.
- The native API has a typed spec.
- Android implementation follows the generated contract.
- The bridge layer is easier to explain and maintain.
- The POC is aligned with React Native New Architecture.
- It gives a stronger story for future Android and iOS native-engine integration.

## When Classic Bridge Is Still Fine

Classic bridge is still acceptable when:

- The app is already on the old architecture.
- The native API is small and unlikely to change.
- The team needs quick compatibility with existing native modules.
- The project is not planning New Architecture migration soon.

## When TurboModule Is The Better Choice

TurboModule is the better choice when:

- The app is new or moving to React Native New Architecture.
- The native API is important and will grow.
- The team wants a typed JS-to-native contract.
- The native layer calls into reusable Android or C++ code.
- The same native concept may later be implemented on iOS.

## Manager-Friendly Conclusion

Classic bridge is simpler for quick work.

TurboModule is better for this POC because the project is demonstrating a serious native-engine path, not only a small native helper. The typed contract, generated native spec, and New Architecture alignment make the TurboModule approach cleaner for long-term maintenance.
