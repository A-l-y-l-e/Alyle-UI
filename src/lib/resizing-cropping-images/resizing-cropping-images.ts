import { Subscription } from 'rxjs/Subscription';
import {
  Component,
  ElementRef,
  forwardRef,
  NgModule,
  Input,
  Output,
  Directive,
  SimpleChange,
  OnChanges,
  ModuleWithProviders,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  AfterContentInit
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { exactPosition } from 'alyle-ui/core';
export interface LyResizingCroppingImagesConfig {
  width: number;
  height: number;
  type?: string;
}
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  selector: 'ly-cropping',
  styleUrls: ['./resizing-cropping-images.scss'],
  templateUrl: './resizing-cropping-images.html',
 })
export class LyResizingCroppingImages implements AfterContentInit {
  img: BehaviorSubject<HTMLImageElement> = new BehaviorSubject<HTMLImageElement>(null);
  result: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  fileName: string;
  private newImg: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isNewImg: Observable<boolean> = this.newImg.asObservable();
  private _img: HTMLImageElement;
  private offset: {x: number, y: number, left: number, top: number};
  private eventDirection: string;
  private scale: number;
  private _src: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  @ViewChild('_imgContainer') imgContainer: ElementRef;
  @ViewChild('_croppingContainer') croppingContainer: ElementRef;
  @Input() src: string;
  @Input() format: string;
  @Input() config: LyResizingCroppingImagesConfig = {
    width: 250,
    height: 200
  };
  private defaultType: string;
  private _dragData: Subject<{width: string, height: string, transform: string}> = new Subject();
  dragData: Observable<{width: string, height: string, transform: string}>;
  private zoomScale = .1;
  constructor(private elementRef: ElementRef, private cd: ChangeDetectorRef) {
    this.dragData = this._dragData.asObservable();
    const img = this.img;
    img.subscribe((imgElement: HTMLImageElement) => {
      if (imgElement) {
        this._img = imgElement;
        /** set zoom scale */
        const minScale = {
          width: this.config.width / this._img.width * 100,
          height: this.config.height / this._img.height * 100
        };
        this.zoomScale = Math.max(minScale.width, minScale.height) / 100;
        this.fit();
        this.cd.markForCheck();
      }
    });
  }
  selectInputEvent(img: Event) {
    const _img = img.target as HTMLInputElement;
    if (_img.files.length !== 1) {
      return;
    }
    const fileReader: FileReader = new FileReader();
    this.fileName = _img.value.replace(/.*(\/|\\)/, '');
    if (!this.config.type) {
      this.defaultType = _img.files[0].type;
    }
    fileReader.addEventListener('loadend', (loadEvent) => {
      this.src = (loadEvent.target as FileReader).result;
      this.setImageUrl(this.src);
      this.cd.markForCheck();
    });
    // fileReader.onload = (event: ProgressEvent) => {
    //   // this.src = (event.target as FileReader).result;
    //   // this.setImageUrl(this.src);
    //   // this.cd.markForCheck();
    // };
    fileReader.readAsDataURL(_img.files[0]);
  }
  setScale(size: number) {
    if (!(size > 0 && size <= 1)) { return; }
    this.scale = size;
    size = size * 100;
    const img = this.imgContainer.nativeElement.firstElementChild;
    const initialImg = this._img;
    const width = initialImg.width * size / 100;
    const height = initialImg.height * size / 100;
    this._dragData.next({
      width: `${width}px`,
      height: `${height}px`,
      transform: this.customCenter(width, height)
    });
  }
  private customCenter(width: number, height: number) {
    const root = this.elementRef.nativeElement as HTMLElement;
    const w = (root.offsetWidth - width) / 2;
    const h = (root.offsetHeight - height) / 2;
    return `translate3d(${w}px, ${h}px, 0)`;
  }

  /**
   * Ajustar a la pantalla
   */
  fitToScreen() {
    const container = this.elementRef.nativeElement as HTMLElement;
    const min = {
      width: container.offsetWidth,
      height: container.offsetHeight
    };
    const size = {
      width: this._img.width,
      height: this._img.height
    };
    const minScale = {
      width: min.width / size.width * 100,
      height: min.height / size.height * 100
    };
    const result = Math.max(minScale.width, minScale.height) / 100;
    if (result >= 1) {
      this.setScale(1);
    } else {
      this.setScale(result);
    }
  }

  fit() {
    const minScale = {
      width: this.config.width / this._img.width * 100,
      height: this.config.height / this._img.height * 100
    };
    this.setScale(Math.max(minScale.width, minScale.height) / 100);
  }

