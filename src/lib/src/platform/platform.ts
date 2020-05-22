
// Whether the current platform supports the V8 Break Iterator. The V8 check
// is necessary to detect all Blink based browsers.
const hasV8BreakIterator = (typeof(Intl) !== 'undefined' && (Intl as any).v8BreakIterator);
/**
 * Service to detect the current platform by comparing the userAgent strings and
 * checking browser-specific global properties.
 * @deprecated Use Angular CDK instead
 * `import { Platform } from '@angular/cdk/platform'`
 */
export class Platform {
  static readonly isBrowser: boolean = typeof document === 'object' && !!document;
  /** Layout Engines */
  static readonly EDGE = Platform.isBrowser && /(edge)/i.test(navigator.userAgent);
  static readonly TRIDENT = Platform.isBrowser && /(msie|trident)/i.test(navigator.userAgent);

  // EdgeHTML and Trident mock Blink specific things and need to be excluded from this check.
  static readonly BLINK = Platform.isBrowser &&
      (!!((window as any).chrome || hasV8BreakIterator) && !!CSS && !Platform.EDGE && !Platform.TRIDENT);

  // Webkit is part of the userAgent in EdgeHTML, Blink and Trident. Therefore we need to
  // ensure that Webkit runs standalone and is not used as another engine's base.
  static readonly WEBKIT = Platform.isBrowser &&
      /AppleWebKit/i.test(navigator.userAgent) && !Platform.BLINK && !Platform.EDGE && !Platform.TRIDENT;

  /** Browsers and Platform Types */
  static readonly IOS = Platform.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  // It's difficult to detect the plain Gecko engine, because most of the browsers identify
  // them self as Gecko-like browsers and modify the userAgent's according to that.
  // Since we only cover one explicit Firefox case, we can simply check for Firefox
  // instead of having an unstable check for Gecko.
  static readonly FIREFOX = Platform.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);

  // Trident on mobile adds the android platform to the userAgent to trick detections.
  static readonly ANDROID = Platform.isBrowser && /android/i.test(navigator.userAgent) && !Platform.TRIDENT;

  // Safari browsers will include the Safari keyword in their userAgent. Some browsers may fake
  // this and just place the Safari keyword in the userAgent. To be more safe about Safari every
  // Safari browser should also use Webkit as its layout engine.
  static readonly SAFARI = Platform.isBrowser && /safari/i.test(navigator.userAgent) && Platform.WEBKIT;
}
