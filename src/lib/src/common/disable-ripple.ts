import { ElementRef, NgZone } from '@angular/core';
import { Constructor } from './constructor';
import { toBoolean } from '../minimal/is-boolean';
import { LyTheme2 } from '../theme/theme2.service';
import { Ripple, RippleConfig } from '../ripple/ripple';
import { styles } from '../ripple/ripple.service';
import { Platform } from '@angular/cdk/platform';

export interface RequireParams {
  _theme: LyTheme2;
  _ngZone: NgZone;
  _platform: Platform;
}

export interface CanDisableRipple {
  _triggerElement: ElementRef;
  _rippleContainer: ElementRef;
  disableRipple: boolean;
  _rippleConfig: RippleConfig;
  _removeRippleEvents: () => void;
}

export function mixinDisableRipple<T extends Constructor<RequireParams>>(base: T): Constructor<CanDisableRipple> & T {
  return class extends base {
    _rippleContainer: ElementRef;
    _triggerElement: ElementRef;
    _rippleConfig: RippleConfig = {};
    private _ripple: Ripple | null;
    private _disableRipple;

    get disableRipple(): boolean { return this._disableRipple; }
    set disableRipple(val: boolean) {
      if (this._platform.isBrowser && val !== this._disableRipple) {
        const newVal = this._disableRipple = toBoolean(val);
        // remove previous ripple if exist
        this._removeRippleEvents();
        if (!newVal) {
          // add ripple
          Promise.resolve(null).then(() => {
            const triggerElement: HTMLElement = this._triggerElement.nativeElement;
            const rippleContainer = (this._rippleContainer && this._rippleContainer.nativeElement) || triggerElement;
            this._ripple = new Ripple(this._theme.variables, this._ngZone, this._theme.addStyleSheet(styles), rippleContainer, this._platform, triggerElement);
            this._ripple.setConfig(this._rippleConfig);
          });
        }
      }
    }

    constructor(...args: any[]) {
      super(...args);
    }

    _removeRippleEvents() {
      if (this._platform.isBrowser) {
        if (this._ripple) {
          this._ripple.removeEvents();
          this._ripple = null;
        }
      }
    }
  };
}
