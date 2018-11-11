import {
  Component,
  ElementRef,
  Input,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  EventEmitter,
  Renderer2,
  NgZone,
  HostListener
} from '@angular/core';
import { LyTheme2, mergeDeep, LY_COMMON_STYLES } from '@alyle/ui';
import { take } from 'rxjs/operators';

const STYLE_PRIORITY = -2;

const styles = ({
  root: {
    '-webkit-user-select': 'none',
    '-moz-user-select': 'none',
    '-ms-user-select': 'none',
    userSelect: 'none',
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgContainer: {
    cursor: 'move',
    position: 'absolute',
    top: 0,
    left: 0,
    '& > canvas': {
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    }
  },
  croppingContainer: {
    position: 'absolute',
    pointerEvents: 'none',
    boxShadow: '0 0 0 20000px rgba(0, 0, 0, 0.4)',
    '&:before, &:after': {
      ...LY_COMMON_STYLES.fill,
      content: `''`,
    },
    '&:before': {
      width: 0,
      height: 0,
      margin: 'auto',
      borderRadius: '50%',
      background: '#fff',
      border: 'solid 2px rgb(255, 255, 255)'
    },
    '&:after': {
      border: 'solid 2px rgb(255, 255, 255)'
    }
  },
  croppContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&, & > input': LY_COMMON_STYLES.fill,
    '& *:not(input)': {
      pointerEvents: 'none'
    },
    '& > input': {
      background: 'transparent',
      opacity: 0,
      width: '100%',
      height: '100%'
    }
  }
});
/** Image Cropper Config */
export interface ImgCropperConfig {
  /** Cropper area width*/
  width: number;
  /** Cropper area height*/
  height: number;
  /** If this is not defined, the new image will be automatically defined */
  type?: string;
  /** Background color( default: null), if is null in png is transparent but not in jpg */
  fill?: string | null;
  /** Set anti-aliased( default: true) */
  antiAliased?: boolean;
  autoCrop?: boolean;
  output?: {
    width: number
    height: number
  } | ImgResolution;
}

/** @deprecated */
export type LyResizingCroppingImagesConfig = ImgCropperConfig;

/** Image output */
export enum ImgResolution {
  /** Resizing & cropping */
  Default,
  /** Only cropping */
  OriginalImage
}

export interface ImgCropperEvent {
  /** Cropped image in base64, @deprecated use instead `dataURL` */
  base64: string;
  /** Cropped image in URL base64 */
  dataURL: string;
  name: string;
  /** Filetype */
  type: string;
  width: number;
  height: number;
  /** Original Image in URL base64 */
  originalDataURL: string;
  scale: number;
  position: {
    x: number
    y: number
  };
}

const CONFIG_DEFAULT = <ImgCropperConfig>{
  width: 250,
  height: 200,
  output: ImgResolution.Default,
  antiAliased: true
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  selector: 'ly-img-cropper, ly-cropping',
  templateUrl: 'resizing-cropping-images.html'
 })
export class LyResizingCroppingImages {
  /**
   * styles
   * @ignore
   */
  readonly classes = this.theme.addStyleSheet(styles, STYLE_PRIORITY);
  _originalImgBase64: string;
  private _fileName: string;

  /** Original image */
  private _img: HTMLImageElement;
  private offset: {
    x: number
    y: number
    left: number
    top: number
  };
  private _scale: number;
  private _minScale: number;
  private _config: ImgCropperConfig;
  private _imgRect: {
    x: number
    y: number
    xc: number
    yc: number
    w: number
    h: number
    /** transform with */
    wt: number
    ht: number
  } = {} as any;

  @ViewChild('_imgContainer') _imgContainer: ElementRef;
  @ViewChild('_croppingContainer') _croppingContainer: ElementRef;
  @ViewChild('_imgCanvas') _imgCanvas: ElementRef<HTMLCanvasElement>;
  @Input()
  get config(): ImgCropperConfig {
    return this._config;
  }
  set config(val: ImgCropperConfig) {
    this._config = mergeDeep({}, CONFIG_DEFAULT, val);
  }
  /** Set scale */
  @Input()
  get scale(): number {
    return this._scale;
  }
  set scale(val: number) {
    const newScale = fix(val, 4);
    if (this.isLoaded && newScale !== this._scale) {
      const scale = (this._scale = newScale || 0);
      this.setScale(scale);
    }
  }

