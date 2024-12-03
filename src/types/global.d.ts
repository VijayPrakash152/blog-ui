// src/types/global.d.ts

interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    gtag: (command: GtagCommand, idOrEventName: string, params?: GtagParams) => void;
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

type GtagCommand = 'config' | 'event';

interface GtagParams {
  // Common parameters for both 'config' and 'event'
  [key: string]: string | number | boolean | undefined;

  // 'config' specific parameters
  page_title?: string;
  page_location?: string;
  page_path?: string;

  // 'event' specific parameters
  event_category?: string;
  event_label?: string;
  value?: number;
}
