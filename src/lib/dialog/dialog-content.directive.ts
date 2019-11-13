import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { LyTheme2, lyl } from '@alyle/ui';

/** @docs-private */
const STYLE_PRIORITY = -2;

/** @docs-private */
const STYLES_DIALOG_CONTENT = () => lyl `{
  display: block
  overflow-y: auto
  flex: 1 1 auto
  padding: 0 24px 24px
  -webkit-overflow-scrolling: touch
}`;

@Directive({
  selector: 'ly-dialog-content, [ly-dialog-content], [lyDialogContent]',
  exportAs: 'lyDialogContent'
})
export class LyDialogContent implements OnInit {
  constructor(
    private _renderer: Renderer2,
    private _el: ElementRef<HTMLElement>,
    private _theme: LyTheme2) { }

  ngOnInit() {
    this._renderer.addClass(
      this._el.nativeElement, this._theme.renderStyle(STYLES_DIALOG_CONTENT, STYLE_PRIORITY));
  }
}
