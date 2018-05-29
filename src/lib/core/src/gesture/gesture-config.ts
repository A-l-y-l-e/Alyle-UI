import { Injectable } from '@angular/core';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { HammerInstance } from '@angular/platform-browser/src/dom/events/hammer_gestures';

@Injectable()
export class LyHammerGestureConfig extends HammerGestureConfig {
  private _hammer = typeof window !== 'undefined' ? (window as any).Hammer : null;
  events: string[] = this._hammer ? [
    // 'end',
    'slide',
    'slidestart',
    'slideend',
    'slideright',
    'slideleft'
  ] : [];
  buildHammer(element: HTMLElement): HammerInstance {
    const mc = new this._hammer(element, undefined);

    const pan = new this._hammer.Pan({threshold: 0});
    const swipe = new this._hammer.Swipe();
    const slide = new this._hammer.Pan({event: 'slide', threshold: 0});

    slide.recognizeWith(swipe);
    pan.recognizeWith(swipe);

    // Add customized gestures to Hammer manager
    mc.add([swipe, pan, slide]);
    return mc;
  }
}

export const LY_HAMMER_GESTURE_CONFIG_PROVIDER = {provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig} as any;
