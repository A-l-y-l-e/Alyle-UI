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
  OnDestroy,
  NgZone,
  Inject,
  OnInit
} from '@angular/core';
import { mergeDeep, LY_COMMON_STYLES, ThemeVariables, lyl, ThemeRef, StyleCollection, LyClasses, StyleTemplate, StyleRenderer } from '@alyle/ui';
import { Subject, Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { resizeCanvas } from './resize-canvas';
import { ViewportRuler } from '@angular/cdk/scrolling';

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
      &:before {
        ...${LY_COMMON_STYLES.fill}
        content: ''
        width: 20px
        height: 20px
        transform: translate(-25%, -25%)
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
  /**
   * Whether the cropper area is responsive.
   * By default, the width and height of the cropper area is fixed,
   * so can use when the cropper area is larger than its container,
   * otherwise this will bring problems when cropping.
   */
  responsiveArea?: boolean;
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
  /** Cropped area width */
  areaWidth: number;
  /** Cropped area height */
  areaHeight: number;
  /** Cropped image width */
  width: number;
  /** Cropped image height */
  height: number;
  /** Original Image data URL */
  originalDataURL?: string;
  scale: number;
  /** Current rotation in degrees */
  rotation: number;
  /** Size of the image in bytes */
  size: number;
  /** Scaled offset from the left edge of the image */
  left: number;
  /** Scaled offset from the top edge of the image */
  top: number;
  /**
   * Scaled offset from the left edge of the image to center of area
   * Can be used to set image position
   */
  xOrigin: number;
  /**
   * Scaled offset from the top edge of the image to center of area
   * Can be used to set image position
   */
  yOrigin: number;
  /** @deprecated Use `xOrigin & yOrigin` instead. */
  position?: {
    x: number
    y: number
  };
}

export interface ImgCropperErrorEvent {
  name?: string;
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

export interface ImgCropperLoaderConfig {
  name?: string | null;
  /** Filetype */
  type?: string;
  /** Cropped area width */
  areaWidth?: number;
  /** Cropped area height */
  areaHeight?: number;
  /** Cropped image width */
  width?: number;
  /** Cropped image height */
  height?: number;
  /** Original Image data URL */
  originalDataURL: string;
  scale?: number;
  /** Current rotation in degrees */
  rotation?: number;
  /** Size of the image in bytes */
  size?: number;
  /** Offset from the left edge of the image to center of area */
  xOrigin?: number;
  /** Offset from the top edge of the image to center of area */
  yOrigin?: number;
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
export class LyImageCropper implements OnInit, OnDestroy {
  static readonly и = 'LyImageCropper';
  /**
   * styles
   * @docs-private
   */
  readonly classes = this.sRenderer.renderSheet(STYLES, true);
  private _currentLoadConfig?: ImgCropperLoaderConfig;
  // _originalImgBase64?: string;
  // private _fileName: string | null;

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
  private _maxScale?: number;
  private _configPrimary: ImgCropperConfig;
  private _config: ImgCropperConfig;
  private _imgRect: ImgRect = {} as any;
  private _rotation: number = 0;
  // private _sizeInBytes: number | null;
  private _isSliding: boolean;
  /** Keeps track of the last pointer event that was captured by the crop area. */
  private _lastPointerEvent: MouseEvent | TouchEvent | null;
  private _startPointerEvent: {
    x: number
    y: number
  } | null;
  _primaryAreaWidth: number;
  _primaryAreaHeight: number;

  _absoluteScale: number;

  /**
   * When is loaded image
   * @internal
   */
  _isLoadedImg: boolean;

  /** When is loaded image & ready for crop */
  isLoaded: boolean;
  /** When the cropper is ready to be interacted  */
  isReady: boolean;
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
    this._configPrimary = mergeDeep({}, this._config);
    this._primaryAreaWidth = this.config.width;
    this._primaryAreaHeight = this.config.height;
    if (
      this._config.round
      && this.config.width !== this.config.height
    ) {
      throw new Error(`${LyImageCropper.и}: Both width and height must be equal when using \`ImgCropperConfig.round = true\``);
    }
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

  /** Emits minimum supported image scale */
  @Output('minScale') readonly minScaleChange = new EventEmitter<number>();

  /** Emits maximum supported image scale */
  @Output('maxScale') readonly maxScaleChange = new EventEmitter<number>();

  /** @deprecated Emits when the image is loaded, instead use `ready` */
  @Output() readonly loaded = new EventEmitter<ImgCropperEvent>();

  /** Emits when the image is loaded */
  @Output() readonly imageLoaded = new EventEmitter<ImgCropperEvent>();

  /** Emits when the cropper is ready to be interacted */
  @Output() readonly ready = new EventEmitter<ImgCropperEvent>();

  /** On crop new image */
  @Output() readonly cropped = new EventEmitter<ImgCropperEvent>();

  /** Emits when the cropper is cleaned */
  @Output() readonly cleaned = new EventEmitter<void>();

  /** Emit an error when the loaded image is not valid */
  // tslint:disable-next-line: no-output-native
  @Output() readonly error = new EventEmitter<ImgCropperErrorEvent>();

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
    viewPortRuler: ViewportRuler
  ) {
    this._document = _document;
    viewPortRuler.change()
    .pipe(takeUntil(this._destroy))
    .subscribe(() =>
      this._ngZone.run(() => this.updateCropperPosition())
    );
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

  /** Load image with canvas */
  private _imgLoaded(imgElement: HTMLImageElement) {
    if (imgElement) {
      this._img = imgElement;
      const canvas = this._imgCanvas.nativeElement;
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, imgElement.width, imgElement.height);
      ctx.drawImage(imgElement, 0, 0);

      /** set min scale */
      this._updateMinScale(canvas);
      this._updateMaxScale();
    }
  }

  private _setStylesForContImg(values: {
    x?: number
    y?: number
  }) {
    const newStyles = { } as any;
    if (values.x != null && values.y != null) {
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
  /**
   * Update area and image position only if needed,
   * this is used when window resize
   */
  updateCropperPosition() {
    if (this.isLoaded) {
      this.updatePosition();
      this._updateAreaIfNeeded();
    }
  }

  /** Load Image from input event */
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
          const originalDataURL = (loadEvent.target as FileReader).result as string;

          this.loadImage({
            name: fileName,
            size: _img.files![0].size, // size in bytes
            type: this.config.type || _img.files![0].type,
            originalDataURL
          });

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
    this._updateAbsoluteScale();
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
   * Fit to screen
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

  _markForCheck() {
    this.cd.markForCheck();
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
      const limitBottom = (
        ((config.height / 2 / scaleFix) + (canvas.height) - (startP.top - (deltaY / scaleFix))) <= (config.height / scaleFix)
      );

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

  updatePosition(): void;
  updatePosition(xOrigin: number, yOrigin: number): void;
  updatePosition(xOrigin?: number, yOrigin?: number) {
    const hostRect = this._rootRect();
    const areaRect = this._areaCropperRect();
    const areaWidth = areaRect.width > hostRect.width
      ? hostRect.width
      : areaRect.width;
    const areaHeight = areaRect.height > hostRect.height
      ? hostRect.height
      : areaRect.height;
    let x: number, y: number;
    if (xOrigin == null && yOrigin == null) {
      xOrigin = this._imgRect.xc;
      yOrigin = this._imgRect.yc;
    }
    x = (areaRect.left - hostRect.left);
    y = (areaRect.top - hostRect.top);
    x -= (xOrigin! - (areaWidth / 2));
    y -= (yOrigin! - (areaHeight / 2));

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

  /** + */
  zoomIn() {
    const scale = this._scal3Fix! + .05;
    if (scale > this.minScale! && scale <= this._maxScale!) {
      this.setScale(scale);
    } else {
      this.setScale(this._maxScale!);
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
      this._currentLoadConfig = undefined;
      this.config = this._configPrimary;
      const canvas = this._imgCanvas.nativeElement;
      canvas.width = 0;
      canvas.height = 0;
      this.cleaned.emit(null!);
      this.cd.markForCheck();
    }
  }

  /** - */
  zoomOut() {
    const scale = this._scal3Fix! - .05;
    if (scale > this.minScale! && scale <= this._maxScale!) {
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
   * load an image from a given configuration,
   * or from the result of a cropped image
   */
  loadImage(config: ImgCropperLoaderConfig | string, fn?: () => void) {
    this.clean();
    const _config = this._currentLoadConfig = typeof config === 'string'
      ? { originalDataURL: config }
      : { ...config };
    let src = _config.originalDataURL;
    this._primaryAreaWidth = this._configPrimary.width;
    this._primaryAreaHeight = this._configPrimary.height;
    if (_config.areaWidth && _config.areaHeight) {
      this.config.width = _config.areaWidth;
      this.config.height = _config.areaHeight;
    }
    src = normalizeSVG(src);

    const img = createHtmlImg(src);

    const cropEvent = { ..._config } as ImgCropperEvent;

    new Observable<void>(observer => {

      img.onerror = err => observer.error(err);
      img.onabort = err => observer.error(err);
      img.onload = () => observer.next(null!);
    })
    .pipe(take(1), takeUntil(this._destroy))
    .subscribe(
      () => {
        this._imgLoaded(img);
        this._isLoadedImg = true;
        this.imageLoaded.emit(cropEvent);
        this.cd.markForCheck();
        this._ngZone.runOutsideAngular(() => {
          this._ngZone
            .onStable
            .asObservable()
            .pipe(take(1), takeUntil(this._destroy))
            .subscribe(
              () => setTimeout(() => this._ngZone.run(() => this._positionImg(cropEvent, fn)))
            );
        });
      },
      () => {
        const error: ImgCropperErrorEvent = {
          name: _config.name!,
          error: ImgCropperError.Type,
          type: _config.type!,
          size: _config.size!
        };
        this.error.emit(error);
      }
    );
  }

  private _updateAreaIfNeeded() {
    if (!this._config.responsiveArea) {
      return;
    }

    const rootRect = this._rootRect();
    const areaRect = this._areaCropperRect();
    const minWidth = this.config.minWidth || 1;
    const minHeight = this.config.minHeight || 1;
    if (!(
      areaRect.width > rootRect.width
      || areaRect.height > rootRect.height
      || areaRect.width < this._primaryAreaWidth
      || areaRect.height < this._primaryAreaHeight
    )) {
      return;
    }
    const areaWidthConf = Math.max(this.config.width, minWidth);
    const areaWidthMax = Math.max(rootRect.width, minWidth);
    const minHost = Math.min(
      Math.max(rootRect.width, minWidth), Math.max(rootRect.height, minHeight)
    );
    const currentScale = this._scal3Fix!;
    let newScale = 0;
    const roundConf = this.config.round;

    if (roundConf) {
      this.config.width = this.config.height = minHost;
    } else {
      if (areaWidthConf === areaRect.width) {
        if (areaWidthMax > this._primaryAreaWidth) {
          this.config.width = this._primaryAreaWidth;
          this.config.height = (this._primaryAreaWidth * areaRect.height) / areaRect.width;
          newScale = (currentScale * this._primaryAreaWidth) / areaRect.width;
        } else {
          this.config.width = areaWidthMax;
          this.config.height = (areaWidthMax * areaRect.height) / areaRect.width;
          newScale = (currentScale * areaWidthMax) / areaRect.width;
        }
        this._updateMinScale();
        this._updateMaxScale();
        this.setScale(newScale, true);
        this._markForCheck();
      }
    }
  }

  private _updateAbsoluteScale() {
    const scale = this._scal3Fix! / (this.config.width / this._primaryAreaWidth);
    this._absoluteScale = scale;
  }

  /**
   * Load Image from URL
   * @deprecated Use `loadImage` instead of `setImageUrl`
   * @param src URL
   * @param fn function that will be called before emit the event loaded
   */
  setImageUrl(src: string, fn?: () => void) {
    this.loadImage(src, fn);
  }

  private _positionImg(cropEvent: ImgCropperEvent, fn?: () => void) {
    const loadConfig = this._currentLoadConfig!;
    this._updateMinScale(this._imgCanvas.nativeElement);
    this._updateMaxScale();
    this.isLoaded = false;
    if (fn) {
      fn();
    } else {
      if (loadConfig.scale) {
        this.setScale(loadConfig.scale, true);
      } else {
        this.setScale(this.minScale, true);
      }
      this.rotate(loadConfig.rotation || 0);
      this._updateAreaIfNeeded();
      this._markForCheck();
      this._ngZone.runOutsideAngular(() => {
        this._ngZone
          .onStable
          .asObservable()
          .pipe(take(1), takeUntil(this._destroy))
          .subscribe(() => {
            if (loadConfig.xOrigin != null && loadConfig.yOrigin != null) {
              this.updatePosition(loadConfig.xOrigin, loadConfig.yOrigin);
            }
            this._updateAreaIfNeeded();
            this.isLoaded = true;
            this._cropIfAutoCrop();
            this._ngZone.run(() => {
              this._markForCheck();
              this.ready.emit(cropEvent);
              // tslint:disable-next-line: deprecation
              this.loaded.emit(cropEvent);
            });
          });
      });
    }
  }

  rotate(degrees: number) {
    let validDegrees = _normalizeDegrees(degrees);
    // If negative convert to positive
    if (validDegrees < 0) {
      validDegrees += 360;
    }
    const newRotation = _normalizeDegrees((this._rotation || 0) + validDegrees);
    if (newRotation === this._rotation) {
      return;
    }
    const degreesRad = validDegrees * Math.PI / 180;
    const canvas = this._imgCanvas.nativeElement;
    const canvasClon = createCanvasImg(canvas);
    const ctx = canvas.getContext('2d')!;
    this._rotation = newRotation;

    // clear
    ctx.clearRect(0, 0, canvasClon.width, canvasClon.height);

    // rotate canvas image
    const transform = `rotate(${validDegrees}deg) scale(${1 / this._scal3Fix!})`;
    const transformOrigin = `${this._imgRect.xc}px ${this._imgRect.yc}px 0`;
    canvas.style.transform = transform;
    // tslint:disable-next-line: deprecation
    canvas.style.webkitTransform = transform;
    canvas.style.transformOrigin = transformOrigin;
    // tslint:disable-next-line: deprecation
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
    this._updateMaxScale();

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

  _updateMinScale(canvas?: HTMLCanvasElement) {
    if (!canvas) {
      canvas = this._imgCanvas.nativeElement;
    }
    const config = this.config;
    const minScale = (config.extraZoomOut ? Math.min : Math.max)(
      config.width / canvas.width,
      config.height / canvas.height);
    this._minScale = minScale;
    this.minScaleChange.emit(minScale!);
  }

  private _updateMaxScale() {
    const maxScale = (this.config.width / this._primaryAreaWidth);
    this._maxScale = maxScale;
    this.maxScaleChange.emit(maxScale);
  }

  /**
   * Resize & crop image
   */
  crop(config?: ImgCropperConfig): ImgCropperEvent {
    const newConfig = config
    ? mergeDeep({ }, this.config || new ImgCropperConfig(), config) : this.config;
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
    const canvasRect = this._canvasRect();
    const scaleFix = this._scal3Fix!;
    const left = (areaRect.left - canvasRect.left) / scaleFix;
    const top = (areaRect.top - canvasRect.top) / scaleFix;
    const { output } = myConfig;
    const currentImageLoadConfig = this._currentLoadConfig!;
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
    const type = currentImageLoadConfig.originalDataURL.startsWith('http')
      ? currentImageLoadConfig.type || myConfig.type
      : myConfig.type || currentImageLoadConfig.type!;
    const dataURL = result.toDataURL(type);
    const cropEvent: ImgCropperEvent = {
      dataURL,
      type,
      name: currentImageLoadConfig.name!,
      areaWidth: this._primaryAreaWidth,
      areaHeight: this._primaryAreaHeight,
      width: result.width,
      height: result.height,
      originalDataURL: currentImageLoadConfig.originalDataURL,
      scale: this._absoluteScale!,
      rotation: this._rotation,
      left: (areaRect.left - canvasRect.left) / this._scal3Fix!,
      top: (areaRect.top - canvasRect.top) / this._scal3Fix!,
      size: currentImageLoadConfig.size!,
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

  _areaCropperRect(): DOMRect {
    return this._areaRef.nativeElement.getBoundingClientRect() as DOMRect;
  }

  _canvasRect(): DOMRect {
    return this._imgCanvas.nativeElement.getBoundingClientRect();
  }


  /** Called when the user has lifted their pointer. */
  private _pointerUp = (event: TouchEvent | MouseEvent) => {
    if (this._isSliding) {
      event.preventDefault();
      this._removeGlobalEvents();
      this._isSliding = false;
      this._startPointerEvent = null;
      this._cropIfAutoCrop();
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
 * Normalize degrees for cropper rotation
 * @docs-private
 */
export function _normalizeDegrees(n: number) {
  const de = n % 360;
  if (de % 90) {
    throw new Error(`LyCropper: Invalid \`${n}\` degree, only accepted values: 0, 90, 180, 270 & 360.`);
  }
  return de;
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

export function round(n: number) {
  return Math.round(n);
}