  _moveStart(event) {
    this.eventDirection = null;
    const rect = this.imgContainer.nativeElement.getBoundingClientRect();
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
    let target;
    if (event.type === 'touchstart') {
      target = {
        x: event.targetTouches[0].clientX,
        y: event.targetTouches[0].clientY
      };
    } else {
      target = {
        x: event.clientX,
        y: event.clientY
      };
    }
    this.offset = {
      x: target.x - rect.x,
      y: target.y - rect.y,
      left: (rect as ClientRect).left - hostRect.x,
      top: (rect as ClientRect).top - hostRect.y
    };
  }
  _move(event) {
    if (event.additionalEvent) {
      this.eventDirection = event.additionalEvent;
    }
    let x, y;
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
    const rect = this.imgContainer.nativeElement.getBoundingClientRect();
    if (event.srcEvent.shiftKey) {
      // if (this.eventDirection === 'panleft' || this.eventDirection === 'panright') {
      if (Math.abs(event.deltaX) === Math.max(Math.abs(event.deltaX), Math.abs(event.deltaY))) {
        y = this.offset.top;
      } else {
        x = this.offset.left;
      }
    }
    if (x === undefined) { x = event.center.x - hostRect.x - (this.offset.x); }
    if (y === undefined) { y = event.center.y - hostRect.y - (this.offset.y); }

    this._dragData.next({
      width: this.imgContainer.nativeElement.offsetWidth,
      height: this.imgContainer.nativeElement.offsetHeight,
      transform: `translate3d(${x}px, ${y}px, 0)`
    });
  }
  private roundNumber(num: number) {
    return Math.round(num * 100000) / 100000;
  }
  /**+ */
  zoomIn() {
    const scale = this.roundNumber(this.scale + this.zoomScale);
    if (scale > 0 && scale <= 1) {
      this.setScale(scale);
    } else {
      this.setScale(1);
    }
  }
  /**- */
  zoomOut() {
    const scale = this.roundNumber(this.scale - this.zoomScale);
    if (scale > this.zoomScale && scale <= 1) {
      this.setScale(scale);
    } else {
      this.fit();
    }
  }
  ngAfterContentInit() {
    this.setImageUrl(this.src);
  }
  center(img?: HTMLImageElement) {
    if (!img) {
      img = this.imgContainer.nativeElement.firstElementChild;
    }
    const root = this.elementRef.nativeElement as HTMLElement;
    const w = (root.offsetWidth - img.width) / 2;
    const h = (root.offsetHeight - img.height) / 2;
    const result = {
      width: `${img.width}px`,
      height: `${img.height}px`,
      transform: this.customCenter(img.width, img.height)
    };
    this._dragData.next(result);
  }
  setImageUrl(src: string) {
    if (!src) { return; }
    const img = new Image;
    img.src = src;
    img.addEventListener('load', () => {
      this.img.next(img);
      this.newImg.next(true);
      this.cd.markForCheck();
    });
  }
  private max(...values: number[]) {
    return Math.max(...values);
  }

  private imageSmoothingQuality(img: HTMLCanvasElement, config, quality: number): HTMLCanvasElement {
    let steps: any = Math.ceil(Math.log(this.max(img.width, img.height) / this.max(config.height, config.width)) / Math.log(2));
    steps = Array.from(Array(steps <= 0 ? 0 : steps - 1).keys());
    const octx = img.getContext('2d');
    const w = img.width * quality,
        h = img.height * quality;
    const q = Math.pow(quality, (steps as Array<number>).length);
    /**Steps */
    (steps as Array<number>).forEach((a, b) => {
      octx.drawImage(img,
        0, 0,
        img.width * quality, img.height * quality
      );
    });

    const oc = document.createElement('canvas'),
    ctx = oc.getContext('2d');

    oc.width = config.width;
    oc.height = config.height;
    ctx.drawImage(img,
      0, 0,
      img.width * (q), img.height * (q),
      0, 0,
      config.width, config.height
    );
    return oc;
  }

  /**
   * Cropp Image
   */
  cropp(): string {
    const canvasElement: HTMLCanvasElement = document.createElement('canvas');
    const rect = this.croppingContainer.nativeElement.getBoundingClientRect() as ClientRect;
    const img = this.imgContainer.nativeElement.firstElementChild.getBoundingClientRect() as ClientRect;
    const left = (rect.left - img.left);
    const top = (rect.top - img.top);
    const config = {
      width: this.config.width,
      height: this.config.height
    };
    const configCanvas = {
      width: this._img.width,
      height: this._img.height
    };
    canvasElement.width = config.width / this.scale;
    canvasElement.height = config.height / this.scale;
    canvasElement.getContext('2d').drawImage(this._img,
      -(left / this.scale), -(top / this.scale),
      configCanvas.width, configCanvas.height,
      // 0, 0,
      // this._img.width * this.scale, this._img.height * this.scale,
    );
    let result = canvasElement;
    result = this.imageSmoothingQuality(result, config, 0.5);
    let url;
    if (this.config.type) {
      url = result.toDataURL(`image/${this.config.type}`);
    } else {
      url = result.toDataURL(this.defaultType);
    }
    this.result.next(url);
    return url;
  }
}