  @Output() readonly scaleChange = new EventEmitter<number>();

  /** Get min scale */
  get minScale(): number {
    return this._minScale;
  }

  /** When is loaded image */
  _isLoadedImg: boolean;

  /** When is loaded image & ready for crop */
  isLoaded: boolean;
  isCropped: boolean;

  /** On loaded new image */
  @Output() readonly loaded = new EventEmitter<ImgCropperEvent>();
  /** On crop new image */
  @Output() readonly cropped = new EventEmitter<ImgCropperEvent>();
  /** Emit an error when the loaded image is not valid */
  @Output() readonly error = new EventEmitter<ImgCropperEvent>();

  private _defaultType: string;
  constructor(
    private _renderer: Renderer2,
    private theme: LyTheme2,
    private elementRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {
    this._renderer.addClass(elementRef.nativeElement, this.classes.root);
  }

  private _imgLoaded(imgElement: HTMLImageElement) {
    if (imgElement) {
      this._img = imgElement;
      const canvas = this._imgCanvas.nativeElement;
      canvas.height = imgElement.height;
      canvas.width = imgElement.width;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgElement, 0, 0);
      /** set zoom scale */
      const minScale = {
        width: this.config.width / canvas.width,
        height: this.config.height / canvas.height
      };
      this._minScale = fix(Math.max(minScale.width, minScale.height), 4);
    }
  }

  private _setStylesForContImg(values: {
    width: number
    height: number
    x?: number
    y?: number
  }) {
    const newStyles = {
      width: `${values.width}px`,
      height: `${values.height}px`
    } as any;
    if (values.x !== void 0 && values.y !== void 0) {
      const rootRect = this._rootRect();
      const imgRect = this._imgContainerRect();
      const x = rootRect.width / 2 - (values.x);
      const y = rootRect.height / 2 - (values.y);
      newStyles.transform = `translate3d(${fix(values.x)}px,${fix(values.y)}px, 0)`;

      this._imgRect.x = fix(values.x);
      this._imgRect.y = fix(values.y);
      this._imgRect.xc = fix(x);
      this._imgRect.yc = fix(y);
      this._imgRect.wt = fix(imgRect.width);
      this._imgRect.ht = fix(imgRect.height);
    }
    this._imgRect.w = fix(values.width);
    this._imgRect.h = fix(values.height);
    for (const key in newStyles) {
      if (newStyles.hasOwnProperty(key)) {
        this._renderer.setStyle(this._imgContainer.nativeElement, key, newStyles[key]);
      }
    }
  }

  @HostListener('window:resize') resize$() {
    if (this.isLoaded) {
      this.updatePosition();
    }
  }

  selectInputEvent(img: Event) {
    const _img = img.target as HTMLInputElement;
    if (_img.files.length !== 1) {
      return;
    }
    const fileReader: FileReader = new FileReader();
    this._fileName = _img.value.replace(/.*(\/|\\)/, '');

    /** Set type */
    this._defaultType = null;
    if (!this.config.type) {
      this._defaultType = _img.files[0].type;
    }
    fileReader.addEventListener('loadend', (loadEvent) => {
      const originalImageUrl = (loadEvent.target as FileReader).result as string;
      this.setImageUrl(originalImageUrl);
      this.cd.markForCheck();
    });
    fileReader.readAsDataURL(_img.files[0]);
  }

  /** Set the size of the image, the values can be 0 between 1, where 1 is the original size */
  setScale(size: number, noAutoCrop?: boolean) {
    // fix min scale
    size = size > this.minScale && size <= 1 ? size : this.minScale;
    this._scale = size;
    size = size;
    const initialImg = this._imgCanvas.nativeElement;
    const width = (initialImg.width * size);
    const height = (initialImg.height * size);
    const hostRect = this._rootRect();
    if (!this.isLoaded) {
      this._setStylesForContImg({
        width,
        height,
        ...this._customCenter(width, height)
      });
    } else {
      const originPosition = {...this._imgRect};
      this.offset = {
        x: (hostRect.width / 2) - (originPosition.x),
        y: (hostRect.height / 2) - (originPosition.y),
        left: originPosition.x,
        top: originPosition.y
      };
      this._setStylesForContImg({
        width,
        height,
      });
      this._move({
        srcEvent: {},
        center: {
          x: (hostRect.width / 2 - (this.offset.x * (width / originPosition.w))) + hostRect.x + this.offset.x,
          y: (hostRect.height / 2 - (this.offset.y * (height / originPosition.h))) + hostRect.y + this.offset.y
        }
      });
    }
    this.scaleChange.emit(this._scale);
    if (!noAutoCrop) {
      this._cropIfAutoCrop();
    }
  }

