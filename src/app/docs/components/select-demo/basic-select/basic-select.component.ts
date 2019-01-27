import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const STYLES = (_theme: ThemeVariables) => ({ });

@Component({
  selector: 'aui-basic-select',
  templateUrl: './basic-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicSelectComponent {
  readonly classes = this._theme.addStyleSheet(STYLES);

  constructor(private _theme: LyTheme2) { }
}
