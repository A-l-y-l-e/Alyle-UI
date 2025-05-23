import {
  ElementRef,
  Input,
  Output,
  ChangeDetectorRef,
  ViewChild,
  EventEmitter,
  Renderer2,
  OnDestroy,
  NgZone,
  Inject,
  OnInit,
  AfterViewInit,
  Directive,
  booleanAttribute
} from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { resizeCanvas } from './resize-canvas';
import { ViewportRuler } from '@angular/cdk/scrolling';


const activeEventOptions = normalizePassiveListenerOptions({passive: false});
const DATA_IMAGE_SVG_PREFIX = 'data:image/svg+xml;base64,';

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
   * Zoom in until the entire image fits into the cropping area.
   * default: false
   */
  extraZoomIn?: boolean;
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
  /**
   * Pinch zoom gestures
   * Default: true
   */
  hasTouchEvents?: boolean = true;
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
   * The output image will be equal to the initial size of the cropper area.
   */
  Default,
  /** Just crop the image without resizing */
  OriginalImage
}

export enum PointerChange {
  Down,
  Up
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
  originalDataURL?: string;
  /** Accept File or Blob */
  file?: File;
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

@Directive()
export class _LyImageCropperBase implements OnInit, AfterViewInit, OnDestroy {
  static readonly и = 'LyImageCropper';
  private _currentLoadConfig?: ImgCropperLoaderConfig;

  /** Original image */
  private _img: HTMLImageElement;
  private startTransform?: {
    x: number
    y: number
    xOrigin: number
    yOrigin: number
  };
  private _scale?: number;
  private _scal3Fix?: number;
  private _minScale?: number;
  private _maxScale?: number;
  /** Initial config */
  private _initialConfig: ImgCropperConfig;
  private _config: ImgCropperConfig;
  private _imgRect: ImgRect = {} as any;
  private _rotation: number = 0;
  // private _sizeInBytes: number | null;
  private _isSliding: boolean;
  private _isMultiTouching: boolean;
  private _startCenter: { x: number, y: number };
  private _startDistance: number;
  /** Keeps track of the last pointer event that was captured by the crop area. */
  private _lastPointerEvent: MouseEvent | TouchEvent | null;
  private _startPointerEvent: {
    x: number
    y: number
  } | null;
  _initialAreaWidth: number;
  _initialAreaHeight: number;
  _areaWidthResized: number | null;
  _areaHeightResized: number | null;

  _absoluteScale: number;

  /**
   * When is loaded image
   * @internal
   */
  _isLoadedImg: boolean;
  _urlsToRevoke: string[] = [];

  /** When is loaded image & ready for crop */
  isLoaded: boolean;
  /** When the cropper is ready to be interacted  */
  isReady: boolean;
  isCropped: boolean;
  private _events = new Map<string, EventListener>();
  /** @private */
  readonly _isPointerUp = new BehaviorSubject<boolean>(true);

  @ViewChild('_cropperContainer', { static: true }) _cropperContainer: ElementRef;
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
    this._config = {...{}, ...new ImgCropperConfig(), ...val};
    this._initialConfig = {...{}, ...this._config};
    this._initialAreaWidth = this.config.width;
    this._initialAreaHeight = this.config.height;
    if (
      this._config.round
      && this.config.width !== this.config.height
    ) {
      throw new Error(`${_LyImageCropperBase.и}: Both width and height must be equal when using \`ImgCropperConfig.round = true\``);
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
  private _rotateTimeOut: any;
  private _pendingRotation = 0;
  protected areaGridActiveCssClass = '';

  constructor(
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
    this._isPointerUp.subscribe((UP) => {
      if (!this.areaGridActiveCssClass) {
        return;
      }
      if (UP) {
        this._renderer.removeClass(this._elementRef.nativeElement, this.areaGridActiveCssClass);
      } else {
        this._renderer.addClass(this._elementRef.nativeElement, this.areaGridActiveCssClass);
      }
    });
  }

  ngOnInit() {
    this._ngZone.runOutsideAngular(() => {
      const element = this._imgContainer.nativeElement;
      element.addEventListener('mousedown', this._pointerDown, activeEventOptions);
      element.addEventListener('touchstart', this._pointerDown, activeEventOptions);
    });
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
    const element = this._imgContainer.nativeElement;
    this._lastPointerEvent = null;
    this._removeGlobalEvents();
    element.removeEventListener('mousedown', this._pointerDown, activeEventOptions);
    element.removeEventListener('touchstart', this._pointerDown, activeEventOptions);
    this._removeEventsToScaleWithScroll();
  }

  /** Load image with canvas */
  // private _imgLoaded(imgElement: HTMLImageElement) {
  //   if (imgElement) {
  //     this._img = imgElement;
  //     const canvas = this._imgCanvas.nativeElement;
  //     canvas.width = imgElement.width;
  //     canvas.height = imgElement.height;
  //     const ctx = canvas.getContext('2d')!;
  //     ctx.clearRect(0, 0, imgElement.width, imgElement.height);
  //     ctx.drawImage(imgElement, 0, 0);

  //     /** set min scale */
  //     this._updateMinScale(canvas);
  //     this._updateMaxScale();
  //   }
  // }

    /** Load image with canvas */
  private _loadImageToCanvas(imgElement: HTMLImageElement) {
    if (imgElement) {
      this._img = imgElement;
      const canvas = this._imgCanvas.nativeElement;
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, imgElement.width, imgElement.height);
      ctx.drawImage(imgElement, 0, 0);
    }
  }


