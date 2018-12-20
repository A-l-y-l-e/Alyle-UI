import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const style = (theme: ThemeVariables) => ({
  display: 'block',
  backgroundColor: theme.divider,
  height: '1px'
});

@Directive({
  selector: 'ly-divider'
})
export class LyDivider implements OnInit {
  private _inset: boolean;
  private _insetClass: string;

  /** Add indentation (72px) */
  @Input()
  set inset(val: boolean) {
    this._inset = val;
    this._theme.addStyle(
      `lyDivider.inset`,
      () => ({
        marginBefore: '74px'
      }),
      this._el.nativeElement,
      this._insetClass
    );
  }
  get inset() {
    return this._inset;
  }

  constructor(
    private _el: ElementRef,
    private _theme: LyTheme2
  ) { }

  ngOnInit() {
    const className = this._theme.addSimpleStyle('lyDivider', style);
    this._el.nativeElement.classList.add(className);
  }
}
