import {
  Directive,
  Input,
  OnInit,
  ElementRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  HostBinding,
  Inject,
  isDevMode
} from '@angular/core';
import { Platform } from '@alyle/ui';
import { LySvgService } from './ly-svg.service';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: 'ly-svg, [ly-svg], [lySvg]'
})
export class LySvgComponent implements OnChanges {
  private _size = '48px';
  private _src: string;

  @Input('src')
  set src(value: string) {
    if (!value.endsWith('.svg')) {
      this._src = `${value}.svg`;
    } else {
      this._src = value;
    }
  }
  get src(): string {
    return this._src;
  }

  @HostBinding('style.width') styleWidth = '24px';
  @HostBinding('style.height') styleHeight = '24px';
  @Input() prepend = true;
  @Input('size')
  get size(): string {
    return this._size;
  }
  set size(val) {
    if (typeof val === 'number') {
      this._size = `${val}px`;
    } else {
      this._size = val;
    }
    this.updateSize();
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

  constructor(
    private svgService: LySvgService,
    private _elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (isDevMode) {
      console.warn('DEPRECATED ly-svg', _elementRef.nativeElement);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (Platform.isBrowser) {
      if (changes['src']) {
        this._insertSVG();
      }
    }
  }

  private _insertSVG() {
    this.svgService.getSVG(this.src)
        .then(
          (svg: SVGElement) => {
            // console.log('suss src Insert SVG');
            // Insert SVG
            if (svg && this._elementRef.nativeElement) {
              this._elementRef.nativeElement.innerHTML = '';
              this._insertElementSVG(svg);
            }
          }
        ).catch((err: any) => {
          console.warn('err', err);
        });
  }

  private _insertElementSVG(el: SVGElement) {
    if (this.prepend) {
      this._elementRef.nativeElement.insertBefore(el, this._elementRef.nativeElement.firstChild);
    } else {
      this._elementRef.nativeElement.appendChild(el);
    }
  }

}
