import {
  Directive,
  Input,
  OnInit,
  ElementRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  HostBinding
 } from '@angular/core';
import { LySvgService } from './ly-svg.service';
export * from './ly-svg.service';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: 'ly-svg, [ly-svg]',
  // templateUrl: './ly-svg.component.html',
  // styleUrls: ['./ly-svg.component.scss']
})
export class LySvgComponent implements OnInit, OnChanges, OnDestroy {
  private _size: string;
  private _src: string;

  @Input('src')
  set src(value: string) {
    if (!this._strEndsWith(value, '.svg')) {
      this._src = `${value}.svg`;
    } else {
      this._src = value;
    }
  }
  get src(): string {
    return this._src;
  };

  @HostBinding('style.width') styleWidth: string = 'inherit';
  @HostBinding('style.height') styleHeight: string = 'inherit';
  @Input('size')
  get size(): string {
    return this._size;
  };
  set size(value) {
    if (value !== this._size) {
      this._size = `${value}`;
      this.updateSize();
    }
  }
  @Input('size.px')
  set sizePx(value) {
    if (value !== this._size) {
      this._size = `${value}px`;
      this.updateSize();
    }
  }
  updateSize() {
    this.styleWidth = this.size;
    this.styleHeight = this.size;
  }
  private _strEndsWith(str: any, suffix: string) {
    return str.match(suffix+"$") == suffix;
  }

  @Input('prepend') prepend: boolean = true;

  private _subscription: Subscription;

  constructor(
    private svgService: LySvgService,
    private _elementRef: ElementRef
  ) { }

  ngOnInit() {
    // const svg = this.svgService.getSVG(this.src);
    // this._insertSVG();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src']) {
      this._insertSVG();
    }
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
  private _insertSVG() {
    // console.log('suss src');
    this._subscription = this.svgService.getSVG(this.src)
        .subscribe(
          (svg: SVGElement) => {
            // console.log('suss src Insert SVG');
            // Insert SVG
            if (svg && this._elementRef.nativeElement) {
              this._elementRef.nativeElement.innerHTML = '';
              this._insertElementSVG(svg);
            }
          },
          (err: any) => {
            // console.warn('err');
          }
        );
    }

    private _insertElementSVG(el: Element) {

    if (this.prepend) {
      this._elementRef.nativeElement.insertBefore(el, this._elementRef.nativeElement.firstChild);
    } else {
      this._elementRef.nativeElement.appendChild(el);
    }
  }


}
