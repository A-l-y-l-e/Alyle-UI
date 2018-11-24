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
      // width: '100%',
      // height: '100%',
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

/**
 * Deprecated, use instead ImgCropperConfig
 * @deprecated
 */
export type LyResizingCroppingImagesConfig = ImgCropperConfig;

/** Image output */
export enum ImgResolution {
  /** Resizing & cropping */
  Default,
  /** Only cropping */
  OriginalImage
}

export interface ImgCropperEvent {
  /** Cropped image in base64, !deprecated use instead `dataURL` */
  base64: string;
  /** Cropped image data URL */
  dataURL: string;
  name: string;
  /** Filetype */
  type: string;
  width: number;
  height: number;
  /** Original Image data URL */
  originalDataURL: string;
  scale: number;
  /** Current rotation in degrees */
  rotation: number;
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

interface ImgRect {
  x: number;
  y: number;
  xc: number;
  yc: number;
  // w: number;
  // h: number;
  /** transform with */
  wt: number;
  ht: number;
}

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
  private _scal3Fix: number;
  private _minScale: number;
  private _config: ImgCropperConfig;
  private _imgRect: ImgRect = {} as any;
  private _rotation: number;

  @ViewChild('_imgContainer') _imgContainer: ElementRef;
  @ViewChild('_croppingContainer') _croppingContainer: ElementRef;
  @ViewChild('_imgCanvas') _imgCanvas: ElementRef<HTMLCanvasElement>;
  @Output() readonly scaleChange = new EventEmitter<number>();

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
    this.setScale(val);
  }

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
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgElement, 0, 0);
      /** set zoom scale */
      const minScale = {
        width: this.config.width / canvas.width,
        height: this.config.height / canvas.height
      };
      this._minScale = Math.max(minScale.width, minScale.height);
    }
  }

  private _setStylesForContImg(values: {
    x?: number
    y?: number
  }) {
    const newStyles = { } as any;
    const rootRect = this._rootRect();
    if (values.x !== void 0 && values.y !== void 0) {
      const x = rootRect.width / 2 - (values.x);
      const y = rootRect.height / 2 - (values.y);

      this._imgRect.x = (values.x);
      this._imgRect.y = (values.y);
      this._imgRect.xc = (x);
      this._imgRect.yc = (y);
    }
    newStyles.transform = `translate3d(${(this._imgRect.x)}px,${(this._imgRect.y)}px, 0)`;
    newStyles.transform += `scale(${this._scal3Fix})`;
    newStyles.transformOrigin = `${this._imgRect.xc}px ${this._imgRect.yc}px 0`;
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
    size = size >= this.minScale && size <= 1 ? size : this.minScale;

    // check
    const changed = size !== this.scale;
    this._scale = size;
    size = this._scal3Fix = size;
    if (this.isLoaded) {
      if (changed) {
        const originPosition = {...this._imgRect};
        this.offset = {
          x: originPosition.x,
          y: originPosition.y,
          left: originPosition.xc,
          top: originPosition.yc
        };
        this._setStylesForContImg({});
        this._move({
          srcEvent: {},
          deltaX: 0,
          deltaY: 0
        });
      } else {
        return;
      }
    } else if (this.minScale) {
      this._setStylesForContImg({
        ...this._getCenterPoints()
      });
    } else {
      return;
    }

    this.scaleChange.emit(this._scale);
    if (!noAutoCrop) {
      this._cropIfAutoCrop();
    }
  }

  private _getCenterPoints() {
    const root = this.elementRef.nativeElement as HTMLElement;
    const img = this._imgCanvas.nativeElement;
    const x = (root.offsetWidth - (img.width)) / 2;
    const y = (root.offsetHeight - (img.height)) / 2;
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

  _moveStart() {
    this.offset = {
      x: this._imgRect.x,
      y: this._imgRect.y,
      left: this._imgRect.xc,
      top: this._imgRect.yc
    };
  }
  _move(event) {
    let x, y;
    const canvas = this._imgCanvas.nativeElement;
    const scaleFix = this._scale;
    const config = this.config;
    const startP = this.offset;
    // Limit for left
    if ((config.width / 2 / scaleFix) >= startP.left - (event.deltaX / scaleFix)) {
      x = startP.x + (startP.left) - (config.width / 2 / scaleFix);
    }

    // // Limit for top
    if ((config.height / 2 / scaleFix) >= (startP.top - (event.deltaY / scaleFix))) {
      y = startP.y + (startP.top) - (config.width / 2 / scaleFix);
    }

    // // Limit for right
    if ((config.width / 2 / scaleFix) + (canvas.width) - (startP.left - (event.deltaX / scaleFix)) <= config.width / scaleFix) {
      x = startP.x + (startP.left) + (config.width / 2 / scaleFix) - canvas.width;
    }

    // // Limit for bottom
    if (((config.height / 2 / scaleFix) + (canvas.height) - (startP.top - (event.deltaY / scaleFix))) <= (config.height / scaleFix)) {
      y = startP.y + (startP.top) + (config.height / 2 / scaleFix) - canvas.height;
    }

    // When press shiftKey, deprecated
    // if (event.srcEvent && event.srcEvent.shiftKey) {
    //   if (Math.abs(event.deltaX) === Math.max(Math.abs(event.deltaX), Math.abs(event.deltaY))) {
    //     y = this.offset.top;
    //   } else {
    //     x = this.offset.left;
    //   }
    // }

    if (x === void 0) { x = (event.deltaX / scaleFix) + (this.offset.x); }
    if (y === void 0) { y = (event.deltaY / scaleFix) + (this.offset.y); }
    this._setStylesForContImg({
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
    const scale = this._scal3Fix + .05;
    if (scale > 0 && scale <= 1) {
      this.setScale(scale);
    } else {
      this.setScale(1);
    }
  }

  /** Clean the img cropper */
  clean() {
    this._imgRect = { } as any;
    this.offset = null;
    this.scale = null;
    this._scal3Fix = null;
    this._rotation = 0;
    this._minScale = null;
    this._defaultType = null;
    this._isLoadedImg = false;
    this.isLoaded = false;
    this.isCropped = false;
    this._originalImgBase64 = null;
    const canvas = this._imgCanvas.nativeElement;
    canvas.width = 0;
    canvas.height = 0;
    this.cd.markForCheck();
  }

  /**- */
  zoomOut() {
    const scale = this._scal3Fix - .05;
    if (scale > this.minScale && scale <= 1) {
      this.setScale(scale);
    } else {
      this.fit();
    }
  }
  center() {
    const newStyles = {
      ...this._getCenterPoints()
    };
    this._setStylesForContImg(newStyles);
    this._cropIfAutoCrop();
  }

  /** Set Img */
  setImageUrl(src: string) {
    this.clean();
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
      rotation: null,
      position: null
    };
    img.src = src;
    img.addEventListener('error', () => {
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
    const validDegrees = this._rotation = convertToValidDegrees(degrees);
    const degreesRad = validDegrees * Math.PI / 180;
    const canvas = this._imgCanvas.nativeElement;
    const canvasClon = createCanvasImg(canvas);
    const ctx = canvas.getContext('2d');

    // clear
    ctx.clearRect(0, 0, canvasClon.width, canvasClon.height);

    // rotate canvas image
    this._renderer.setStyle(canvas, 'transform', `rotate(${validDegrees}deg) scale(${1 / this._scal3Fix})`);
    this._renderer.setStyle(canvas, 'transformOrigin', `${this._imgRect.xc}px ${this._imgRect.yc}px 0`);
    const { x, y } = canvas.getBoundingClientRect() as DOMRect;

    // save rect
    const canvasRect = canvas.getBoundingClientRect();

    // remove rotate styles
    this._renderer.removeStyle(canvas, 'transform');
    this._renderer.removeStyle(canvas, 'transformOrigin');

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
      x: (x - rootRect.x),
      y: (y - rootRect.y)
    });

    this._cropIfAutoCrop();
  }

  private imageSmoothingQuality(img: HTMLCanvasElement, config, quality: number): HTMLCanvasElement {
    /** Calculate total number of steps needed */
    let  numSteps = Math.ceil(Math.log(Math.max(img.width, img.height) / Math.max(config.width, config.height)) / Math.log(2)) - 1;
    numSteps = numSteps <= 0 ? 0 : numSteps;

    /**Array steps */
    const steps = Array.from(Array(numSteps).keys());

    /** Context */
    const octx = img.getContext('2d');

    const q = ((quality * 10) ** numSteps) / (10 ** numSteps);
    const fileType = this._defaultType;
    /** If Steps => imageSmoothingQuality */
    if (numSteps) {
      /** Set size */
      const w = img.width * quality;
      const h = img.height * quality;
      /** Only the new img is shown. */
      if (this._defaultType === 'image/png' || fileType === 'image/svg+xml') {
        octx.globalCompositeOperation = 'copy';
      }

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
      img.width * q, img.height * q,
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
    const scaleFix = this._scal3Fix;
    const left = imgRect.xc - (myConfig.width / 2 / scaleFix);
    const top = imgRect.yc - (myConfig.height / 2 / scaleFix);
    const config = {
      width: myConfig.width,
      height: myConfig.height
    };
    canvasElement.width = config.width / scaleFix;
    canvasElement.height = config.height / scaleFix;
    const ctx = canvasElement.getContext('2d');
    if (myConfig.fill) {
      ctx.fillStyle = myConfig.fill;
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    }
    ctx.drawImage(this._imgCanvas.nativeElement as any,
      -(left), -(top),
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
      rotation: this._rotation,
      position: {
        x: this._imgRect.xc,
        y: this._imgRect.yc
      }
    };
    this.isCropped = true;
    this.cropped.emit(cropEvent);
    return cropEvent;
  }

  private _rootRect(): DOMRect {
    return this.elementRef.nativeElement.getBoundingClientRect() as DOMRect;
  }

  private _areaCropperRect(): DOMRect {
    return this._croppingContainer.nativeElement.getBoundingClientRect() as DOMRect;
  }

}

/**
 * convertToValidDegrees(45) === 90
 * convertToValidDegrees(40) === 0
 * convertToValidDegrees(100) === 90
 * @ignore
 */
function convertToValidDegrees(num: number) {
  const val360 = limitNum(num, 360);
  const val90 = limitNum(val360.result, 90);
  const sign = Math.sign(num);
  if (val90.result >= (90 / 2)) {
    return 90 * (val90.parts + 1) * sign;
  } else {
    return 90 * val90.parts * sign;
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
