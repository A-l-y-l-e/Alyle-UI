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
  HostListener,
  OnDestroy,
  NgZone
} from '@angular/core';
import { LyTheme2, mergeDeep, LY_COMMON_STYLES, ThemeVariables } from '@alyle/ui';
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

const STYLE_PRIORITY = -2;

const STYLES = (theme: ThemeVariables) => ({
  $priority: STYLE_PRIORITY,
  root: {
    '-webkit-user-select': 'none',
    '-moz-user-select': 'none',
    '-ms-user-select': 'none',
    userSelect: 'none',
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    '&': theme.imgCropper ? theme.imgCropper.root : null
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
  area: {
    pointerEvents: 'none',
    boxShadow: '0 0 0 20000px rgba(0, 0, 0, 0.4)',
    ...LY_COMMON_STYLES.fill,
    margin: 'auto',
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
  defaultContent: {
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
  /** Cropper area width */
  width: number;
  /** Cropper area height */
  height: number;
  /** If this is not defined, the new image will be automatically defined. */
  type?: string;
  /** Background color( default: null), if is null in png is transparent but not in jpg. */
  fill?: string | null;
  /** Set anti-aliased( default: true) */
  antiAliased?: boolean;
  autoCrop?: boolean;
  output?: ImgOutput | ImgResolution;
  /**
   * Zoom out until the entire image fits into the cropping area.
   * default: false
   */
  extraZoomOut?: boolean;
  /**
   * Emit event `error` if the file size in bytes for the limit.
   * Note: It only works when the image is received from the `<input>` event.
   */
  maxFileSize?: number | null;
}

export interface ImgOutput {
  width: number;
  height: number;
}

/** Image output */
export enum ImgResolution {
  /** Resizing & cropping */
  Default,
  /** Only cropping */
  OriginalImage
}

/** Image output */
export enum ImgCropperError {
  /** The loaded image exceeds the size limit set. */
  Size,
  /** The file loaded is not image. */
  Type,
  /** When the image has not been loaded. */
  Other
}

export interface ImgCropperEvent {
  /** Cropped image data URL */
  dataURL?: string;
  name: string | null;
  /** Filetype */
  type?: string;
  width?: number;
  height?: number;
  /** Original Image data URL */
  originalDataURL?: string;
  scale?: number;
  /** Current rotation in degrees */
  rotation?: number;
  /** Size of the image in bytes */
  size?: number;
  position?: {
    x: number
    y: number
  };
}

export interface ImgCropperErrorEvent extends ImgCropperEvent {
  /** Type of error */
  error: ImgCropperError;
  errorMsg?: string;
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
export class LyResizingCroppingImages implements OnDestroy {
  /**
   * styles
   * @docs-private
   */
  readonly classes = this.theme.addStyleSheet(STYLES);
  _originalImgBase64?: string;
  private _fileName: string | null;

  /** Original image */
  private _img: HTMLImageElement;
  private offset?: {
    x: number
    y: number
    left: number
    top: number
  };
  private _scale?: number;
  private _scal3Fix?: number;
  private _minScale?: number;
  private _config: ImgCropperConfig;
  private _imgRect: ImgRect = {} as any;
  private _rotation: number;
  private _listeners = new Set<Subscription>();
  private _sizeInBytes: number | null;

  /**
   * When is loaded image
   * @internal
   */
  _isLoadedImg: boolean;

  /** When is loaded image & ready for crop */
  isLoaded: boolean;
  isCropped: boolean;

  @ViewChild('_imgContainer', { static: true }) _imgContainer: ElementRef;
  @ViewChild('_croppingContainer', { static: false }) _croppingContainer: ElementRef;
  @ViewChild('_imgCanvas', { static: true }) _imgCanvas: ElementRef<HTMLCanvasElement>;
  @Input()
  get config(): ImgCropperConfig {
    return this._config;
  }
  set config(val: ImgCropperConfig) {
    this._config = mergeDeep({}, CONFIG_DEFAULT, val);
    const maxFileSize = this._config.maxFileSize;
    if (maxFileSize) {
      this.maxFileSize = maxFileSize;
    }
  }
  /** Set scale */
  @Input()
  get scale(): number | undefined {
    return this._scale;
  }
  set scale(val: number | undefined) {
    this.setScale(val);
  }

  /**
   * Emit event `error` if the file size for the limit.
   * Note: It only works when the image is received from the `<input>` event.
   */
  @Input() maxFileSize: number;

  /** Get min scale */
  get minScale(): number | undefined {
    return this._minScale;
  }

  @Output() readonly scaleChange = new EventEmitter<number>();
  /** On loaded new image */
  @Output() readonly loaded = new EventEmitter<ImgCropperEvent>();
  /** On crop new image */
  @Output() readonly cropped = new EventEmitter<ImgCropperEvent>();
  /** Emit an error when the loaded image is not valid */
  @Output() readonly error = new EventEmitter<ImgCropperErrorEvent>();

  private _defaultType?: string;
  constructor(
    private _renderer: Renderer2,
    private theme: LyTheme2,
    private elementRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {
    this._renderer.addClass(elementRef.nativeElement, this.classes.root);
  }

  ngOnDestroy() {
    this._listeners.forEach(listen => listen.unsubscribe());
    this._listeners.clear();
  }

  private _imgLoaded(imgElement: HTMLImageElement) {
    if (imgElement) {
      this._img = imgElement;
      const canvas = this._imgCanvas.nativeElement;
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgElement, 0, 0);

      /** set min scale */
      this._updateMinScale(canvas);
    }
  }

  private _setStylesForContImg(values: {
    x?: number
    y?: number
  }) {
    const newStyles = { } as any;
    if (values.x !== void 0 && values.y !== void 0) {
      const rootRect = this._rootRect();
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
    newStyles['-webkit-transform'] = newStyles.transform;
    newStyles['-webkit-transform-origin'] = newStyles.transformOrigin;
    for (const key in newStyles) {
      if (newStyles.hasOwnProperty(key)) {
        this._renderer.setStyle(this._imgContainer.nativeElement, key, newStyles[key]);
      }
    }
  }

  @HostListener('window:resize') _resize$() {
    if (this.isLoaded) {
      this.updatePosition();
    }
  }

  selectInputEvent(img: Event) {
    const _img = img.target as HTMLInputElement;
    if (_img.files && _img.files.length !== 1) {
      return;
    }
    const fileSize = _img.files![0].size;
    const fileName = _img.value.replace(/.*(\/|\\)/, '');

    if (this.maxFileSize && fileSize > this.maxFileSize) {
      const cropEvent: ImgCropperErrorEvent = {
        name: fileName,
        type: _img.files![0].type,
        size: fileSize,
        error: ImgCropperError.Size
      };
      this.clean();
      this.error.emit(cropEvent as ImgCropperErrorEvent);
      return;
    }

    const readFile = new Observable<ProgressEvent>(obs => {

      const reader = new FileReader();

      reader.onerror = err => obs.error(err);
      reader.onabort = err => obs.error(err);
      reader.onload = (ev) => setTimeout(() => {
        obs.next(ev);
        obs.complete();
      }, 1);

      return reader.readAsDataURL(_img.files![0]);
    })
    .subscribe({
      next: (loadEvent) => {
        const originalImageUrl = (loadEvent.target as FileReader).result as string;
        // Set type
        if (!this.config.type) {
          this._defaultType = _img.files![0].type;
        }
        // set name
        this._fileName = fileName;
        // set file size
        this._sizeInBytes = _img.files![0].size;

        this.setImageUrl(originalImageUrl);

        this.cd.markForCheck();
        this._listeners.delete(readFile);
      },
      error: () => {
        const cropEvent: ImgCropperErrorEvent = {
          name: fileName,
          size: fileSize,
          error: ImgCropperError.Other,
          errorMsg: 'The File could not be loaded.'
        };
        this.clean();
        this.error.emit(cropEvent as ImgCropperErrorEvent);
        this._listeners.delete(readFile);
        this.ngOnDestroy();
      }
    });

    this._listeners.add(readFile);

  }

  /** Set the size of the image, the values can be 0 between 1, where 1 is the original size */
  setScale(size?: number, noAutoCrop?: boolean) {
    // fix min scale
    const newSize = size! >= this.minScale! && size! <= 1 ? size : this.minScale;

    // check
    const changed = size != null && size !== this.scale && newSize !== this.scale;
    this._scale = size;
    if (!changed) {
      return;
    }
    this._scal3Fix = newSize;
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

    this.scaleChange.emit(size);
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
    this.setScale(this.minScale);
  }

  _moveStart() {
    this.offset = {
      x: this._imgRect.x,
      y: this._imgRect.y,
      left: this._imgRect.xc,
      top: this._imgRect.yc
    };
  }
  _move(event: { srcEvent?: {}; deltaX: any; deltaY: any; }) {
    let x: number | undefined, y: number | undefined;
    const canvas = this._imgCanvas.nativeElement;
    const scaleFix = this._scal3Fix;
    const config = this.config;
    const startP = this.offset;
    if (!scaleFix || !startP) {
      return;
    }

    const isMinScaleY = canvas.height * scaleFix < config.height && config.extraZoomOut;
    const isMinScaleX = canvas.width * scaleFix < config.width && config.extraZoomOut;

    const limitLeft = (config.width / 2 / scaleFix) >= startP.left - (event.deltaX / scaleFix);
    const limitRight = (config.width / 2 / scaleFix) + (canvas.width) - (startP.left - (event.deltaX / scaleFix)) <= config.width / scaleFix;
    const limitTop = ((config.height / 2 / scaleFix) >= (startP.top - (event.deltaY / scaleFix)));
    const limitBottom = (((config.height / 2 / scaleFix) + (canvas.height) - (startP.top - (event.deltaY / scaleFix))) <= (config.height / scaleFix));

    // Limit for left
    if ((limitLeft && !isMinScaleX) || (!limitLeft && isMinScaleX)) {
      x = startP.x + (startP.left) - (config.width / 2 / scaleFix);
    }

    // Limit for right
    if ((limitRight && !isMinScaleX) || (!limitRight && isMinScaleX)) {
      x = startP.x + (startP.left) + (config.width / 2 / scaleFix) - canvas.width;
    }

    // Limit for top
    if ((limitTop && !isMinScaleY) || (!limitTop && isMinScaleY)) {
      y = startP.y + (startP.top) - (config.height / 2 / scaleFix);
    }

    // Limit for bottom
    if ((limitBottom && !isMinScaleY) || (!limitBottom && isMinScaleY)) {
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

    if (x === void 0) { x = (event.deltaX / scaleFix) + (startP.x); }
    if (y === void 0) { y = (event.deltaY / scaleFix) + (startP.y); }
    this._setStylesForContImg({
      x, y
    });
  }

  updatePosition(x?: number, y?: number) {
    const hostRect = this._rootRect();
    const croppingContainerRect = this._areaCropperRect();
    if (x === undefined && y === undefined) {
      x = this._imgRect.xc;
      y = this._imgRect.yc;
    }
    x = (croppingContainerRect.left - hostRect.left) - (x! - (this.config.width / 2));
    y = (croppingContainerRect.top - hostRect.top) - (y! - (this.config.height / 2));
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
    const scale = this._scal3Fix! + .05;
    if (scale > 0 && scale <= 1) {
      this.setScale(scale);
    } else {
      this.setScale(1);
    }
  }

  /** Clean the img cropper */
  clean() {
    if (this.isLoaded) {
      this._imgRect = { } as any;
      this.offset = undefined;
      this.scale = undefined as any;
      this._scal3Fix = undefined;
      this._rotation = 0;
      this._minScale = undefined;
      this._isLoadedImg = false;
      this.isLoaded = false;
      this.isCropped = false;
      this._originalImgBase64 = undefined;
      const canvas = this._imgCanvas.nativeElement;
      canvas.width = 0;
      canvas.height = 0;
      this.cd.markForCheck();
    }
  }

  /**- */
  zoomOut() {
    const scale = this._scal3Fix! - .05;
    if (scale > this.minScale! && scale <= 1) {
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

/**
 * Load Image from URL
 * @param src URL
 * @param fn function that will be called before emit the event loaded
 */
  setImageUrl(src: string, fn?: () => void) {
    this.clean();
    this._originalImgBase64 = src;
    const img = new Image();

    const fileSize = this._sizeInBytes;
    const fileName = this._fileName;
    const defaultType = this._defaultType;

    img.crossOrigin = 'anonymous';
    const cropEvent: ImgCropperEvent = {
      name: fileName,
      type: defaultType,
      originalDataURL: src
    };

    img.src = src;

    if (fileSize) {
      cropEvent.size = fileSize;
    }
    const loadListen = new Observable<void>(obs => {

      img.onerror = err => obs.error(err);
      img.onabort = err => obs.error(err);
      img.onload = () => {
        obs.next(null!);
        obs.complete();
      };
    })
    .subscribe({
      next: () => {
        this._imgLoaded(img);
        cropEvent.width = img.width;
        cropEvent.height = img.height;
        this._isLoadedImg = true;
        this.cd.markForCheck();

        this._ngZone
          .onStable
          .pipe(take(1))
          .subscribe(
            () => setTimeout(() => this._ngZone.run(() => {

              this._updateMinScale(this._imgCanvas.nativeElement);
              this.isLoaded = false;

              if (fn) {
                fn();
              } else {
                this.setScale(this.minScale, true);
              }

              this.loaded.emit(cropEvent);
              this.isLoaded = true;
              this._cropIfAutoCrop();
              this.cd.markForCheck();
            }), 0)
          );

        this._listeners.delete(loadListen);
        this.ngOnDestroy();
      },
      error: () => {
        (cropEvent as ImgCropperErrorEvent).error = ImgCropperError.Type;
        this.error.emit(cropEvent as ImgCropperErrorEvent);
        this._listeners.delete(loadListen);
        this.ngOnDestroy();
      }
    });

    this._listeners.add(loadListen);

    // clear
    this._sizeInBytes = null;
    this._fileName = null;
    this._defaultType = undefined;
  }

  rotate(degrees: number) {
    const validDegrees = this._rotation = convertToValidDegrees(degrees);
    const degreesRad = validDegrees * Math.PI / 180;
    const canvas = this._imgCanvas.nativeElement;
    const canvasClon = createCanvasImg(canvas);
    const ctx = canvas.getContext('2d')!;

    // clear
    ctx.clearRect(0, 0, canvasClon.width, canvasClon.height);

    // rotate canvas image
    const transform = `rotate(${validDegrees}deg) scale(${1 / this._scal3Fix!})`;
    const transformOrigin = `${this._imgRect.xc}px ${this._imgRect.yc}px 0`;
    canvas.style.transform = transform;
    canvas.style.webkitTransform = transform;
    canvas.style.transformOrigin = transformOrigin;
    canvas.style.webkitTransformOrigin = transformOrigin;

    const { left, top } = canvas.getBoundingClientRect() as DOMRect;

    // save rect
    const canvasRect = canvas.getBoundingClientRect();

    // remove rotate styles
    canvas.removeAttribute('style');

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

    // Update min scale
    this._updateMinScale(canvas);

    // set the minimum scale, only if necessary
    if (this.scale! < this.minScale!) {
      this.setScale(0, true);
    } //                ↑ no AutoCrop

    const rootRect = this._rootRect();

    this._setStylesForContImg({
      x: (left - rootRect.left),
      y: (top - rootRect.top)
    });

    // keep image inside the frame
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

    this._cropIfAutoCrop();
  }

  private _updateMinScale(canvas: HTMLCanvasElement) {
    const config = this.config;
    this._minScale = (config.extraZoomOut ? Math.min : Math.max)(
      config.width / canvas.width,
      config.height / canvas.height);
  }

  private imageSmoothingQuality(img: HTMLCanvasElement, config, quality: number): HTMLCanvasElement {
    /** Calculate total number of steps needed */
    let  numSteps = Math.ceil(Math.log(Math.max(img.width, img.height) / Math.max(config.width, config.height)) / Math.log(2)) - 1;
    numSteps = numSteps <= 0 ? 0 : numSteps;

    /**Array steps */
    const steps = Array.from(Array(numSteps).keys());

    /** Context */
    const octx = img.getContext('2d')!;

    const q = ((quality * 10) ** numSteps) / (10 ** numSteps);
    const fileType = this._defaultType;
    /** If Steps => imageSmoothingQuality */
    if (numSteps) {
      /** Set size */
      const w = img.width * quality;
      const h = img.height * quality;
      /** Only the new img is shown. */
      if (fileType === 'image/png' || fileType === 'image/svg+xml') {
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
    ctx = oc.getContext('2d')!;
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
    this.cd.markForCheck();
    return cropEvent;
  }

  /**
   * @docs-private
   */
  private _imgCrop(myConfig: ImgCropperConfig) {
    const canvasElement: HTMLCanvasElement = document.createElement('canvas');
    const imgRect = this._imgRect!;
    const scaleFix = this._scal3Fix!;
    const left = imgRect.xc - (myConfig.width / 2 / scaleFix);
    const top = imgRect.yc - (myConfig.height / 2 / scaleFix);
    const config = {
      width: myConfig.width,
      height: myConfig.height
    };
    canvasElement.width = config.width / scaleFix;
    canvasElement.height = config.height / scaleFix;
    const ctx = canvasElement.getContext('2d')!;
    if (myConfig.fill) {
      ctx.fillStyle = myConfig.fill;
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    }
    ctx.drawImage(this._imgCanvas.nativeElement,
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
      url = result.toDataURL(`${myConfig.type}`);
    } else {
      url = result.toDataURL(this._defaultType);
    }
    const cropEvent: ImgCropperEvent = {
      dataURL: url,
      type: this._defaultType || myConfig.type,
      name: this._fileName,
      width: config.width,
      height: config.height,
      originalDataURL: this._originalImgBase64,
      scale: this._scal3Fix,
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
 * @docs-private
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
 * @docs-private
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
 * @docs-private
 */
function createCanvasImg(img: HTMLCanvasElement | HTMLImageElement) {

  // create a new canvas
  const newCanvas = document.createElement('canvas');
  const context = newCanvas.getContext('2d')!;

  // set dimensions
  newCanvas.width = img.width;
  newCanvas.height = img.height;

  // apply the old canvas to the new one
  context.drawImage(img, 0, 0);

  // return the new canvas
  return newCanvas;
}
