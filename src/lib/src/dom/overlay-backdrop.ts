import { Component, HostListener, ElementRef } from '@angular/core';
import { LyTheme2 } from '../theme/theme2.service';
import { OverlayRef } from './overlay-ref';
import { LyCoreStyles } from '../styles/core-styles';

const BACKDROP_STYLES = ({
  backdrop: {
    pointerEvents: 'all',
    userSelect: 'none'
  }
});

@Component({
  selector: 'ly-overlay-backdrop',
  template: ``
})
export class LyOverlayBackdrop {
  /** @docs-private */
  readonly classes = this._theme.addStyleSheet(BACKDROP_STYLES);
  @HostListener('click') onclick() {
    this._overlayConfig.config.fnDestroy!();
  }
  constructor(
    el: ElementRef,
    private _theme: LyTheme2,
    private _overlayConfig: OverlayRef,
    commonStyles: LyCoreStyles
  ) {
    el.nativeElement.classList.add(commonStyles.classes.fill);
    if (_overlayConfig.config.backdrop) {
      el.nativeElement.classList.add(this.classes.backdrop);
    }
  }
}
