import { Directive, Input, OnInit } from '@angular/core';
import {
  ThemeVariables,
  StyleRenderer,
  LyHostClass,
  toBoolean } from '@alyle/ui';

const STYLES = (theme: ThemeVariables) => (className: string) => `${className}{display:block;background-color:${theme.divider};height:1px;}`;

@Directive({
  selector: 'ly-divider',
  providers: [
    LyHostClass,
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
      this[0x1] = this._styleRenderer.add(
        `${LyDivider.и}--inset`,
        ({before}) => (className: string) => `${className}{margin-${before}:74px;}`,
        this[0x1]
      );
    } else {
      this._hostClass.remove(this[0x1]);
    }
  }
  get inset() {
    return this._inset;
  }
  [0x1]: string;

  constructor(
    private _styleRenderer: StyleRenderer,
    private _hostClass: LyHostClass
  ) { }

  ngOnInit() {
    this._styleRenderer.add(STYLES);
  }
}
