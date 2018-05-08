import { Directive, Input, Renderer2, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { LyIconService, LyIconStyle } from './icon.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Directive({
  selector: 'ly-icon'
})
export class Icon implements OnChanges {
  private currentSvg: SVGElement;
  private defaultClass: string;
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

  ngOnChanges(changes: SimpleChanges) {
    
  }

  constructor(
    private iconService: LyIconService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private iconStyle: LyIconStyle
  ) {
    renderer.addClass(elementRef.nativeElement, this.iconStyle.classes.root);
    console.log(elementRef);
  }

}
