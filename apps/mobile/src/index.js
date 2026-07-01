import { AppRegistry } from "react-native";

import { App } from "./App";

console.log("[apps/mobile/src/index.js] Registering root component from src entrypoint.");
AppRegistry.registerComponent("GenericNativeEngineMobile", () => App);