  private _setStylesForContImg(values: {
    x?: number, y?: number
  }) {
    const newStyles = { } as any;
    if (values.x != null && values.y != null) {
      const rootRect = this._cropperContainerRect();
      const x = rootRect.width / 2 - (values.x);
      const y = rootRect.height / 2 - (values.y);

      this._imgRect.x = (values.x);
      this._imgRect.y = (values.y);
      this._imgRect.xc = (x);
      this._imgRect.yc = (y);

    }

    newStyles.transform = `translate3d(${(this._imgRect.x)}px,${(this._imgRect.y)}px, 0)`;
    newStyles.transform += ` scale(${this._scal3Fix})`;
    newStyles.transform += ` rotate(0)`;
    newStyles.transformOrigin = `${this._imgRect.xc}px ${this._imgRect.yc}px 0`;
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
    this.clean();
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
            originalDataURL,
            file: _img.files![0]
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
    // const newSize = size! >= this.minScale! && size! <= 1 ? size : this.minScale;
    const newSize = (size! >= this.minScale!) ? size : this.minScale;


    // check
    const changed = size != null && size !== this.scale && newSize !== this.scale;
    this._scale = size;
    if (!changed) {
      return;
    }
    this._scal3Fix = newSize;
    this._updateAbsoluteScale();
    // this._updateMinScale();
    // this._updateMaxScale(); // TODO: check this
    if (this.isLoaded) {
      if (changed) {
        const originPosition = {...this._imgRect};
        this.startTransform = {
          x: originPosition.x,
          y: originPosition.y,
          xOrigin: originPosition.xc,
          yOrigin: originPosition.yc
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
    const root = this._cropperContainer.nativeElement as HTMLElement;
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
    const container = this._cropperContainer.nativeElement as HTMLElement;
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
    this._isPointerUp.next(false);
    if (isTouchEvent(event)) {
      if (event.touches.length === 2) {
        this._isMultiTouching = isTouchEvent(event);
  
        // Calculate where the fingers have started on the X and Y axis
        this._startCenter = getCenterFromTouchEvent(event);
        this._startDistance = calDistanceFromTouchEvent(event);
      }
    }
    // Don't do anything if the
    // user is using anything other than the main mouse button.
    if (this._isSliding || (!isTouchEvent(event) && event.button !== 0)) {
      return;
    }

    this._ngZone.run(() => {
      

      this._isSliding = true;

      this.startTransform = {
        x: this._imgRect.x,
        y: this._imgRect.y,
        xOrigin: this._imgRect.xc,
        yOrigin: this._imgRect.yc
      };
      this._lastPointerEvent = event;
      this._startPointerEvent = getGesturePointFromEvent(event);
      event.preventDefault(); // Prevent page scroll
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
      let scaleFix = this._scal3Fix;
      const config = this.config;
      const startP = this.startTransform;
      if (!scaleFix || !startP) {
        return;
      }
      const point = getGesturePointFromEvent(event);
      let deltaX = 0;
      let deltaY = 0;
      const imgContainer = this._imgCanvas.nativeElement;
      /** Main image width */
      const imgWidth = imgContainer.width;
      /** Main image height */
      const imgHeight = imgContainer.height;

      if (this._isMultiTouching) {
        const newScale = calDistanceFromTouchEvent(event as TouchEvent) / this._startDistance * this._scale!;
        scaleFix = this._scal3Fix = Math.max(newScale, this.minScale!);
        const center = getCenterFromTouchEvent(event as TouchEvent);
        deltaX = center.x - this._startCenter.x;
        deltaY = center.y - this._startCenter.y;
      } else {
        deltaX = point.x - this._startPointerEvent!.x;
        deltaY = point.y - this._startPointerEvent!.y;
      }

      if (!scaleFix || !startP) {
        return;
      }

      const isMinScaleX = imgWidth * scaleFix < config.width && config.extraZoomOut;
      const isMinScaleY = imgHeight * scaleFix < config.height && config.extraZoomOut;

      const limitLeft = (config.width / 2 / scaleFix) >= startP.xOrigin - (deltaX / scaleFix);
      const limitRight = (config.width / 2 / scaleFix) + (imgWidth) - (startP.xOrigin - (deltaX / scaleFix)) <= config.width / scaleFix;
      const limitTop = ((config.height / 2 / scaleFix) >= (startP.yOrigin - (deltaY / scaleFix)));
      const limitBottom = (
        ((config.height / 2 / scaleFix) + (imgHeight) - (startP.yOrigin - (deltaY / scaleFix))) <= (config.height / scaleFix)
      );

      // Limit for left
      if ((limitLeft && !isMinScaleX) || (!limitLeft && isMinScaleX)) {
        x = startP.x + (startP.xOrigin) - (config.width / 2 / scaleFix);
      }

      // Limit for right
      if ((limitRight && !isMinScaleX) || (!limitRight && isMinScaleX)) {
        x = startP.x + (startP.xOrigin) + (config.width / 2 / scaleFix) - imgWidth;
      }

      // Limit for top
      if ((limitTop && !isMinScaleY) || (!limitTop && isMinScaleY)) {
        y = startP.y + (startP.yOrigin) - (config.height / 2 / scaleFix);
      }

      // Limit for bottom
      if ((limitBottom && !isMinScaleY) || (!limitBottom && isMinScaleY)) {
        y = startP.y + (startP.yOrigin) + (config.height / 2 / scaleFix) - imgHeight;
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
        x, y,
      });
    }
  }


  updatePosition(): void;
  updatePosition(xOrigin: number, yOrigin: number): void;
  updatePosition(xOrigin?: number, yOrigin?: number) {
    const hostRect = this._cropperContainerRect();
    const areaRect = this._areaCropperRect();
    const areaWidth = Math.min(areaRect.width, hostRect.width);
    const areaHeight = Math.min(areaRect.height, hostRect.height);
    let x: number, y: number;
    if (xOrigin == null && yOrigin == null) {
      xOrigin = this._imgRect.xc;
      yOrigin = this._imgRect.yc;
    }
    x = Math.max((areaRect.left - hostRect.left), 0);
    y = Math.max(0, (areaRect.top - hostRect.top));
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
    const scalePercent = this._calcScalePercent(this._scal3Fix!, this._minScale!, this._maxScale!);
    const newScale = scalePercent < 20 ? ((this._scal3Fix! * this._imgCanvas.nativeElement.width + 50)
      / (this._imgCanvas.nativeElement.width)) : (this._scal3Fix! + .05);

    if (newScale > this.minScale! && newScale <= this._maxScale!) {
      this.setScale(newScale);
    } else {
      this.setScale(this._maxScale!);
    }
  }

  private _calcScalePercent(num: number, min: number, max: number) {
    return ((num - min) / (max - min)) * 100;
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
      this.startTransform = undefined;
      this.scale = undefined as any;
      this._scal3Fix = undefined;
      this._rotation = 0;
      this._minScale = undefined;
      this._isLoadedImg = false;
      this.isLoaded = false;
      this.isCropped = false;
      this._currentLoadConfig = undefined;
      this.config = this._initialConfig;
      const canvas = this._imgCanvas.nativeElement;
      canvas.width = 0;
      canvas.height = 0;
      this.cleaned.emit(null!);
      this.cd.markForCheck();
    }
  }

  /** - */
  zoomOut() {
    const scalePercent = this._calcScalePercent(this._scal3Fix!, this._minScale!, this._maxScale!);
    const newScale = scalePercent < 20 ? ((this._scal3Fix! * this._imgCanvas.nativeElement.width - 50)
      / (this._imgCanvas.nativeElement.width)) : (this._scal3Fix! - .05);
    if (newScale > this.minScale! && newScale <= this._maxScale!) {
      this.setScale(newScale);
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
    if (!src) {
      const err: ImgCropperErrorEvent = {
        name: _config.name!,
        error: ImgCropperError.Other,
        type: _config.type!,
        size: _config.size!
      };
      this.error.emit(err);
      return;
    }
    this._initialAreaWidth = this._initialConfig.width;
    this._initialAreaHeight = this._initialConfig.height;
    if (_config.areaWidth && _config.areaHeight) {
      this.config.width = _config.areaWidth;
      this.config.height = _config.areaHeight;
    }
    if (_config.originalDataURL && isSvgImage(_config.originalDataURL)) {
      src = normalizeSVG(_config.originalDataURL);
    }

    
    const cropEvent = { ..._config } as ImgCropperEvent;
    
    new Promise((resolve: (value: HTMLImageElement) => void, reject) => {
      const img = createHtmlImg(src!);
      this._ngZone.runOutsideAngular(() => {
        img.onerror = err => reject(err);
        img.onabort = err => reject(err);
        img.onload = () => resolve(img);
      });
    })
    .then(
      (img) => {
        this._loadImageToCanvas(img);
        this._updateMinScale(img);
        this._updateMaxScale();
        this._isLoadedImg = true;
        this.imageLoaded.emit(cropEvent);
        this.cd.markForCheck();
        Promise.resolve(null).then(() => {
          setTimeout(() => {
            this._ngZone.run(() => {this._positionImg(cropEvent, fn)});
          });
        });
      },
      () => {
        const err: ImgCropperErrorEvent = {
          name: _config.name!,
          error: ImgCropperError.Type,
          type: _config.type!,
          size: _config.size!
        };
        this.error.emit(err);
      }
    );
  }

  private _updateAreaIfNeeded() {
    if (!this._config.responsiveArea) return;

    const rootRect = this._cropperContainerRect();
    const areaRect = this._areaCropperRect();
    const { minWidth = 1, minHeight = 1, round } = this.config;

    // Calculate maximum dimensions allowed for the area
    const maxWidth = Math.max(rootRect.width, minWidth);
    const maxHeight = Math.max(rootRect.height, minHeight);

    let newWidth = areaRect.width;
    let newHeight = areaRect.height;

    if (round) {
        newWidth = newHeight = Math.min(maxWidth, maxHeight); // Área cuadrada si round es true
    } else {
        const shouldResizeWidth = (
          areaRect.width > maxWidth
          || areaRect.width < this._initialAreaWidth
          || this._areaWidthResized
        );
        const shouldResizeHeight = (
          areaRect.height > maxHeight
          || areaRect.height < this._initialAreaHeight
          || this._areaHeightResized
        );
        
        let posibleWidth_w = 0;
        let posibleWidth_h = 0;
        let posibleHeight_h = 0;
        let posibleHeight_w = 0;

        if (shouldResizeWidth) {
          newWidth = posibleWidth_w = Math.min(maxWidth, this._areaWidthResized || this._initialAreaWidth);
          newHeight = posibleWidth_h = (newWidth * areaRect.height) / areaRect.width;
        }

        if (shouldResizeHeight) {
          newHeight = posibleHeight_h = Math.min(maxHeight, this._areaHeightResized || this._initialAreaHeight);
          newWidth = posibleHeight_w = (newHeight * areaRect.width) / areaRect.height;
        }

        if (shouldResizeHeight && shouldResizeWidth) {
          if (Math.min(posibleWidth_w, posibleWidth_h) < Math.min(posibleHeight_h, posibleHeight_w)) {
            newWidth = posibleWidth_w;
            newHeight = posibleWidth_h;
          } else {
            newHeight = posibleHeight_h;
            newWidth = posibleHeight_w;
          }
        }
    }

    // Apply changes if dimensions have changed
    if (newWidth !== this.config.width || newHeight !== this.config.height) {
      const newScale = (this._scal3Fix! * newWidth) / areaRect.width;
      this.config.width = newWidth;
      this.config.height = newHeight;
      this._updateMinScale();
      this._updateMaxScale();
      this.setScale(newScale, true);
      this._markForCheck(); 
    }
  }

  /**
   * @private
   */
  _updateAbsoluteScale() {
    const scale = this._scal3Fix! / (this.config.width / this._initialAreaWidth);
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
      // this.rotate(loadConfig.rotation || 0);
      this._updateAreaIfNeeded();
      this._markForCheck();
      this._ngZone.runOutsideAngular(() => {
        Promise.resolve(null).then(() => {
          if (loadConfig.xOrigin != null && loadConfig.yOrigin != null) {
            this.updatePosition(loadConfig.xOrigin, loadConfig.yOrigin);
          }
          this._updateAreaIfNeeded();
          this.isLoaded = true;
          this._cropIfAutoCrop();
          this._ngZone.run(() => {
            this._markForCheck();
            this.ready.emit(cropEvent);
            if (this.config.hasTouchEvents) {
              this._addEventsToScaleWithScroll();
            } else {
              this._removeEventsToScaleWithScroll()
            }
            // tslint:disable-next-line: deprecation
            this.loaded.emit(cropEvent);
          });
        });
      });
    }
  }

  rotate2(degrees: number) {
    this._rotation -= degrees;
    const newStyles = {} as any;
    newStyles.transform = `translate(${(this._imgRect.x)}px,${(this._imgRect.y)}px)`;
    newStyles.transform += ` scale(${this._scal3Fix})`;
    newStyles.transform += ` rotate(${this._rotation}deg)`;
    newStyles.transformOrigin = `${this._imgRect.xc}px ${this._imgRect.yc}px 0`;
    for (const key in newStyles) {
      if (newStyles.hasOwnProperty(key)) {
        this._renderer.setStyle(this._imgContainer.nativeElement, key, newStyles[key]);
      }
    }
  }

  rotate(degrees: number) {
    _normalizeDegrees(degrees)
    const newRotation = this._rotation + degrees;
    clearTimeout(this._rotateTimeOut);
    this._pendingRotation += degrees;
    this._rotation = newRotation;
    this._rotateWithAnimation();
    this._rotateTimeOut = setTimeout(() => {
      this._setStylesForContImg({});
      this._rotateCanvas();
    }, 140);
  }

  private _rotateWithAnimation() {

    const newStyles = {} as any;
    // easeOutQuad
    newStyles.transition = `cubic-bezier(0.250, 0.460, 0.450, 0.940) 140ms`;
    newStyles.transform = `translate(${(this._imgRect.x)}px,${(this._imgRect.y)}px)`;
    newStyles.transform += ` scale(${this._scal3Fix})`;
    newStyles.transform += ` rotate(${this._pendingRotation}deg)`;
    newStyles.transformOrigin = `${this._imgRect.xc}px ${this._imgRect.yc}px 0`;
    for (const key in newStyles) {
      if (newStyles.hasOwnProperty(key)) {
        this._renderer.setStyle(this._imgContainer.nativeElement, key, newStyles[key]);
      }
    }
  }


  private _rotateCanvas() {
    let validDegrees = this._pendingRotation;
        
    const degreesRad = validDegrees * Math.PI / 180;
    const canvas = this._imgCanvas.nativeElement;
    canvas.removeAttribute('style');
    this._pendingRotation = 0;
    this._renderer.removeStyle(this._imgContainer.nativeElement, 'transition');
    const canvasClon = createCanvasImg(canvas);
    const ctx = canvas.getContext('2d')!;

    // clear
    ctx.clearRect(0, 0, canvasClon.width, canvasClon.height);

    // rotate canvas image
    const transform = `rotate(${validDegrees}deg) scale(${1 / this._scal3Fix!})`;
    const transformOrigin = `${this._imgRect.xc}px ${this._imgRect.yc}px 0`;
    canvas.style.transform = transform;
    canvas.style.opacity = '0';
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

    const rootRect = this._cropperContainerRect();

    this._setStylesForContImg({
      x: (left - rootRect.left),
      y: (top - rootRect.top)
    });

    // keep image inside the frame
    const originPosition = {...this._imgRect};
    this.startTransform = {
      x: originPosition.x,
      y: originPosition.y,
      xOrigin: originPosition.xc,
      yOrigin: originPosition.yc
    };
    this._setStylesForContImg({});
    this._simulatePointerMove();

    this._cropIfAutoCrop();
  }

  _updateMinScale(canvas?: HTMLCanvasElement | HTMLImageElement) {
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

  /**
   * @private
   */
  _updateMaxScale() {
    const maxScale = (this.config.width / this._initialAreaWidth) * 3;
    this._maxScale = maxScale;
    this.maxScaleChange.emit(maxScale);
  }

  /**
   * Resize & crop image
   */
  crop(config?: ImgCropperConfig): ImgCropperEvent {
    const newConfig = config
    ? {...{ }, ...(this.config || new ImgCropperConfig()), ...config} : this.config;
    // this._loadImageToCanvas(this._mainImage.nativeElement);
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
    // crop
    ctx.drawImage(this._imgCanvas.nativeElement,
      -(left), -(top),
    );

    const result = canvasElement;
    // TODO: check if the image to be sized is smaller than the crop area
    if (myConfig.output === ImgResolution.Default) {
      const areaWidth = this._areaWidthResized ?? this._initialConfig.width;
      const areaHeight = this._areaHeightResized ?? this._initialConfig.height;
      resizeCanvas(
        result,
        areaWidth,
        areaHeight);
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
    const type = currentImageLoadConfig.originalDataURL?.startsWith('http')
      ? currentImageLoadConfig.type || myConfig.type
      : myConfig.type || currentImageLoadConfig.type!;
    const dataURL = result.toDataURL(type);
    const cropEvent: ImgCropperEvent = {
      dataURL,
      type,
      name: currentImageLoadConfig.name!,
      areaWidth: this._initialAreaWidth,
      areaHeight: this._initialAreaHeight,
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

  // _rootRect(): DOMRect {
  //   return this._elementRef.nativeElement.getBoundingClientRect() as DOMRect;
  // }

  _cropperContainerRect(): DOMRect {
    return this._cropperContainer.nativeElement.getBoundingClientRect() as DOMRect;
  }

  _areaCropperRect(): DOMRect {
    return this._areaRef.nativeElement.getBoundingClientRect() as DOMRect;
  }

  _canvasRect(): DOMRect {
    return this._imgCanvas.nativeElement.getBoundingClientRect();
  }

  // _mainImageRect(): DOMRect {
  //   return this._mainImage.nativeElement.getBoundingClientRect();
  // }


  /** Called when the user has lifted their pointer. */
  private _pointerUp = (event: TouchEvent | MouseEvent) => {
    this._isPointerUp.next(true);
    if (this._isSliding) {
      event.preventDefault();
      this._removeGlobalEvents();
      this._isSliding = false;
      this._isMultiTouching = false;
      this._startPointerEvent = null;
      this._scale = this._scal3Fix;
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

  private _addEventsToScaleWithScroll() {
    if (!this._events.has('wheel')) {
      this._events.set('wheel', this._onWheel);
      this._ngZone.runOutsideAngular(() => {
        const element = this._elementRef!.nativeElement;
        element.addEventListener('wheel', this._onWheel, activeEventOptions);
      });
    }
  }
  private _removeEventsToScaleWithScroll() {
    if (this._events.has('wheel')) {
      this._events.delete('wheel');
      const host = this._elementRef.nativeElement;
      host.removeEventListener('wheel', this._onWheel, activeEventOptions);
    }
  }

  private _onWheel = (event: WheelEvent) => {
    if (!this.isLoaded) {
      return;
    }
    event.preventDefault();
    this._ngZone.run(() => {
      if (Math.sign(event.deltaY) < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    });

  }

  /** Use defaultView of injected document if available or fallback to global window reference */
  private _getWindow(): Window {
    return this._document.defaultView || window;
  }

}

/**
 * @dynamic
 */
@Directive()
export class _LyCropperAreaBase implements OnDestroy {

  private _isSliding: boolean;
  /** Keeps track of the last pointer event that was captured by the crop area. */
  private _lastPointerEvent: MouseEvent | TouchEvent | null;
  private _startPointerEvent: {
    x: number
    y: number
  } | null;
  private _currentWidth: number | null;
  private _currentHeight: number | null;
  private _startAreaRect: DOMRect;
  private _startImgRect: DOMRect;

  /** Used to subscribe to global move and end events */
  protected _document: Document;

  @ViewChild('resizer') readonly _resizer?: ElementRef;

  @Input()
  set resizableArea(val: boolean) {
    if (val !== this._resizableArea) {
      this._resizableArea = val;
      Promise.resolve(null).then(() => {
        if (val) {
          this._removeResizableArea();
          this._addResizableArea();
        } else {
          this._removeResizableArea();
        }
      });
    }
  }
  get resizableArea() {
    return this._resizableArea;
  }
  private _resizableArea: boolean;
  @Input() keepAspectRatio: boolean;
  @Input()
  @Input({ transform: booleanAttribute }) round: boolean;
  // @Style<boolean, LyCropperArea>(
  //   (_value, _media) => ({ after }, selectors: SelectorsFn) => {
  //     const $$ = selectors(STYLES);
  //     return lyl `{
  //       border-radius: 50%
  //       ${$$.resizer} {
  //         ${after}: ${pos}%
  //         bottom: ${pos}%
  //         transform: translate(4px, 4px)
  //       }
  //       ${$$.grid} {
  //         border-radius: 50%
  //         overflow: hidden
  //       }
  //     }`;
  //   },
  //   coerceBooleanProperty
  // ) round: BooleanInput;

  constructor(
    readonly _elementRef: ElementRef,
    private _ngZone: NgZone,
    readonly _cropper: _LyImageCropperBase,
    @Inject(DOCUMENT) _document: any,
  ) {
    this._document = _document;
  }

  ngOnDestroy() {
    this._removeResizableArea();
  }

  private _addResizableArea() {
    this._ngZone.runOutsideAngular(() => {
      const element = this._resizer!.nativeElement;
      element.addEventListener('mousedown', this._pointerDown, activeEventOptions);
      element.addEventListener('touchstart', this._pointerDown, activeEventOptions);
    });
  }

  private _removeResizableArea() {
    const element = this._resizer?.nativeElement;
    if (element) {
      this._lastPointerEvent = null;
      this._removeGlobalEvents();
      element.removeEventListener('mousedown', this._pointerDown, activeEventOptions);
      element.removeEventListener('touchstart', this._pointerDown, activeEventOptions);
    }
  }

  private _pointerDown = (event: MouseEvent | TouchEvent) => {
    this._cropper._isPointerUp.next(false);
    // Don't do anything if the
    // user is using anything other than the main mouse button.
    if (this._isSliding || (!isTouchEvent(event) && event.button !== 0)) {
      return;
    }

    event.preventDefault();

    this._ngZone.run(() => {
      this._isSliding = true;
      this._lastPointerEvent = event;
      this._startPointerEvent = getGesturePointFromEvent(event);
      this._startAreaRect = this._cropper._areaCropperRect();
      this._startImgRect = this._cropper._canvasRect();
      this._bindGlobalEvents(event);
    });

  }

  private _pointerMove = (event: MouseEvent | TouchEvent) => {
    if (this._isSliding) {
      event.preventDefault();
      this._lastPointerEvent = event;
      const element: HTMLDivElement = this._elementRef.nativeElement;
      const { width, height, minWidth, minHeight } = this._cropper.config;
      const point = getGesturePointFromEvent(event);
      const deltaX = point.x - this._startPointerEvent!.x;
      const deltaY = point.y - this._startPointerEvent!.y;
      const startAreaRect = this._startAreaRect;
      const startImgRect = this._startImgRect;
      const round = this.round;
      const keepAspectRatio = this._cropper.config.keepAspectRatio || event.shiftKey;
      let newWidth = 0;
      let newHeight = 0;
      const rootRect = this._cropper._cropperContainerRect();

      if (round) {
        // The distance from the center of the cropper area to the pointer
        const originX = ((width / 2 / Math.sqrt(2)) + deltaX);
        const originY = ((height / 2 / Math.sqrt(2)) + deltaY);

        // Leg
        const side = Math.sqrt(originX ** 2 + originY ** 2);
        newWidth = newHeight = side * 2;

      } else if (keepAspectRatio) {
        newWidth = width + deltaX * 2;
        newHeight = height + deltaY * 2;
        if (width !== height) {
          if (width > height) {
            newHeight = height / (width / newWidth);
          } else if (height > width) {
            newWidth = width / (height / newHeight);
          }
        } else {
          newWidth = newHeight = Math.max(newWidth, newHeight);
        }
      } else {
        newWidth = width + deltaX * 2;
        newHeight = height + deltaY * 2;
      }

      // To min width
      if (newWidth < minWidth!) {
        newWidth = minWidth!;
      }
      // To min height
      if (newHeight < minHeight!) {
        newHeight = minHeight!;
      }

      // Do not overflow the cropper area
      const centerX = startAreaRect.x + startAreaRect.width / 2;
      const centerY = startAreaRect.y + startAreaRect.height / 2;
      const topOverflow = startImgRect.y > centerY - (newHeight / 2);
      const bottomOverflow = centerY + (newHeight / 2) > startImgRect.bottom;
      const minHeightOnOverflow = Math.min((centerY - startImgRect.y) * 2, (startImgRect.bottom - centerY) * 2);
      const leftOverflow = startImgRect.x > centerX - (newWidth / 2);
      const rightOverflow = centerX + (newWidth / 2) > startImgRect.right;
      const minWidthOnOverflow = Math.min((centerX - startImgRect.x) * 2, (startImgRect.right - centerX) * 2);
      const minOnOverflow = Math.min(minWidthOnOverflow, minHeightOnOverflow);
      if (round) {
        if (topOverflow || bottomOverflow || leftOverflow || rightOverflow) {
          newHeight = newWidth = minOnOverflow;
        }
      } else if (keepAspectRatio) {
        const newNewWidth: number[] = [];
        const newNewHeight: number[] = [];
        if ((topOverflow || bottomOverflow)) {
          newHeight = minHeightOnOverflow;
          newNewHeight.push(newHeight);
          newWidth = width / (height / minHeightOnOverflow);
          newNewWidth.push(newWidth);
        }
        if ((leftOverflow || rightOverflow)) {
          newWidth = minWidthOnOverflow;
          newNewWidth.push(newWidth);
          newHeight = height / (width / minWidthOnOverflow);
          newNewHeight.push(newHeight);
        }
        if (newNewWidth.length === 2) {
          newWidth = Math.min(...newNewWidth);
        }
        if (newNewHeight.length === 2) {
          newHeight = Math.min(...newNewHeight);
        }
      } else {
        if (topOverflow || bottomOverflow) {
          newHeight = minHeightOnOverflow;
        }
        if (leftOverflow || rightOverflow) {
          newWidth = minWidthOnOverflow;
        }
      }

      // Do not overflow the container
      if (round) {
        const min = Math.min(rootRect.width, rootRect.height);
        if (newWidth > min) {
          newWidth = newHeight = min;
        } else if (newHeight > min) {
          newWidth = newHeight = min;
        }
      } else if (keepAspectRatio) {
        if (newWidth > rootRect.width) {
          newWidth = rootRect.width;
          newHeight = height / (width / rootRect.width);
        }
        if (newHeight > rootRect.height) {
          newWidth = width / (height / rootRect.height);
          newHeight = rootRect.height;
        }
      } else {
        if (newWidth > rootRect.width) {
          newWidth = rootRect.width;
        }
        if (newHeight > rootRect.height) {
          newHeight = rootRect.height;
        }
      }


      // round values
      const newWidthRounded = Math.round(newWidth);
      const newHeightRounded = Math.round(newHeight);

      element.style.width = `${newWidthRounded}px`;
      element.style.height = `${newHeightRounded}px`;
      this._currentWidth = newWidthRounded;
      this._currentHeight = newHeightRounded;
    }
  }

  /** Called when the user has lifted their pointer. */
  private _pointerUp = (event: TouchEvent | MouseEvent) => {
    this._cropper._isPointerUp.next(true);
    const hasChange = this._currentWidth !== this._cropper._initialAreaWidth
      || this._currentHeight !== this._cropper._initialAreaHeight;

    if (this._isSliding && (this._currentWidth != null)) {
      event.preventDefault();
      this._removeGlobalEvents();
      this._cropper._areaWidthResized = hasChange ? this._currentWidth : null;
      this._cropper._areaHeightResized = hasChange ? this._currentHeight : null;
      // this._cropper._initialAreaWidth =
      this._cropper.config.width = this._currentWidth!;
      // this._cropper._initialAreaHeight =
      this._cropper.config.height = this._currentHeight!;
      this._cropper._updateMinScale();
      this._cropper._updateMaxScale();
      this._cropper._updateAbsoluteScale();
      this._isSliding = false;
      this._startPointerEvent = null;
      this._currentWidth = null;
      this._currentHeight = null;
      this._cropper._markForCheck();
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
    // const result = DATA_IMAGE_SVG_PREFIX + window.btoa(span.innerHTML);
    document.body.removeChild(span);
    const blob = new Blob([span.innerHTML], {type: 'image/svg+xml'});
    return URL.createObjectURL(blob);
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

// Calculate distance between two fingers
function calDistanceFromTouchEvent(event: TouchEvent) {
  return Math.hypot(event.touches[0].clientX - event.touches[1].clientX, event.touches[0].clientY - event.touches[1].clientY);
};

function getCenterFromTouchEvent(event: TouchEvent) {
  const x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
  const y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
  return { x, y }
}