  private _customCenter(width: number, height: number) {
    const root = this.elementRef.nativeElement as HTMLElement;
    const x = (root.offsetWidth - width) / 2;
    const y = (root.offsetHeight - height) / 2;
    return {
      x,
      y
    };
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
    const { width, height } = this._img;
    const minScale = {
      width: min.width / width,
      height: min.height / height
    };
    const result = Math.max(minScale.width, minScale.height);
    this.setScale(result);
  }

  fit() {
    this.setScale(0);
  }

  _moveStart(event) {
    const hostRect = this._rootRect();
    const imgRect = this._imgRect;
    this.offset = {
      x: event.center.x - hostRect.x - imgRect.x,
      y: event.center.y - hostRect.y - imgRect.y,
      left: imgRect.x,
      top: imgRect.y
    };
  }
  _move(event) {
    let x, y;
    const hostRect = this._rootRect();
    const imgContainerRect = this._imgRect;
    const croppingContainerRect = this._areaCropperRect();

    // Limit for left
    if (event.center.x - this.offset.x > croppingContainerRect.x) {
      x = croppingContainerRect.x - hostRect.x;
    }
    // Limit for top
    if (event.center.y - this.offset.y > croppingContainerRect.y) {
      y = croppingContainerRect.y - hostRect.y;
    }
    // Limit for right
    if (event.center.x - this.offset.x + imgContainerRect.w < croppingContainerRect.x + croppingContainerRect.width) {
      x = croppingContainerRect.x - hostRect.x - imgContainerRect.w + croppingContainerRect.width;
    }
    // Limit for bottom
    if (event.center.y - this.offset.y + imgContainerRect.h < croppingContainerRect.y + croppingContainerRect.height) {
      y = croppingContainerRect.y - hostRect.y - imgContainerRect.h + croppingContainerRect.height;
    }

    // When press shiftKey
    if (event.srcEvent && event.srcEvent.shiftKey) {
      if (Math.abs(event.deltaX) === Math.max(Math.abs(event.deltaX), Math.abs(event.deltaY))) {
        y = this.offset.top;
      } else {
        x = this.offset.left;
      }
    }
    if (x === void 0) { x = event.center.x - hostRect.x - (this.offset.x); }
    if (y === void 0) { y = event.center.y - hostRect.y - (this.offset.y); }

    this._setStylesForContImg({
      width: this._imgContainer.nativeElement.offsetWidth,
      height: this._imgContainer.nativeElement.offsetHeight,
      x, y
    });
  }

  updatePosition(x?: number, y?: number) {
    const hostRect = this._rootRect();
    const croppingContainerRect = this._areaCropperRect();
    if (x === void 0 && y === void 0) {
      x = this._imgRect.xc;
      y = this._imgRect.yc;
    }
    x = (croppingContainerRect.x - hostRect.x) - (x - (this.config.width / 2));
    y = (croppingContainerRect.y - hostRect.y) - (y - (this.config.height / 2));
    this._setStylesForContImg({
      width: this._imgContainer.nativeElement.offsetWidth,
      height: this._imgContainer.nativeElement.offsetHeight,
      x, y
    });
  }

  _slideEnd() {
    this._cropIfAutoCrop();
  }

  private _cropIfAutoCrop() {
    if (this.config.autoCrop) {
      this.crop();
    }
  }

  /**+ */
  zoomIn() {
    const scale = fix(this._scale + .05, 4);
    if (scale > 0 && scale <= 1) {
      this.setScale(scale);
    } else {
      this.setScale(1);
    }
  }

  /** Clean the img cropper */
  clean() {
    this._defaultType = null;
    this._isLoadedImg = false;
    this.isLoaded = false;
    this.isCropped = false;
    this._originalImgBase64 = null;
    this.cd.markForCheck();
  }

