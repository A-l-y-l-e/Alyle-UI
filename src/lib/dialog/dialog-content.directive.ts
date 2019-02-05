import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const STYLE_PRIORITY = -2;
export const STYLES_DIALOG_CONTENT = (theme: ThemeVariables) => ({
  display: 'block',
  margin: '0 0 20px',
  fontSize: `20px`,
  lineHeight: '32px',
  fontWeight: 500,
  fontFamily: theme.typography.fontFamily
});

@Directive({
  selector: '[ly-dialog-content], [lyDialogContent]',
  exportAs: 'lyDialogContent'
})
export class LyDialogContent implements OnInit {
  constructor(
    private _renderer: Renderer2,
    private _el: ElementRef<HTMLElement>,
    private _theme: LyTheme2) { }

  ngOnInit() {
    this._renderer.addClass(
      this._el.nativeElement, this._theme.style(STYLES_DIALOG_CONTENT, STYLE_PRIORITY));
  }
}
