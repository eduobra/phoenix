export {};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  // Define a minimal SpeechRecognition type
  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start(): void;
    stop(): void;
    abort(): void;
    onaudiostart?: (ev: Event) => void;
    onaudioend?: (ev: Event) => void;
    onend?: (ev: Event) => void;
    onerror?: (ev: Event) => void;
    onnomatch?: (ev: Event) => void;
    onresult?: (ev: SpeechRecognitionEvent) => void;
    onsoundstart?: (ev: Event) => void;
    onsoundend?: (ev: Event) => void;
    onspeechend?: (ev: Event) => void;
    onstart?: (ev: Event) => void;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }
}
