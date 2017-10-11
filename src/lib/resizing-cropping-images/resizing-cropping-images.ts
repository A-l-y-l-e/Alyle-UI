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
  ChangeDetectorRef
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ly-cropping',
  styleUrls: ['resizing-cropping-images.scss'],
  template: `
  <ng-content></ng-content>
  <div class="content-img"
  (mouseleave)="stateType='none'; crop();"
  (mouseup)="stateType='none'; crop();"
  (mouseenter)="stateType='none'; crop();"
  (mousemove)="moveImg($event);"
  (dblclick)="center();"
  >
    <div class="_img"
    [class.NoNe]="imgDataUrl==undefined || imgDataUrl==null"
    [style.top.px]="_top"
    [style.left.px]="_left"
    [bg]="'primary'"
    [color]="'primary'"
    (mousedown)="stateType='move'; startMove($event)"
    (mouseup)="stateType='none'"
    >
      <img
      [src]="imgDataUrl"
      >
      <span
      class="r_nw"
      (mousedown)="stateType='resize'; stateR='nw'"
      (mouseup)="stateType='none'"
      ></span>
      <span
      class="r_ne"
      (mousedown)="stateType='resize'; stateR='ne'"
      (mouseup)="stateType='none'"
      ></span>
      <span
      class="r_se"
      (mousedown)="stateType='resize'; stateR='se'"
      (mouseup)="stateType='none'"
      ></span>
      <span
      class="r_sw"
      (mousedown)="stateType='resize'; stateR='sw'"
      (mouseup)="stateType='none'"
      ></span>
    </div>
    <div class="resize"
    [style.width.px]="sizeW"
    [style.height.px]="sizeH"
    >
    </div>
  </div>
  `,
})
export class ResizingCroppingImagesComponent implements OnChanges, ControlValueAccessor {
  public _format = 'jpeg';
  public img: string = null;
  public imgDataUrl: string;
  public origImg: string;
  public sizeW = 230;
  public sizeH = 150;
  public sizeWmax = 720;
  public sizeHmax = 720;
  public stateMouse = false;
  public stateType = 'none';
  public stateR = 'none';
  public centerX = 0;
  public centerY = 0;
  public imgWidth: number;
  public imgHeight: number;
  public imgCrop: any;
  public percent = 100;
  public imgUrl: string = null;

  public _top = 0;
  public _left = 0;
  public _img: any = {};
  public _src: string = null;
  constructor(
    private elementRef: ElementRef,
    private cd: ChangeDetectorRef
  ) {
  }

