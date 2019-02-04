import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const STYLE_PRIORITY = -1;
export const STYLES_DIALOG_TITLE = (theme: ThemeVariables) => ({
  display: 'block',
  margin: '0 0 20px',
  fontSize: `20px`,
  lineHeight: '32px',
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
