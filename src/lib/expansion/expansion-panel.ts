import { Component, Input, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { toBoolean, ThemeVariables, LyTheme2 } from '@alyle/ui';

const STYLE_PRIORITY = -2;

const STYLES = ({
  root: {
    display: 'block'
  }
});

@Component({
  selector: 'ly-expansion-panel',
  templateUrl: './expansion-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lyExpansionPanel'
})
export class LyExpansionPanel {

  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);

  private _disabled: boolean;
  private _expanded: boolean;
  private _hasToggle: boolean;

  @Input()
  set disabled(val: boolean | '') {
    this._disabled = toBoolean(val);
  }
  get disabled() {
    return this._disabled;
  }

  @Input()
  set expanded(val: boolean | '') {
    this._expanded = toBoolean(val);
  }
  get expanded() {
    return this._expanded;
  }

  @Input()
  set hasToggle(val: boolean | '') {
    this._hasToggle = toBoolean(val);
  }
  get hasToggle() {
    return this._hasToggle;
  }

  constructor(
    private _theme: LyTheme2
  ) { }

}
