import { Directive, Input, Renderer2, ElementRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { LyIconService, LyIconStyle } from './icon.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Directive({
  selector: 'ly-icon'
})
export class Icon implements OnChanges, OnInit {
  private _defaultClass = 'material-icons';
  @Input()
  set src(val: string) {
    if (val) {
      const key = `_url:${val}`;
      val = `${val}.svg`;
      this.iconService.setSvg(key, val);
      this._appendChild(this.iconService.getSvg(key));
    }
  }

  @Input() set icon(val: string) {
    this.iconService.getSvg(val);
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
