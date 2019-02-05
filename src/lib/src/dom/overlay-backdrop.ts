import { Component, HostListener, ElementRef } from '@angular/core';
import { LyTheme2 } from '../theme/theme2.service';
import { LyOverlayConfig } from './overlay-config';
import { LY_COMMON_STYLES } from '../styles/core-styles';

const STYLE_PRIORITY = -2;
export const STYLES_BACKDROP_ROOT = ({
  ...LY_COMMON_STYLES.fill,
  pointerEvents: 'all',
  userSelect: 'none'
});

@Component({
  selector: 'ly-overlay-backdrop',
  template: ``
})
export class LyOverlayBackdrop {
  @HostListener('click') onclick() {
    this._config.fnDestroy!();
  }
  constructor(
    private _el: ElementRef<HTMLElement>,
    private _theme: LyTheme2,
    private _config: LyOverlayConfig
  ) {
    _el.nativeElement.classList.add(_theme.style(STYLES_BACKDROP_ROOT, STYLE_PRIORITY));

    // this applies custom styles for backdrop,
    // if one is not defined, do nothing.
    const backdropStyleBlock = _config.backdropStyleBlock;
    if (backdropStyleBlock) {
      const className = this._theme.style(backdropStyleBlock, STYLE_PRIORITY + 1);
      this._el.nativeElement.classList.add(className);
    }
  }
}
