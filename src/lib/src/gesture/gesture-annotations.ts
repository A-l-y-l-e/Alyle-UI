export interface HammerInput {
  preventDefault: () => {};
  deltaX: number;
  deltaY: number;
  center: { x: number; y: number; };
}

export interface HammerStatic {
  new(element: HTMLElement | SVGElement, options?: any): HammerManager;

  Pan: Recognizer;
  Swipe: Recognizer;
  Press: Recognizer;
}

export interface Recognizer {
  // tslint:disable-next-line:no-misused-new
  new(options?: any): Recognizer;
  recognizeWith(otherRecognizer: Recognizer | string): Recognizer;
}

export interface RecognizerStatic {
  new(options?: any): Recognizer;
}

export interface HammerInstance {
  on(eventName: string, callback: Function): void;
  off(eventName: string, callback: Function): void;
}

export interface HammerManager {
  add(recogniser: Recognizer | Recognizer[]): Recognizer;
  set(options: any): HammerManager;
  emit(event: string, data: any): void;
  off(events: string, handler?: Function): void;
  on(events: string, handler: Function): void;
}

export interface HammerOptions {
  cssProps?: {[key: string]: string};
  domEvents?: boolean;
  enable?: boolean | ((manager: HammerManager) => boolean);
  preset?: any[];
  touchAction?: string;
  recognizers?: any[];

  inputClass?: HammerInput;
  inputTarget?: EventTarget;
}
