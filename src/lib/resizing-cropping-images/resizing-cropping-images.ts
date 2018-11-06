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
    '& > img': {
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
  /** Original Image in base64, @deprecated use instead `originalDataURL` */
  originalBase64: string;
  /** Original Image in URL base64 */
  originalDataURL: string;
  scale: number;
  position: {
    x, y
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

  private _img: HTMLImageElement;
  private offset: {
    centerX: number
    centerY: number
    x: number
    y: number
    left: number
    top: number
  };
  private _scale: number;
  private _minScale: number;
  private _config: ImgCropperConfig;
  private _currentPosition: {
    x: number
    y: number
  };

  @ViewChild('_imgContainer') _imgContainer: ElementRef;
  @ViewChild('_croppingContainer') _croppingContainer: ElementRef;
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
    this._scale = val || 0;
    this.scaleChange.emit(this._scale);
  }

  @Output() readonly scaleChange = new EventEmitter<number>();

  /** Get min scale */
  get minScale(): number {
    return this._minScale;
  }
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
      /** set zoom scale */
      const minScale = {
        width: this.config.width / this._img.width * 100,
        height: this.config.height / this._img.height * 100
      };
      this._minScale = Math.max(minScale.width, minScale.height) / 100;
      this.fit();
    }
  }

  private _setStylesForContImg(newStyles: {
    width: string;
    height: string;
    transform: string;
  }) {
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
    this.isLoaded = false;
    this.isCropped = false;
    fileReader.addEventListener('loadend', (loadEvent) => {
      const originalImageUrl = (loadEvent.target as FileReader).result as string;
      this.setImageUrl(originalImageUrl);
      this.cd.markForCheck();
    });
    fileReader.readAsDataURL(_img.files[0]);
  }

  /** Set the size of the image, the values can be 0 between 1, where 1 is the original size */
  setScale(size: number) {
    // fix min scale
    size = size > this.minScale && size <= 1 ? size : this.minScale;
    this._scale = size;
    size = size * 100;
    const initialImg = this._img;
    const width = fixedNum(initialImg.width * size / 100);
    const height = fixedNum(initialImg.height * size / 100);
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect() as DOMRect;
    if (!this.isLoaded) {
      this._setStylesForContImg({
        width: `${width}px`,
        height: `${height}px`,
        transform: this.customCenter(width, height)
      });
    } else {
      const imgContainerRect = this._imgContainer.nativeElement.getBoundingClientRect() as DOMRect;
      this.offset = {
        centerX: 0,
        centerY: 0,
        x: (hostRect.width / 2) - (imgContainerRect.x - hostRect.x), // ✓
        y: (hostRect.height / 2) - (imgContainerRect.y - hostRect.y), // ✓
        left: imgContainerRect.left - hostRect.x, // ✓
        top: imgContainerRect.top - hostRect.y // ✓
      };
      this._setStylesForContImg({
        width: `${width}px`,
        height: `${height}px`,
      } as any);
      this._move({
        srcEvent: {},
        center: {
          x: (hostRect.width / 2 - (this.offset.x * (width / imgContainerRect.width))) + hostRect.x + this.offset.x,
          y: (hostRect.height / 2 - (this.offset.y * (height / imgContainerRect.height))) + hostRect.y + this.offset.y
        }
      });
    }
    this.scaleChange.emit(this._scale);
    this._setPosition();
    this._cropIfAutoCrop();
  }

  private customCenter(width: number, height: number) {
    const root = this.elementRef.nativeElement as HTMLElement;
    const l = (root.offsetWidth - width) / 2;
    const r = (root.offsetHeight - height) / 2;
    return `translate3d(${l}px, ${r}px, 0)`;
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
    this.setScale(result);
  }

  fit() {
    this.setScale(0);
  }

  _moveStart(event) {
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect() as DOMRect;
    const imgContainerRect = this._imgContainer.nativeElement.getBoundingClientRect() as DOMRect;
    this.offset = {
      centerX: 0,
      centerY: 0,
      x: event.center.x - imgContainerRect.x,
      y: event.center.y - imgContainerRect.y,
      left: imgContainerRect.left - hostRect.x,
      top: imgContainerRect.top - hostRect.y
    };
  }
  _move(event) {
    let x, y;
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect() as DOMRect;
    const imgContainerRect = this._imgContainer.nativeElement.getBoundingClientRect() as DOMRect;
    const croppingContainerRect = this._croppingContainer.nativeElement.getBoundingClientRect() as DOMRect;

    // Limit for left
    if (event.center.x - this.offset.x >= croppingContainerRect.x) {
      x = croppingContainerRect.x - hostRect.x;
    }
    // Limit for top
    if (event.center.y - this.offset.y >= croppingContainerRect.y) {
      y = croppingContainerRect.y - hostRect.y;
    }
    // Limit for right
    if (event.center.x - this.offset.x + imgContainerRect.width <= croppingContainerRect.x + croppingContainerRect.width) {
      x = croppingContainerRect.x - hostRect.x - imgContainerRect.width + croppingContainerRect.width;
    }
    // Limit for bottom
    if (event.center.y - this.offset.y + imgContainerRect.height <= croppingContainerRect.y + croppingContainerRect.height) {
      y = croppingContainerRect.y - hostRect.y - imgContainerRect.height + croppingContainerRect.height;
    }

    // When press shiftKey
    if (event.srcEvent && event.srcEvent.shiftKey) {
      if (Math.abs(event.deltaX) === Math.max(Math.abs(event.deltaX), Math.abs(event.deltaY))) {
        y = this.offset.top;
      } else {
        x = this.offset.left;
      }
    }
    if (x === undefined) { x = event.center.x - hostRect.x - (this.offset.x); }
    if (y === undefined) { y = event.center.y - hostRect.y - (this.offset.y); }

    this._setStylesForContImg({
      width: this._imgContainer.nativeElement.offsetWidth,
      height: this._imgContainer.nativeElement.offsetHeight,
      transform: `translate3d(${x}px, ${y}px, 0)`
    });
  }

  private _setPosition() {
    if (this.isLoaded) {
      const imgContainerRect = this._imgContainer.nativeElement.getBoundingClientRect() as DOMRect;
      const croppingContainerRect = this._croppingContainer.nativeElement.getBoundingClientRect() as DOMRect;

      this._currentPosition = {
        x: imgContainerRect.x - croppingContainerRect.x,
        y: imgContainerRect.y - croppingContainerRect.y
      };
      console.log(this._currentPosition);
    }
  }

  updatePosition(x?: number, y?: number) {
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect() as DOMRect;
    const croppingContainerRect = this._croppingContainer.nativeElement.getBoundingClientRect() as DOMRect;
    if (x === void 0) {
      x = this._currentPosition.x;
      y = this._currentPosition.y;
    }
    x += croppingContainerRect.x - hostRect.x;
    y += croppingContainerRect.y - hostRect.y;
    this._setStylesForContImg({
      width: this._imgContainer.nativeElement.offsetWidth,
      height: this._imgContainer.nativeElement.offsetHeight,
      transform: `translate3d(${x}px, ${y}px, 0)`
    });
  }

  _slideEnd(e) {
    this._setPosition();
    this._cropIfAutoCrop();
  }

  private _cropIfAutoCrop() {
    if (this.config.autoCrop && this.isLoaded) {
      this.crop();
    }
  }

  private roundNumber(num: number) {
    return Math.round(num * 100000) / 100000;
  }
  /**+ */
  zoomIn() {
    const scale = this.roundNumber(this._scale + .05);
    if (scale > 0 && scale <= 1) {
      this.setScale(scale);
    } else {
      this.setScale(1);
    }
  }

  /** Clean the img cropper */
  clean() {
    this._defaultType = null;
    this.isLoaded = false;
    this.isCropped = false;
    this._originalImgBase64 = null;
    this.cd.markForCheck();
  }

  /**- */
  zoomOut() {
    const scale = this.roundNumber(this._scale - .05);
    if (scale > this.minScale && scale <= 1) {
      this.setScale(scale);
    } else {
      this.fit();
    }
  }
  center() {
    const img = this._imgContainer.nativeElement.firstElementChild;
    const newStyles = {
      width: `${img.width}px`,
      height: `${img.height}px`,
      transform: this.customCenter(img.width, img.height)
    };
    this._setStylesForContImg(newStyles);
    this._setPosition();
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
      originalBase64: src,
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
      this.loaded.emit(cropEvent);
      this.isLoaded = true;
      this.cd.markForCheck();
      this._ngZone
          .onStable
          .pipe(take(1))
          .subscribe(() => this._ngZone.run(() => {
            this._cropIfAutoCrop();
            this._setPosition();
          }));
    });
  }

  private imageSmoothingQuality(img: HTMLCanvasElement, config, quality: number): HTMLCanvasElement {
    /** Calculate total number of steps needed */
    let  numSteps = Math.ceil(Math.log(max(img.width, img.height) / max(config.height, config.width)) / Math.log(2)) - 1;
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
    const host = this.elementRef.nativeElement.getBoundingClientRect() as ClientRect;
    const img = this._imgContainer.nativeElement.getBoundingClientRect() as ClientRect;
    const left = host.left + ((host.width - myConfig.width) / 2) - img.left;
    const top = host.top + ((host.height - myConfig.height) / 2) - img.top;
    const config = {
      width: myConfig.width,
      height: myConfig.height
    };
    canvasElement.width = config.width / this._scale;
    canvasElement.height = config.height / this._scale;
    const ctx = canvasElement.getContext('2d');
    if (myConfig.fill) {
      ctx.fillStyle = myConfig.fill;
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    }
    ctx.drawImage(this._img,
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
      originalBase64: this._originalImgBase64,
      originalDataURL: this._originalImgBase64,
      scale: this.scale,
      position: this._currentPosition
    };
    this.cropped.emit(cropEvent);
    this.isCropped = true;
    return cropEvent;
  }
}

/** @ignore */
const fixedNum = (num: number) => parseFloat(num.toFixed(0));

/** @ignore */
const max = (...values: number[]) => Math.max(...values);
