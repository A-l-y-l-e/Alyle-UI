import { Directive } from '@angular/core';
import { LyTheme2, LY_COMMON_STYLES } from '@alyle/ui';

const STYLE_PRIORITY = -2;
const styles = ({
  root: {
    ...LY_COMMON_STYLES.fill
  }
});

@Directive({
  selector: '[lyTooltip]',
  exportAs: 'lyTooltip'
})
export class LyTooltip {
  readonly classes = this._theme.addStyleSheet(styles, STYLE_PRIORITY);
  constructor(
    private _theme: LyTheme2
  ) { }
}
