// src/types/global.d.ts

interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    webkit?: {
      messageHandlers?: {
        nativeHandler?: {
          postMessage: (message: any) => void;
        };
      };
    };
  }
  