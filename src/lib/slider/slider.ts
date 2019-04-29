import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLE_PRIORITY = 2;
const STYLES = () => ({
  $priority: STYLE_PRIORITY
});

@Component({
  selector: 'ly-slider',
  templateUrl: 'slider.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lySlider',
})
export class LySlider {
  readonly classes = this._theme.addStyleSheet(STYLES);
  constructor(
    private _theme: LyTheme2
  ) {

  }
}
