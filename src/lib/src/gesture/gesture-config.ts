import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import { HammerOptions, HammerInstance } from './gesture-annotations';

export const LY_HAMMER_OPTIONS = new InjectionToken<HammerOptions>('LY_HAMMER_OPTIONS');

const HAMMER_GESTURES_EVENTS = [
  'slide',
  'slidestart',
  'slideend',
  'slideright',
  'slideleft'
];

@Injectable()
export class LyHammerGestureConfig extends HammerGestureConfig {
  events: string[] = HAMMER_GESTURES_EVENTS;
  constructor(
    @Optional() @Inject(LY_HAMMER_OPTIONS) private _hammerOptions: HammerOptions
  ) {
    super();
  }
  buildHammer(element: HTMLElement): HammerInstance {
    const hammer = typeof window !== 'undefined' ? (window as any).Hammer : null;
    const mc = new hammer(element, this._hammerOptions || undefined);

    const pan = new hammer.Pan();
    const swipe = new hammer.Swipe();
    const slide = this._createRecognizer(pan, {event: 'slide', threshold: 0}, swipe);

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
