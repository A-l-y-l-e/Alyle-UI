import { Component, HostListener, ElementRef } from '@angular/core';
import { LyTheme2 } from '../theme/theme2.service';
import { LyOverlayConfig } from './overlay-config';
import { LY_COMMON_STYLES } from '../styles/core-styles';

const STYLE_PRIORITY = -2;
export const STYLES_BACKDROP_ROOT = ({
  ...LY_COMMON_STYLES.fill,
  width: '100vw',
  height: '100vh',
  pointerEvents: 'all',
  userSelect: 'none'
});

@Component({
  selector: 'ly-overlay-backdrop',
  template: ``
})
export class LyOverlayBackdrop {
  @HostListener('click') onclick() {
    if (!this._config.disableClose) {
      this._config.fnDestroy!();
    }
  }
  constructor(
    private _el: ElementRef<HTMLElement>,
    _theme: LyTheme2,
    private _config: LyOverlayConfig
  ) {
    _el.nativeElement.classList.add(_theme.style(STYLES_BACKDROP_ROOT, STYLE_PRIORITY));

    // this applies custom class for backdrop,
    // if one is not defined, do nothing.
    const backdropClass = _config.backdropClass;
    if (backdropClass) {
      this._el.nativeElement.classList.add(backdropClass);
    }
  }
}
