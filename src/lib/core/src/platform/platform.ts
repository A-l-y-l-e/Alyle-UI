import { Injectable } from '@angular/core';

// Whether the current platform supports the V8 Break Iterator. The V8 check
// is necessary to detect all Blink based browsers.
const hasV8BreakIterator = (typeof(Intl) !== 'undefined' && (Intl as any).v8BreakIterator);
/**
 * Service to detect the current platform by comparing the userAgent strings and
 * checking browser-specific global properties.
 */
export class Platform {
  static readonly isBrowser: boolean = typeof document === 'object' && !!document;
  /** Layout Engines */
  EDGE = Platform.isBrowser && /(edge)/i.test(navigator.userAgent);
  TRIDENT = Platform.isBrowser && /(msie|trident)/i.test(navigator.userAgent);

  // EdgeHTML and Trident mock Blink specific things and need to be excluded from this check.
  BLINK = Platform.isBrowser &&
      (!!((window as any).chrome || hasV8BreakIterator) && !!CSS && !this.EDGE && !this.TRIDENT);

  // Webkit is part of the userAgent in EdgeHTML, Blink and Trident. Therefore we need to
  // ensure that Webkit runs standalone and is not used as another engine's base.
  WEBKIT = Platform.isBrowser &&
      /AppleWebKit/i.test(navigator.userAgent) && !this.BLINK && !this.EDGE && !this.TRIDENT;

  /** Browsers and Platform Types */
  IOS = Platform.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  // It's difficult to detect the plain Gecko engine, because most of the browsers identify
  // them self as Gecko-like browsers and modify the userAgent's according to that.
  // Since we only cover one explicit Firefox case, we can simply check for Firefox
  // instead of having an unstable check for Gecko.
  FIREFOX = Platform.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);

  // Trident on mobile adds the android platform to the userAgent to trick detections.
  ANDROID = Platform.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;

  // Safari browsers will include the Safari keyword in their userAgent. Some browsers may fake
  // this and just place the Safari keyword in the userAgent. To be more safe about Safari every
  // Safari browser should also use Webkit as its layout engine.
  SAFARI = Platform.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT;
}
