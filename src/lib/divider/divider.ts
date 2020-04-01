import { Directive, Input, OnInit } from '@angular/core';
import { ThemeVariables, lyl, StyleRenderer, toBoolean } from '@alyle/ui';

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
  set inset(val: boolean) {
    const newVal = this._inset = toBoolean(val);
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