  @Input('format')
  public set format(value: string) {
    this._format = value;
  }
  public get format(): string {
    return this._format;
  }
  public ngOnChanges(changes: {[key: string]: SimpleChange}) {

  }
  public zoom(state: string) {
    const W = this.elementRef.nativeElement.querySelector('._img').offsetWidth;
    const H = this.elementRef.nativeElement.querySelector('._img').offsetHeight;
    const oTop = this.elementRef.nativeElement.querySelector('._img').offsetTop;
    const oLeft = this.elementRef.nativeElement.querySelector('._img').offsetLeft;
    this.stateType = 'resize';
    this.stateR = state;
    this.resize(0, W, H, oTop, oLeft);
  }
  public startMove($e: any) {
    const oTop = this.elementRef.nativeElement.querySelector('._img').offsetTop;
    const oLeft = this.elementRef.nativeElement.querySelector('._img').offsetLeft;
    this.centerX = $e.clientX -
    offset(this.elementRef.nativeElement.querySelector('.content-img')).left - oLeft;
    this.centerY = $e.clientY -
    offset(this.elementRef.nativeElement.querySelector('.content-img')).top - oTop;
  }
  public moveImg($e: any) {
    $e.preventDefault();
    const W = this.elementRef.nativeElement.querySelector('._img').offsetWidth;
    const H = this.elementRef.nativeElement.querySelector('._img').offsetHeight;
    const oTop = this.elementRef.nativeElement.querySelector('._img').offsetTop;
    const oLeft = this.elementRef.nativeElement.querySelector('._img').offsetLeft;
    if (this.stateType === 'move') {

      this._left = $e.clientX -
      offset(this.elementRef.nativeElement.querySelector('.content-img')).left - (this.centerX);
      this._top = -offset(this.elementRef.nativeElement.querySelector('.content-img')).top +
      $e.clientY - (this.centerY);
    } else if (this.stateType === 'resize') {
      this.resize($e, W, H, oTop, oLeft);
    }

  }
  public resize(ev$: any, W: any, H: any, oTop: any, oLeft: any) {
    let _W: any, _H: any;
    const contentImg = this.elementRef.nativeElement.querySelector('.content-img');
    if (this.stateR === 'nw') {
      this._left = -offset(contentImg).left + (ev$.clientX || ev$.pageY);
      this._top = -offset(contentImg).top +
      (ev$.clientY || ev$.pageX);
      _W = Math.round(this.elementRef.nativeElement.querySelector('._img').offsetWidth -
      (this._left - oLeft));
      _H = Math.round(this.elementRef.nativeElement.querySelector('._img').offsetHeight -
      (this._top - oTop));

      if (ev$.shiftKey) {
        this._top = (-offset(contentImg).top + (ev$.clientY ||
          ev$.pageX)) - ((_W / this.imgWidth * this.imgHeight) - _H);
      }
    } else if (this.stateR === 'ne') {
      this._left = oLeft;
      this._top = -offset(contentImg).top +
      (ev$.clientY || ev$.pageY);
      _W = Math.round((-offset(contentImg).left +
      (ev$.clientX || ev$.pageX)) - oLeft);
      _H = Math.round(this.elementRef.nativeElement.querySelector('._img').offsetHeight -
      (this._top - oTop));
      if (ev$.shiftKey) {
        this._top = (-offset(contentImg).top +
        (ev$.clientY || ev$.pageY)) - ((_W / this.imgWidth * this.imgHeight) - _H);
      }
    } else if (this.stateR === 'se') {
      this._left = oLeft;
      this._top = oTop;
      _W = (-offset(contentImg).left +
      (ev$.clientX || ev$.pageX)) - oLeft;
      _H = (-offset(contentImg).top +
      (ev$.clientY || ev$.pageY)) - oTop;
    } else if (this.stateR === 'sw') {
      // console.log('event ne', ev$);
      this._left = -offset(contentImg).left + (ev$.clientX || ev$.pageX);
      this._top = oTop;
      _W = Math.round(this.elementRef.nativeElement.querySelector('._img').offsetWidth -
      (this._left - oLeft));
      _H = Math.round((-offset(contentImg).top +
      (ev$.clientY || ev$.pageY)) - oTop);
    } else if (this.stateR === '-') {
      _W = W / 2;
      _H = H / 2;
      this.stateType = 'none';
      this._left = (contentImg.offsetWidth / 2) - _W / 2;
      this._top = (contentImg.offsetHeight / 2) - _H / 2;
      this.crop();
    } else if (this.stateR === '+') {
      _W = W * 2;
      _H = H * 2;
      this._left = (contentImg.offsetWidth / 2) - _W / 2;
      this._top = (contentImg.offsetHeight / 2) - _H / 2;
      this.stateType = 'none';
      this.crop();
    }
    if (ev$.shiftKey) {
      _H = _W / this.imgWidth * this.imgHeight;
    }
    const fileReader: any = new FileReader();
    let img: any;
    const origSrc: any = new Image();
    const minWidth: any = 80; // Change as required
    const minHeight: any = 80;
    const maxWidth: any = 2400; // Change as required
    const maxHeight: any = 2200;
    const cropCanvas: any = document.createElement('canvas');
    origSrc.src = this.origImg;
    cropCanvas.width = _W;
    cropCanvas.height = _H;
    const ctx = cropCanvas.getContext('2d');
    ctx.drawImage(origSrc,
      0, 0,   // Start at 10 pixels from the left and the top of the image (crop),
      _W, _H,   // "Get" a `80 * 30` (w * h) area from the source image (crop),
      // 0, 0,     // Place the result at 0, 0 in the canvas,
      // 100, 100, //...
    );
    this.imgDataUrl = cropCanvas.toDataURL(`image/${this._format}`);
    // console.log(cropCanvas.toDataURL("image/jpeg"));
    // console.log(origSrc.width,origSrc.height);
  }
  get imgResult(): string {
    return this.imgCrop;
  }
  public writeValue(value: any) {
    // nothing
  }
  private _onTouchedCallback: () => void;

  /** Callback registered via registerOnChange (ControlValueAccessor) */
  private _onChangeCallback: (_: any) => void;

