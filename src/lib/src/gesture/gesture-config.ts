import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import { HammerOptions, HammerInstance } from './gesture-annotations';

export const LY_HAMMER_OPTIONS = new InjectionToken<HammerOptions>('LY_HAMMER_OPTIONS');

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
  constructor(
    @Optional() @Inject(LY_HAMMER_OPTIONS) private _hammerOptions: HammerOptions,
    // private coreTheme: CoreTheme,
  ) {
    super();
  }
  buildHammer(element: HTMLElement): HammerInstance {
    // if (Platform.isBrowser) {
    //   const newClass = this.coreTheme.setUpStyle('k-hammer-css', {
    //     '': () => (
    //       `user-select: none;` +
    //       `-webkit-user-drag: none;` +
    //       `-webkit-tap-highlight-color: rgba(0, 0, 0, 0);`
    //     )
    //   });
    //   element.classList.add(newClass);
    // }
    const mc = new this._hammer(element, this._hammerOptions || undefined);

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
