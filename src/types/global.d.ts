// src/types/global.d.ts

interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    webkit?: {
      messageHandlers?: {
        nativeHandler?: {
          postMessage: (message: string) => void;
        };
      };
    };
  }
  declare namespace JSX {
    interface IntrinsicElements {
        'hyvor-talk-comments': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
}