  public registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }
  public registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  /**
   * Load new image
   */
  public imgChange($event: any) {
    // this._log.setLog('imgChange', $event);
    // important add converter img to size of output
    // important add converter img to size of output
    this._img = $event.target.files[0];
    this.img = $event.target.value.replace(/.*(\/|\\)/, '');
    const fileReader = new FileReader();
    let img: any;
    const origSrc = new Image();
    const minWidth = 80; // Change as required!!
    const minHeight = 80;
    const maxWidth = 2400; // Change as required
    const maxHeight = 2200;
    const cropCanvas = document.createElement('canvas');
    const blank = `data:image/png;base64,iVBORw0KGg${
      'oAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAU'
    }AAarVyFEAAAAASUVORK5CYII=`;
    fileReader.onload = (ev: any) => {

      // this._log.setLog('ev', ev);
      // this._log.setLog('$event.target.files', $event.target.files);
      // this._log.setLog('$event.target.files', $event.target.files);
      // this._log.setLog('$event.target.files[0].type', $event.target.files[0].type);
      if ($event.target.files[0].type === 'image/jpeg' ||
      $event.target.files[0].type === 'image/jpg' ||
      $event.target.files[0].type === 'image/png' ||
      $event.target.files[0].type === 'image/gif') {
        this.imgDataUrl = ev.target.result;
        this.origImg = ev.target.result;
        origSrc.src = ev.target.result;
        img = ev.target.result;
      } else {
        this.imgDataUrl = blank;
        this.origImg = blank;
        origSrc.src = blank;
      }
      this.imgWidth = origSrc.width;
      this.imgHeight = origSrc.height;
      this._left = (this.elementRef.nativeElement.querySelector('.content-img').offsetWidth / 2) -
      this.imgWidth / 2;
      this._top = (this.elementRef.nativeElement.querySelector('.content-img').offsetHeight / 2) -
      this.imgHeight / 2;
      const _img =  this.elementRef.nativeElement.querySelector('.content-img img');
      this.crop();

      _img.addEventListener('load', () => {
        this.center();
        _img.removeAllListeners();
        this.cd.markForCheck();
      });
      // ctx.drawImage(origSrc, 0, 0);
      // console.warn(origSrc.width);
    };
    fileReader.readAsDataURL($event.target.files[0]);
    // console.log($event.target.files[0]);
  }
  public center() {

    this.imgWidth = this.elementRef.nativeElement.querySelector('._img').offsetWidth;
    this.imgHeight = this.elementRef.nativeElement.querySelector('._img').offsetHeight;
    this._left = (this.elementRef.nativeElement.querySelector('.content-img').offsetWidth / 2) -
    this.imgWidth / 2;
    this._top = (this.elementRef.nativeElement.querySelector('.content-img').offsetHeight / 2) -
    this.imgHeight / 2;
    this.crop();
  }
  crop() {
    let cropCanvas: any,
    resize = this.elementRef.nativeElement.querySelector('.resize'),
    left = offset(resize).left - offset(this.elementRef.nativeElement.querySelector('._img')).left,
    top =  offset(resize).top - offset(this.elementRef.nativeElement.querySelector('._img')).top,
    width = resize.offsetWidth,
    height = resize.offsetHeight;
    const origSrc = new Image();
    origSrc.src = this.imgDataUrl;
    cropCanvas = document.createElement('canvas');
    cropCanvas.width = width;
    cropCanvas.height = height;
    cropCanvas.getContext('2d').drawImage(origSrc, left, top, width, height, 0, 0, width, height);
    this.imgCrop = cropCanvas.toDataURL(`image/${this._format}`);
    this.cd.markForCheck();
    /**
     * TODO: add eventListener
     * 1. add element o replace
     * 2. add eventListener
     * 3. update changes
     * 4. ...
     */
  }
}




function _GEToffset(e: any, contenedor: any) {
  // Hallamos la posición relativa |posición elemento - posición real|
  let x: any = contenedor.offsetLeft - e.pageX;
  let y: any = contenedor.offsetTop - e.pageY;
  // console.log('contenedor.offsetLeft',contenedor.offsetLeft);
  // Hacemos el valor absoluto
  x = Math.abs(x);
  y = Math.abs(y);
  // console.log("Eje X: " + x + " " + "Eje Y: " + y);
  return {top: y, left: x};
}

function getOffset(element: any) {
  if (typeof element === 'string') {
    element = document.getElementById(element);
  }

  if (!element) {return { top: 0, left: 0 }; };

  let y: any = 0;
  let x: any = 0;
  while (element.offsetParent) {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  }

  return {top: y, left: x};
}
function getOffsetx( el: any ) {
    let _x: any = 0;
    let _y: any = 0;
    _x += (el.offsetLeft - el.scrollLeft) - document.querySelector('ly-app').scrollLeft;
    _y += (el.offsetTop - el.scrollTop) - document.querySelector('ly-app').scrollTop;
    return { top: _y, left: _x , xleft: el.offsetLeft, xtop: el.offsetTop};
}



// Find exact position of element
   function isWindow(obj: any) {
       return obj !== null && obj === obj.window;
   }

   function getWindow(elem: any) {
       return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
   }

   function offset(elem: any) {
       let docElem: any, win: any,
           box = {top: 0, left: 0},
           doc = elem && elem.ownerDocument;

       docElem = doc.documentElement;

       if (typeof elem.getBoundingClientRect !== typeof undefined) {
           box = elem.getBoundingClientRect();
       }
       win = getWindow(doc);
       return {
           top: box.top + win.pageYOffset - docElem.clientTop,
           left: box.left + win.pageXOffset - docElem.clientLeft
       };
   }
