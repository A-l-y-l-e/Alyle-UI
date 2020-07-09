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
  NgZone,
  Inject
} from '@angular/core';
import { mergeDeep, LY_COMMON_STYLES, ThemeVariables, lyl, ThemeRef, StyleCollection, LyClasses, StyleTemplate, StyleRenderer } from '@alyle/ui';
import { Subject, Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { resizeCanvas } from './resize-canvas';

export interface LyImageCropperTheme {
  /** Styles for Image Cropper Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
}

export interface LyImageCropperVariables {
  cropper?: LyImageCropperTheme;
}

const activeEventOptions = normalizePassiveListenerOptions({passive: false});
const STYLE_PRIORITY = -2;

export const STYLES = (theme: ThemeVariables & LyImageCropperVariables, ref: ThemeRef) => {
  const cropper = ref.selectorsOf(STYLES);
  const { after } = theme;
  return {
    $name: LyImageCropper.и,
    $priority: STYLE_PRIORITY,
    root: ( ) => lyl `{
      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none
      display: flex
      overflow: hidden
      position: relative
      justify-content: center
      align-items: center
      {
        ...${
          (theme.cropper
            && theme.cropper.root
            && (theme.cropper.root instanceof StyleCollection
              ? theme.cropper.root.setTransformer(fn => fn(cropper))
              : theme.cropper.root(cropper))
          )
        }
      }
    }`,
    imgContainer: lyl `{
      cursor: move
      position: absolute
      top: 0
      left: 0
      display: flex
      touch-action: none
      & > canvas {
        display: block
      }
    }`,
    overlay: lyl `{
      ...${LY_COMMON_STYLES.fill}
    }`,
    area: lyl `{
      pointer-events: none
      box-shadow: 0 0 0 20000px rgba(0, 0, 0, 0.4)
      ...${LY_COMMON_STYLES.fill}
      margin: auto
      max-width: 100%
      max-height: 100%
      &:before, &:after {
        ...${LY_COMMON_STYLES.fill}
        content: ''
      }
      &:before {
        width: 0
        height: 0
        margin: auto
        border-radius: 50%
        background: #fff
        border: solid 2px rgb(255, 255, 255)
      }
      &:after {
        border: solid 2px rgb(255, 255, 255)
        border-radius: inherit
      }
    }`,
    resizer: lyl `{
      width: 10px
      height: 10px
      background: #fff
      border-radius: 3px
      position: absolute
      touch-action: none
      bottom: 0
      ${after}: 0
      pointer-events: all
      cursor: ${
        after === 'right'
          ? 'nwse-resize'
          : 'nesw-resize'
      }
    }`,
    defaultContent: lyl `{
      display: flex
      align-items: center
      justify-content: center
      &, & > input {
        ...${LY_COMMON_STYLES.fill}
      }
      & *:not(input) {
        pointer-events: none
      }
      & > input {
        background: transparent
        opacity: 0
        width: 100%
        height: 100%
      }
    }`
  };
};
/** Image Cropper Config */
export class ImgCropperConfig {
  /** Cropper area width */
  width: number = 250;
  /** Cropper area height */
  height: number = 200;
  minWidth?: number = 40;
  minHeight?: number = 40;
  /** If this is not defined, the new image will be automatically defined. */
  type?: string;
  /** Background color( default: null), if is null in png is transparent but not in jpg. */
  fill?: string | null;
  /**
   * Set anti-aliased (default: true)
   * @deprecated this is not necessary as the cropper will automatically resize the image
   * to the best quality
   */
  antiAliased?: boolean = true;
  autoCrop?: boolean;
  output?: ImgOutput | ImgResolution = ImgResolution.Default;
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
  /**
   * Whether the cropper area will be round.
   * This implies that the cropper area will maintain its aspect ratio.
   * default: false
   */
  round?: boolean;
  /**
   * Whether the cropper area is resizable.
   * default: false
   */
  resizableArea?: boolean;
  /**
   * Keep the width and height of the growing area the same according
   * to `ImgCropperConfig.width` and `ImgCropperConfig.height`
   * default: false
   */
  keepAspectRatio?: boolean;
}

/**
 * The output image
 * With this option you can resize the output image.
 * If `width` or `height` are 0, this will be set automatically.
 * Both cannot be 0.
 */
export interface ImgOutput {
  /**
   * The cropped image will be resized to this `width`.
   */
  width: number;
  /**
   * Cropped image will be resized to this `height`.
   */
  height: number;
}

/** Image output */
export enum ImgResolution {
  /**
   * The output image will be equal to the size of the crop area.
   */
  Default,
  /** Just crop the image without resizing */
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
  width: number;
  height: number;
  /** Original Image data URL */
  originalDataURL?: string;
  scale: number;
  /** Current rotation in degrees */
  rotation: number;
  /** Size of the image in bytes */
  size: number;
  /** Offset from the left edge of the image */
  left: number;
  /** Offset from the top edge of the image */
  top: number;
  /** Offset from the left edge of the image to center of area */
  xOrigin: number;
  /** Offset from the left edge of the image to center of area */
  yOrigin: number;
  /** @deprecated Use `xOrigin & yOrigin` instead. */
  position?: {
    x: number
    y: number
  };
}

export interface ImgCropperErrorEvent {
  name: string;
  /** Size of the image in bytes */
  size: number;
  /** Filetype */
  type: string;
  /** Type of error */
  error: ImgCropperError;
  errorMsg?: string;
}

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
  selector: 'ly-img-cropper, ly-image-cropper',
  templateUrl: 'image-cropper.html',
  providers: [
    StyleRenderer
  ]
 })