  /**- */
  zoomOut() {
    const scale = fix(this._scale - .05, 4);
    if (scale > this.minScale && scale <= 1) {
      this.setScale(scale);
    } else {
      this.fit();
    }
  }
  center() {
    const imgRect = this._imgRect;
    const newStyles = {
      width: imgRect.w,
      height: imgRect.h,
      ...this._customCenter(imgRect.w, imgRect.h)
    };
    this._setStylesForContImg(newStyles);
    this._cropIfAutoCrop();
  }

  /** Set Img */
  setImageUrl(src: string) {
    this._originalImgBase64 = src;
    const img = new Image;
    const cropEvent: ImgCropperEvent = {
      name: this._fileName,
      type: this._defaultType,
      dataURL: null,
      base64: null,
      width: null,
      height: null,
      scale: null,
      originalDataURL: src,
      position: null
    };
    img.src = src;
    img.addEventListener('error', () => {
      this.isLoaded = false;
      this.isCropped = false;
      this._isLoadedImg = false;
      this.error.emit(cropEvent);
    });
    img.addEventListener('load', () => {
      this._imgLoaded(img);
      cropEvent.width = img.width;
      cropEvent.height = img.height;
      this._isLoadedImg = true;
      this.cd.markForCheck();
      this._ngZone
          .onStable
          .pipe(take(1))
          .subscribe(() => this._ngZone.run(() => {
            this.isLoaded = false;
            this.setScale(0, true);
            this.loaded.emit(cropEvent);
            this.isLoaded = true;
            this._cropIfAutoCrop();
            this.cd.markForCheck();
          }));
    });
  }

  rotate(degrees: number) {
    const validDegrees = convertToValidDegrees(degrees);
    const degreesRad = validDegrees * Math.PI / 180;
    const canvas = this._imgCanvas.nativeElement;
    const canvasClon = createCanvasImg(canvas);
    const ctx = canvas.getContext('2d');

    // clear
    ctx.clearRect(0, 0, canvasClon.width, canvasClon.height);

    // rotate canvas image
    this._renderer.setStyle(canvas, 'transform', `rotate(${validDegrees}deg)`);
    this._renderer.setStyle(canvas, 'transformOrigin', `${this._imgRect.xc}px ${this._imgRect.yc}px 0`);
    const { x, y } = canvas.getBoundingClientRect() as DOMRect;
    this._renderer.setStyle(canvas, 'width', `initial`);
    this._renderer.setStyle(canvas, 'height', `initial`);

    // save rect
    const canvasRect = canvas.getBoundingClientRect();

    // remove rotate styles
    this._renderer.removeStyle(canvas, 'transform');
    this._renderer.removeStyle(canvas, 'width');
    this._renderer.removeStyle(canvas, 'height');

    // set w & h
    const w = canvasRect.width;
    const h = canvasRect.height;
    ctx.canvas.width = w;
    ctx.canvas.height = h;

    // clear
    ctx.clearRect(0, 0, w, h);

    // translate and rotate
    ctx.translate(w / 2, h / 2);
    ctx.rotate(degreesRad);
    ctx.drawImage(canvasClon, -canvasClon.width / 2, -canvasClon.height / 2);
    const rootRect = this._rootRect();
    this._setStylesForContImg({
      width: w * this._scale,
      height: h * this._scale,
      x: x - rootRect.x,
      y: y - rootRect.y
    });

    /** update position & autocrop */
    this.setScale(this._scale);
  }

  private imageSmoothingQuality(img: HTMLCanvasElement, config, quality: number): HTMLCanvasElement {
    /** Calculate total number of steps needed */
    let  numSteps = Math.ceil(Math.log(Math.max(img.width, img.height) / Math.max(config.height, config.width)) / Math.log(2)) - 1;
    numSteps = numSteps <= 0 ? 0 : numSteps;

    /**Array steps */
    const steps = Array.from(Array(numSteps).keys());

    /** Context */
    const octx = img.getContext('2d');

    const q = ((quality * 10) ** numSteps) / (10 ** numSteps);

    /** If Steps => imageSmoothingQuality */
    if (numSteps) {
      /** Set size */
      const w = img.width * quality;
      const h = img.height * quality;
      /** Only the new img is shown. */
      octx.globalCompositeOperation = 'copy';

      /** Steps */
      (steps as Array<number>).forEach(() => {
        octx.drawImage(img,
          0, 0,
          w, h
        );
      });
    }

    /**
     * Step final
     * Resizing & cropping image
     */
    const oc = document.createElement('canvas'),
    ctx = oc.getContext('2d');
    oc.width = config.width;
    oc.height = config.height;
    ctx.drawImage(img,
      0, 0,
      img.width * (q), img.height * (q),
      0, 0,
      oc.width, oc.height
    );
    return oc;
  }

