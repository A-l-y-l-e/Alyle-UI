import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLE_PRIORITY = -2;
export const STYLES_DIALOG_ACTIONS = ({
  display: 'flex',
  flex: '0 0 auto',
  padding: '8px',
  flexWrap: 'wrap',
  minHeight: '52px',
  alignItems: 'center'
});

@Directive({
  selector: 'ly-dialog-actions, [ly-dialog-actions], [lyDialogActions]',
  exportAs: 'lyDialogActions'
})
export class LyDialogActions implements OnInit {
  constructor(
    private _renderer: Renderer2,
    private _el: ElementRef<HTMLElement>,
    private _theme: LyTheme2) { }

  ngOnInit() {
    this._renderer.addClass(
      this._el.nativeElement, this._theme.style(STYLES_DIALOG_ACTIONS, STYLE_PRIORITY));
  }
}
