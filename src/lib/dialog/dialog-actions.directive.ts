import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { LyTheme2, lyl } from '@alyle/ui';

/** @docs-private */
const STYLE_PRIORITY = -2;

/** @docs-private */
const STYLES_DIALOG_ACTIONS = () => lyl `{
  display: flex
  flex: 0 0 auto
  padding: 8px
  flex-wrap: wrap
  min-height: 52px
  align-items: center
}`;

@Directive({
  selector: 'ly-dialog-actions, [ly-dialog-actions], [lyDialogActions]',
  exportAs: 'lyDialogActions',
  standalone: false
})
export class LyDialogActions implements OnInit {
  constructor(
    private _renderer: Renderer2,
    private _el: ElementRef<HTMLElement>,
    private _theme: LyTheme2) { }

  ngOnInit() {
    this._renderer.addClass(
      this._el.nativeElement, this._theme.renderStyle(STYLES_DIALOG_ACTIONS, STYLE_PRIORITY));
  }
}