export class LyImageCropper implements OnDestroy {
  static readonly и = 'LyImageCropper';
  /**
   * styles
   * @docs-private
   */
  readonly classes = this.sRenderer.renderSheet(STYLES, true);
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
  private _sizeInBytes: number | null;
  private _isSliding: boolean;
  /** Keeps track of the last pointer event that was captured by the crop area. */
  private _lastPointerEvent: MouseEvent | TouchEvent | null;
  private _startPointerEvent: {
    x: number
    y: number
  } | null;

  /**
   * When is loaded image
   * @internal
   */
  _isLoadedImg: boolean;

  /** When is loaded image & ready for crop */
  isLoaded: boolean;
  isCropped: boolean;

  @ViewChild('_imgContainer', { static: true }) _imgContainer: ElementRef;
  @ViewChild('_area', {
    read: ElementRef
  }) _areaRef: ElementRef;
  @ViewChild('_imgCanvas', { static: true }) _imgCanvas: ElementRef<HTMLCanvasElement>;
  @Input()
  get config(): ImgCropperConfig {
    return this._config;
  }
  set config(val: ImgCropperConfig) {
    this._config = mergeDeep({}, new ImgCropperConfig(), val);
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

  /** Emits when the image is ready for cropper */
  @Output() readonly loaded = new EventEmitter<ImgCropperEvent>();

  /** On crop new image */
  @Output() readonly cropped = new EventEmitter<ImgCropperEvent>();

  /** Emit an error when the loaded image is not valid */
  @Output() readonly error = new EventEmitter<ImgCropperErrorEvent>();

  private _defaultType?: string;
  private _currentInputElement?: HTMLInputElement;

  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

  /** Used to subscribe to global move and end events */
  protected _document: Document;

  constructor(
    readonly sRenderer: StyleRenderer,
    private _renderer: Renderer2,
    readonly _elementRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) _document: any,
  ) {
    this._document = _document;
  }

