# Core Engine Public Header

## `engine.h`

Public C++ API used by JNI and tests.

Defines:

- `EngineInput`
- `EngineResult`
- `runEngine`
- `toJson`

Other layers should depend on this header instead of internal algorithm files.