  /**
   * Crop Image
   * Resizing & cropping image
   */
  crop(config?: ImgCropperConfig): ImgCropperEvent {
    const newConfig = config ? mergeDeep({}, this.config || CONFIG_DEFAULT, config) : this.config;
    const cropEvent = this._imgCrop(newConfig);
    return cropEvent;
  }

  /**
   * @ignore
   */
  _imgCrop(myConfig: ImgCropperConfig) {
    const canvasElement: HTMLCanvasElement = document.createElement('canvas');
    const imgRect = this._imgRect;
    const left = imgRect.xc - myConfig.width / 2;
    const top = imgRect.yc - myConfig.height / 2;
    const config = {
      width: myConfig.width,
      height: myConfig.height
    };
    canvasElement.width = config.width / this._scale;
    canvasElement.height = config.height / this._scale;
    console.warn(canvasElement.height, canvasElement.width);
    const ctx = canvasElement.getContext('2d');
    if (myConfig.fill) {
      ctx.fillStyle = myConfig.fill;
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    }
    ctx.drawImage(this._imgCanvas.nativeElement as any,
      -(left / this._scale), -(top / this._scale),
    );
    let result = canvasElement;
    const antiAliasedQ = myConfig.antiAliased ? .5 : 1;
    if (myConfig.output === 0) {
      result = this.imageSmoothingQuality(result, config, antiAliasedQ);
    } else if (typeof myConfig.output === 'object') {
      result = this.imageSmoothingQuality(result, myConfig.output, antiAliasedQ);
    }
    let url;
    if (myConfig.type) {
      url = result.toDataURL(`image/${myConfig.type}`);
    } else {
      url = result.toDataURL(this._defaultType);
    }
    const cropEvent = {
      dataURL: url,
      base64: url,
      type: this._defaultType || myConfig.type,
      name: this._fileName,
      width: config.width,
      height: config.height,
      originalDataURL: this._originalImgBase64,
      scale: this.scale,
      position: {
        x: this._imgRect.xc,
        y: this._imgRect.yc
      }
    };
    this.cropped.emit(cropEvent);
    this.isCropped = true;
    return cropEvent;
  }

  private _rootRect(): DOMRect {
    return this.elementRef.nativeElement.getBoundingClientRect() as DOMRect;
  }
  private _imgContainerRect(): DOMRect {
    return this._imgContainer.nativeElement.getBoundingClientRect() as DOMRect;
  }

  private _areaCropperRect(): DOMRect {
    return this._croppingContainer.nativeElement.getBoundingClientRect() as DOMRect;
  }

}

/** @ignore */
const fixedNum = (num: number) => parseFloat(num.toFixed(0));

/**
 * convertToValidDegrees(45) === 90
 * convertToValidDegrees(40) === 0
 * convertToValidDegrees(100) === 90
 * @ignore
 */
function convertToValidDegrees(num: number) {
  const val360 = limitNum(num, 360);
  const val90 = limitNum(val360.result, 90);
  if (val90.result >= (90 / 2)) {
    return 90 * (val90.parts + 1);
  } else {
    return 90 * val90.parts;
  }
}

/**
 * demo:
 * limitNum(450, 360) === 90
 * @ignore
 */
function limitNum(num: number, num2: number) {
  const numAbs = Math.abs(num);
  const parts = Math.floor(numAbs / num2);
  let result: number;
  if (parts) {
    result = numAbs - (num2 * parts);
  } else {
    result = num;
  }
  if (numAbs !== num) {
    result *= -1;
  }
  return {
    result,
    parts
  };
}

/**
 * @ignore
 */
function createCanvasImg(img: HTMLCanvasElement | HTMLImageElement) {

  // create a new canvas
  const newCanvas = document.createElement('canvas');
  const context = newCanvas.getContext('2d');

  // set dimensions
  newCanvas.width = img.width;
  newCanvas.height = img.height;

  // apply the old canvas to the new one
  context.drawImage(img, 0, 0);

  // return the new canvas
  return newCanvas;
}

function fix(v, decimalPoints?: number) {
  return +parseFloat(v).toFixed(decimalPoints || 0);
}
