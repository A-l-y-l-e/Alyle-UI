import { Directive, Input, OnInit } from '@angular/core';
import { ThemeVariables, lyl, StyleRenderer } from '@alyle/ui';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

const STYLES = (theme: ThemeVariables) => lyl `{
  display: block
  background-color: ${theme.divider}
  height: 1px
}`;

@Directive({
  selector: 'ly-divider',
  providers: [
    StyleRenderer
  ]
})
export class LyDivider implements OnInit {
  static readonly и = 'LyDivider';
  private _inset: boolean;

  /** Add indentation (72px) */
  @Input()
  set inset(val: BooleanInput) {
    const newVal = this._inset = coerceBooleanProperty(val);
    if (newVal) {
      this[0x1] = this.sRenderer.add(
        `${LyDivider.и}--inset`,
        ({before}) => lyl `{
          margin-${before}: 74px
        }`,
        this[0x1]
      );
    } else {
      this.sRenderer.removeClass(this[0x1]);
    }
  }
  get inset() {
    return this._inset;
  }
  [0x1]: string;

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

  ngOnInit() {
    this.sRenderer.add(STYLES);
  }
}
