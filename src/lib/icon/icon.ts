import { Directive, Input, Renderer2, ElementRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { LyIconService, LyIconStyle } from './icon.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Directive({
  selector: 'ly-icon'
})
export class Icon implements OnChanges, OnInit {
  private _defaultClass = 'material-icons';
  private _src: string;
  private _icon: string;
  @Input()
  set src(val: string) {
    this._src = val;
    if (val) {
      const key = `_url:${val}`;
      this.iconService.setSvg(key, val);
      this._appendChild(this.iconService.getSvg(key));
    }
  }
  get src() {
    return this._src;
  }

  @Input() set icon(val: string) {
    this._icon = val;
    this._appendChild(this.iconService.getSvg(val));
  }
  get icon() {
    return this._icon;
  }

  constructor(
    private iconService: LyIconService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private iconStyle: LyIconStyle
  ) {
    renderer.addClass(elementRef.nativeElement, this.iconStyle.classes.root);
  }

  private _isDefault() {
    return !(this.src || this.icon);
  }

  private _appendChild(svgObservable: Observable<SVGElement>) {
    svgObservable
      .pipe(
        take(1)
      )
      .subscribe((svgElement) => {
        svgElement.classList.add(this.iconStyle.classes.svg);
        this.renderer.appendChild(this.elementRef.nativeElement, svgElement);
      });
  }

  private _updateClass() {
    if (!this._isDefault()) {
      return;
    }

    const el = this.elementRef.nativeElement;

    this.renderer.addClass(el, this._defaultClass);
  }

  ngOnInit() {
    this._updateClass();
  }

  ngOnChanges(changes: SimpleChanges) {
    this._updateClass();
  }
}