  ngOnInit() {
    this._ngZone.runOutsideAngular(() => {
      const element = this._imgContainer.nativeElement;
      element.addEventListener('mousedown', this._pointerDown, activeEventOptions);
      element.addEventListener('touchstart', this._pointerDown, activeEventOptions);
    });
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
    const element = this._imgContainer.nativeElement;
    this._lastPointerEvent = null;
    this._removeGlobalEvents();
    element.removeEventListener('mousedown', this._pointerDown, activeEventOptions);
    element.removeEventListener('touchstart', this._pointerDown, activeEventOptions);
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
    this._currentInputElement = img.target as HTMLInputElement;
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

    new Observable<ProgressEvent>(observer => {

      const reader = new FileReader();

      reader.onerror = err => observer.error(err);
      reader.onabort = err => observer.error(err);
      reader.onload = (ev) => setTimeout(() => {
        observer.next(ev);
        observer.complete();
      });

      reader.readAsDataURL(_img.files![0]);
    })
      .pipe(take(1), takeUntil(this._destroy))
      .subscribe(
        (loadEvent) => {
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
        },
        () => {
          const cropEvent: ImgCropperErrorEvent = {
            name: fileName,
            size: fileSize,
            error: ImgCropperError.Other,
            errorMsg: 'The File could not be loaded.',
            type: _img.files![0].type
          };
          this.clean();
          this.error.emit(cropEvent as ImgCropperErrorEvent);
        }
      );

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
        this._simulatePointerMove();
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
    const root = this._elementRef.nativeElement as HTMLElement;
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
    const container = this._elementRef.nativeElement as HTMLElement;
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

  private _pointerDown = (event: TouchEvent | MouseEvent) => {
    // Don't do anything if the
    // user is using anything other than the main mouse button.
    if (this._isSliding || (!isTouchEvent(event) && event.button !== 0)) {
      return;
    }

    this._ngZone.run(() => {
      this._isSliding = true;
      this.offset = {
        x: this._imgRect.x,
        y: this._imgRect.y,
        left: this._imgRect.xc,
        top: this._imgRect.yc
      };
      this._lastPointerEvent = event;
      this._startPointerEvent = getGesturePointFromEvent(event);
      event.preventDefault();
      this._bindGlobalEvents(event);
    });

  }

  /**
   * Simulate pointerMove with clientX = 0 and clientY = 0,
   * this is used by `setScale` and `rotate`
   */
  private _simulatePointerMove() {
    this._isSliding = true;
    this._startPointerEvent = {
      x: 0,
      y: 0
    };
    this._pointerMove({
      clientX: 0,
      clientY: 0,
      type: 'n',
      preventDefault: () => {}
    } as MouseEvent);
    this._isSliding = false;
    this._startPointerEvent = null;
  }

  /**
   * Called when the user has moved their pointer after
   * starting to drag.
   */
  private _pointerMove = (event: TouchEvent | MouseEvent) => {
    if (this._isSliding) {
      event.preventDefault();
      this._lastPointerEvent = event;
      let x: number | undefined, y: number | undefined;
      const canvas = this._imgCanvas.nativeElement;
      const scaleFix = this._scal3Fix;
      const config = this.config;
      const startP = this.offset;
      const point = getGesturePointFromEvent(event);
      const deltaX = point.x - this._startPointerEvent!.x;
      const deltaY = point.y - this._startPointerEvent!.y;
      if (!scaleFix || !startP) {
        return;
      }

      const isMinScaleY = canvas.height * scaleFix < config.height && config.extraZoomOut;
      const isMinScaleX = canvas.width * scaleFix < config.width && config.extraZoomOut;

      const limitLeft = (config.width / 2 / scaleFix) >= startP.left - (deltaX / scaleFix);
      const limitRight = (config.width / 2 / scaleFix) + (canvas.width) - (startP.left - (deltaX / scaleFix)) <= config.width / scaleFix;
      const limitTop = ((config.height / 2 / scaleFix) >= (startP.top - (deltaY / scaleFix)));
      const limitBottom = (((config.height / 2 / scaleFix) + (canvas.height) - (startP.top - (deltaY / scaleFix))) <= (config.height / scaleFix));

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

      if (x === void 0) { x = (deltaX / scaleFix) + (startP.x); }
      if (y === void 0) { y = (deltaY / scaleFix) + (startP.y); }
      this._setStylesForContImg({
        x, y
      });
    }
  }

  updatePosition(xOrigin?: number, yOrigin?: number) {
    const hostRect = this._rootRect();
    const areaRect = this._areaCropperRect();
    if (xOrigin === undefined && yOrigin === undefined) {
      xOrigin = this._imgRect.xc;
      yOrigin = this._imgRect.yc;
    }
    const x = (areaRect.left - hostRect.left) - (xOrigin! - (this.config.width / 2));
    const y = (areaRect.top - hostRect.top) - (yOrigin! - (this.config.height / 2));
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
    // fix choosing the same image does not load
    if (this._currentInputElement) {
      this._currentInputElement.value = '';
      this._currentInputElement = null!;
    }
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
    src = normalizeSVG(src);

    const img = createHtmlImg(src);
    const fileSize = this._sizeInBytes;
    const fileName = this._fileName;
    const defaultType = this._defaultType;

    const cropEvent = {
      name: fileName,
      type: defaultType,
      originalDataURL: src,
      size: fileSize || undefined
    } as ImgCropperEvent;

    new Observable<void>(observer => {

      img.onerror = err => observer.error(err);
      img.onabort = err => observer.error(err);
      img.onload = () => observer.next(null!);
    })
    .pipe(take(1), takeUntil(this._destroy))
    .subscribe(
      () => {
        this._imgLoaded(img);
        cropEvent.width = img.width;
        cropEvent.height = img.height;
        this._isLoadedImg = true;
        this.cd.markForCheck();
        this._ngZone
          .onStable
          .pipe(take(1), takeUntil(this._destroy))
          .subscribe(
            () => setTimeout(() => this._ngZone.run(() => this._positionImg(cropEvent, fn)))
          );
      },
      () => {
        const error: ImgCropperErrorEvent = {
          name: fileName!,
          error: ImgCropperError.Type,
          type: defaultType!,
          size: fileSize!
        };
        this.error.emit(error);
      }
    );


    // clear
    this._sizeInBytes = null;
    this._fileName = null;
    this._defaultType = undefined;
  }

  private _positionImg(cropEvent: ImgCropperEvent, fn?: () => void) {
    this._updateMinScale(this._imgCanvas.nativeElement);
    this.isLoaded = false;

    if (fn) {
      fn();
    } else {
      this.setScale(this.minScale, true);
    }

    this.isLoaded = true;
    this._cropIfAutoCrop();
    this.loaded.emit(cropEvent);
    this.cd.markForCheck();
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
    this._simulatePointerMove();

    this._cropIfAutoCrop();
  }

  private _updateMinScale(canvas: HTMLCanvasElement) {
    const config = this.config;
    this._minScale = (config.extraZoomOut ? Math.min : Math.max)(
      config.width / canvas.width,
      config.height / canvas.height);
  }

  /**
   * Resize & crop image
   */
  crop(config?: ImgCropperConfig): ImgCropperEvent {
    const newConfig = config ? mergeDeep({}, this.config || new ImgCropperConfig(), config) : this.config;
    const cropEvent = this._imgCrop(newConfig);
    this.cd.markForCheck();
    return cropEvent;
  }

  /**
   * @docs-private
   */
  private _imgCrop(myConfig: ImgCropperConfig) {
    const canvasElement: HTMLCanvasElement = document.createElement('canvas');
    const areaRect = this._areaCropperRect();
    const canvaRect = this._canvaRect();
    const scaleFix = this._scal3Fix!;
    const left = (areaRect.left - canvaRect.left) / scaleFix;
    const top = (areaRect.top - canvaRect.top) / scaleFix;
    const { output } = myConfig;
    const area = {
      width: myConfig.width,
      height: myConfig.height
    };
    canvasElement.width = area.width / scaleFix;
    canvasElement.height = area.height / scaleFix;
    const ctx = canvasElement.getContext('2d')!;
    if (myConfig.fill) {
      ctx.fillStyle = myConfig.fill;
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    }
    ctx.drawImage(this._imgCanvas.nativeElement,
      -(left), -(top),
    );
    const result = canvasElement;
    if (myConfig.output === ImgResolution.Default) {
      resizeCanvas(result, area.width, area.height);
    } else if (typeof output === 'object') {
      if (output.width && output.height) {
        resizeCanvas(result, output.width, output.height);
      } else if (output.width) {
        const newHeight = area.height * output.width / area.width;
        resizeCanvas(result, output.width, newHeight);
      } else if (output.height) {
        const newWidth = area.width * output.height / area.height;
        resizeCanvas(result, newWidth, output.height);
      }
    }

    let url: string;
    if (myConfig.type) {
      url = result.toDataURL(`${myConfig.type}`);
    } else {
      url = result.toDataURL(this._defaultType);
    }
    const cropEvent: ImgCropperEvent = {
      dataURL: url,
      type: this._defaultType || myConfig.type,
      name: this._fileName,
      width: area.width,
      height: area.height,
      originalDataURL: this._originalImgBase64,
      scale: this._scal3Fix!,
      rotation: this._rotation,
      left: areaRect.left - canvaRect.left,
      top: areaRect.top - canvaRect.top,
      size: this._sizeInBytes!,
      xOrigin: this._imgRect.xc,
      yOrigin: this._imgRect.yc,
      position: {
        x: this._imgRect.xc,
        y: this._imgRect.yc
      }
    };

    this.isCropped = true;
    this.cropped.emit(cropEvent);
    return cropEvent;
  }

  _rootRect(): DOMRect {
    return this._elementRef.nativeElement.getBoundingClientRect() as DOMRect;
  }

  private _areaCropperRect(): DOMRect {
    return this._areaRef.nativeElement.getBoundingClientRect() as DOMRect;
  }

  private _canvaRect(): DOMRect {
    return this._imgCanvas.nativeElement.getBoundingClientRect();
  }


  /** Called when the user has lifted their pointer. */
  private _pointerUp = (event: TouchEvent | MouseEvent) => {
    if (this._isSliding) {
      event.preventDefault();
      this._removeGlobalEvents();
      this._isSliding = false;
      this._startPointerEvent = null;
    }
  }

  /** Called when the window has lost focus. */
  private _windowBlur = () => {
    // If the window is blurred while dragging we need to stop dragging because the
    // browser won't dispatch the `mouseup` and `touchend` events anymore.
    if (this._lastPointerEvent) {
      this._pointerUp(this._lastPointerEvent);
    }
  }

  private _bindGlobalEvents(triggerEvent: TouchEvent | MouseEvent) {
    const element = this._document;
    const isTouch = isTouchEvent(triggerEvent);
    const moveEventName = isTouch ? 'touchmove' : 'mousemove';
    const endEventName = isTouch ? 'touchend' : 'mouseup';
    element.addEventListener(moveEventName, this._pointerMove, activeEventOptions);
    element.addEventListener(endEventName, this._pointerUp, activeEventOptions);

    if (isTouch) {
      element.addEventListener('touchcancel', this._pointerUp, activeEventOptions);
    }

    const window = this._getWindow();

    if (typeof window !== 'undefined' && window) {
      window.addEventListener('blur', this._windowBlur);
    }
  }

  /** Removes any global event listeners that we may have added. */
  private _removeGlobalEvents() {
    const element = this._document;
    element.removeEventListener('mousemove', this._pointerMove, activeEventOptions);
    element.removeEventListener('mouseup', this._pointerUp, activeEventOptions);
    element.removeEventListener('touchmove', this._pointerMove, activeEventOptions);
    element.removeEventListener('touchend', this._pointerUp, activeEventOptions);
    element.removeEventListener('touchcancel', this._pointerUp, activeEventOptions);

    const window = this._getWindow();

    if (typeof window !== 'undefined' && window) {
      window.removeEventListener('blur', this._windowBlur);
    }
  }

  /** Use defaultView of injected document if available or fallback to global window reference */
  private _getWindow(): Window {
    return this._document.defaultView || window;
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


const DATA_IMAGE_SVG_PREFIX = 'data:image/svg+xml;base64,';

function normalizeSVG(dataURL: string) {
  if (window.atob && isSvgImage(dataURL)) {
    const len = dataURL.length / 5;
    const text = window.atob(dataURL.replace(DATA_IMAGE_SVG_PREFIX, ''));
    const span = document.createElement('span');
    span.innerHTML = text;
    const svg = span.querySelector('svg')!;
    span.setAttribute('style', 'display:none');
    document.body.appendChild(span);
    const width = parseFloat(getComputedStyle(svg).width!) || 1;
    const height = parseFloat(getComputedStyle(svg).height!) || 1;
    const max = Math.max(width, height);

    svg.setAttribute('width', `${len / (width / max)}px`);
    svg.setAttribute('height', `${len / (height / max)}px`);
    const result = DATA_IMAGE_SVG_PREFIX + window.btoa(span.innerHTML);
    document.body.removeChild(span);
    return result;
  }
  return dataURL;
}

function isSvgImage(dataUrl: string) {
  return dataUrl.startsWith(DATA_IMAGE_SVG_PREFIX);
}

function createHtmlImg(src: string) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;
  return img;
}


function getGesturePointFromEvent(event: TouchEvent | MouseEvent) {

  // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
  const point = isTouchEvent(event)
    ? (event.touches[0] || event.changedTouches[0])
    : event;

  return {
    x: point.clientX,
    y: point.clientY
  };
}

/** Returns whether an event is a touch event. */
function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return event.type[0] === 't';
}
