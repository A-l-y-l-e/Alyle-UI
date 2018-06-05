import { Directive, Input, Renderer2, ElementRef, OnInit } from '@angular/core';
import { LyTheme2 } from './theme2.service';
import { CoreTheme } from './core-theme.service';
import { ThemeConfig } from './theme-config';
import { DataStyle } from '../theme.service';

@Directive({
  selector: '[lyTheme]',
  providers: [LyTheme2],
  exportAs: 'lyTheme'
})
export class LyThemeContainer implements OnInit {
  private _lyTheme: string;
  /**
   * set theme
   */
  @Input()
  set lyTheme(nam: string) {
    this._lyTheme = nam;
    this.theme.config = this.theme.core.get(nam);
  }
  get lyTheme() {
    return this._lyTheme;
  }

  @Input() shared: true;

  constructor(
    public theme: LyTheme2,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.theme._styleMap = new Map<string, DataStyle>();
    this._setContainerStyle(this.elementRef.nativeElement, this.renderer);
  }

  private _setContainerStyle(element, renderer: Renderer2) {
    const classname = this.theme.setUpStyle(`theme:${this.theme.config}`, {
      '': () => (
        `background-color:${this.theme.config.background.primary};` +
        `color:${this.theme.config.text.default};` +
        `font-family:${this.theme.config.typography.fontFamily};`
      )
    });
    renderer.addClass(element, classname);
  }

}
