import { Directive, Input, Renderer2, ElementRef, OnInit } from '@angular/core';
import { LyTheme2 } from './theme2.service';

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
    this.theme.setUpTheme(name);
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
    this._setContainerStyle(this.elementRef.nativeElement, this.renderer);
  }

  private _setContainerStyle(element, renderer: Renderer2) {
    const classname = this.theme.setUpStyle(`theme:${this.theme.config.name}`, {
      '': () => (
        `background-color:${this.theme.config.background.default};` +
        `color:${this.theme.config.text.default};` +
        `font-family:${this.theme.config.typography.fontFamily};`
      )
    });
    renderer.addClass(element, classname);
  }

}
