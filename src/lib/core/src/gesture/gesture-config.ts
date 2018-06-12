import { Injectable } from '@angular/core';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { HammerInstance } from '@angular/platform-browser/src/dom/events/hammer_gestures';

@Injectable()
export class LyHammerGestureConfig extends HammerGestureConfig {
  private _hammer = typeof window !== 'undefined' ? (window as any).Hammer : null;
  events: string[] = this._hammer ? [
    'slide',
    'slidestart',
    'slideend',
    'slideright',
    'slideleft'
  ] : [];
  constructor() {
    super();
  }
  buildHammer(element: HTMLElement): HammerInstance {
    const mc = new this._hammer(element, undefined);

    const pan = new this._hammer.Pan();
    const swipe = new this._hammer.Swipe();
    const slide = this._createRecognizer(pan, {event: 'slide', threshold: 0}, swipe);

    slide.recognizeWith(swipe);
    pan.recognizeWith(swipe);

    // Add customized gestures to Hammer manager
    mc.add([swipe, pan, slide]);
    return mc;
  }

  /** Creates a new recognizer, without affecting the default recognizers of HammerJS */
  private _createRecognizer(base: any, options: any, ...inheritances: any[]) {
    const recognizer = new (base.constructor)(options);

    inheritances.push(base);
    inheritances.forEach(item => recognizer.recognizeWith(item));

    return recognizer;
  }
}

export const LY_HAMMER_GESTURE_CONFIG_PROVIDER = {provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig} as any;
