import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

/** @docs-private */
const STYLE_PRIORITY = -2;

/** @docs-private */
const STYLES_DIALOG_TITLE = (theme: ThemeVariables) => ({
  display: 'block',
  flex: '0 0 auto',
  margin: '20px 0 16px',
  padding: '0 24px',
  fontSize: `20px`,
  lineHeight: '24px',
  fontWeight: 500,
  fontFamily: theme.typography.fontFamily
});

@Directive({
  selector: '[ly-dialog-title], [lyDialogTitle]',
  exportAs: 'lyDialogTitle'
})
export class LyDialogTitle implements OnInit {
  constructor(
    private _renderer: Renderer2,
    private _el: ElementRef<HTMLElement>,
    private _theme: LyTheme2) { }

  ngOnInit() {
    this._renderer.addClass(
      this._el.nativeElement, this._theme.style(STYLES_DIALOG_TITLE, STYLE_PRIORITY));
  }
}
