import { Component, HostListener, ElementRef } from '@angular/core';
import { LyTheme2 } from '../theme/theme2.service';
import { LyOverlayConfig } from './overlay-config';
import { LyCoreStyles } from '../styles/core-styles';
import { STYLES_BACKDROP_TRANSPARENT } from './overlay-styles';

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
    private _config: LyOverlayConfig,
    commonStyles: LyCoreStyles
  ) {
    _el.nativeElement.classList.add(commonStyles.classes.fill);

    // this applies custom styles for backdrop,
    // if one is not defined, add the transparent style.
    const backdropStyleBlock = _config.backdropStyleBlock || STYLES_BACKDROP_TRANSPARENT;
    const className = this._theme.style(backdropStyleBlock);
    this._el.nativeElement.classList.add(className);
  }
}
