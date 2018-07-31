import { Directive, Renderer2, ElementRef, Input, OnInit } from '@angular/core';
import { LyTheme2, shadowBuilder, defaultEntry } from '@alyle/ui';

const DEFAULT_ELEVATION = 2;

@Directive({
  selector: 'ly-card'
})
export class LyCard implements OnInit {
  private _elevation: string | number;
  private _elevationClass: string;
  @Input()
  set elevation(val: string | number) {
    if (this.elevation !== val) {
      const newClass = this._createElevationClass(val);
      this._elevationClass = this.styler.updateClass(this.elementRef.nativeElement, this.renderer, newClass, this._elevationClass);
    }
  }
  get elevation() {
    return this._elevation;
  }

  constructor(
    private styler: LyTheme2,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    if (this.elevation === void 0) {
      this.elevation = DEFAULT_ELEVATION;
    }
  }

  private _createElevationClass(val: string | number) {
    this._elevation = defaultEntry(val, DEFAULT_ELEVATION);
    console.log(this._elevation);
    return this.styler.setUpStyleSecondary<any>(
      `k-card-e:${this.elevation}`,
      theme => (
        `background-color:${theme.background.primary};` +
        `display:block;` +
        `position:relative;` +
        `padding:24px;` +
        `border-radius:2px;` +
        `${shadowBuilder(this.elevation)}`
      )
    );
  }
}
