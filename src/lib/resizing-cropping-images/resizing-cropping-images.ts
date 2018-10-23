import {
  Component,
  ElementRef,
  Input,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  AfterContentInit,
  EventEmitter,
  Renderer2
} from '@angular/core';
import { LyTheme2, mergeDeep } from '@alyle/ui';

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
    boxShadow: '0 0 0 20000px rgba(0, 0, 0, 0.29)',
    '&::after': {
      content: `''`,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      border: 'solid 2px rgb(255, 255, 255)'
    }
  },
  croppContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    '& *:not(input)': {
      pointerEvents: 'none'
    },
    '& > input': {
      position: 'absolute',
      background: 'transparent',
      opacity: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%'
    }
  }
});

export interface LyResizingCroppingImagesConfig {
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
  output?: {
    width: number;
    height: number;
  } | ImageResolution | ImgResolution;
}
export type ImgCropperConfig = LyResizingCroppingImagesConfig;
export enum ImgResolution {
  /** Resizing & cropping */
  Default,
  /** Only cropping */
  OriginalImage
}
/** @deprecated, use `ImgResolution` instead */
export enum ImageResolution {
  /** Resizing & cropping */
  Default,
  /** Only cropping */
  OriginalImage
}

/** @deprecated, use `ImgCropperEvent` instead */
export type CroppedImage = ImgCropperEvent;
export interface ImgCropperEvent {
  /** @deprecated, use `base64` instead */
  base64Image: string;
  base64: string;
  name: string;
  type: string;
}
export interface ImageState {
  isLoaded: boolean;
  isCrop: boolean;
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
  selector: 'ly-cropping',
  templateUrl: './resizing-cropping-images.html'
 })
export class LyResizingCroppingImages implements AfterContentInit {
  classes = this.theme.addStyleSheet(styles, STYLE_PRIORITY);
  result: string;
  private _fileName: string;

  private _img: HTMLImageElement;
  private offset: {x: number, y: number, left: number, top: number};
  private scale: number;
  private _config: ImgCropperConfig;

  @ViewChild('_imgContainer') imgContainer: ElementRef;
  @ViewChild('_croppingContainer') croppingContainer: ElementRef;
  /** @deprecated */
  @Input() src: string;
  @Input()
  set config(val: ImgCropperConfig) {
    this._config = mergeDeep({}, CONFIG_DEFAULT, val);
  }
  get config() {
    return this._config;
  }
  isLoaded: boolean;
  isCropped: boolean;

  /** On loaded new image */
  @Output() loaded = new EventEmitter<void>();
  /** On crop new image */
  @Output() cropped = new EventEmitter<ImgCropperEvent>();
  /** issues an error when the loaded image is not valid */
  @Output() error = new EventEmitter<ImgCropperEvent>();

  private defaultType: string;
  private zoomScale = .1;
  constructor(
    private _renderer: Renderer2,
    private theme: LyTheme2,
    private elementRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef
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
      this.zoomScale = Math.max(minScale.width, minScale.height) / 100;
      this.fit();
      this.cd.markForCheck();
    }
  }

  private _setPositonForImg(newStyles: {
    width: string;
    height: string;
    transform: string;
  }) {
    for (const key in newStyles) {
      if (newStyles.hasOwnProperty(key)) {
        this._renderer.setStyle(this.imgContainer.nativeElement, key, newStyles[key]);
      }
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
    this.defaultType = null;
    if (!this.config.type) {
      this.defaultType = _img.files[0].type;
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
  setScale(size: number) {
    this.scale = size;
    size = size * 100;
    const initialImg = this._img;
    const width = fixedNum(initialImg.width * size / 100);
    const height = fixedNum(initialImg.height * size / 100);
    this._setPositonForImg({
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

  '1:1'() {
    this.setScale(1);
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
    const minScale = {
      width: this.config.width / this._img.width * 100,
      height: this.config.height / this._img.height * 100
    };
    this.setScale(Math.max(minScale.width, minScale.height) / 100);
  }

  _moveStart(event) {
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect() as DOMRect;
    const imgContainerRect = this.imgContainer.nativeElement.getBoundingClientRect();
    this.offset = {
      x: event.center.x - imgContainerRect.x,
      y: event.center.y - imgContainerRect.y,
      left: (imgContainerRect as ClientRect).left - hostRect.x,
      top: (imgContainerRect as ClientRect).top - hostRect.y
    };
  }
  _move(event) {
    let x, y;
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect() as DOMRect;
    const imgContainerRect = this.imgContainer.nativeElement.getBoundingClientRect() as DOMRect;
    const croppingContainerRect = this.croppingContainer.nativeElement.getBoundingClientRect() as DOMRect;

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
    if (event.srcEvent.shiftKey) {
      if (Math.abs(event.deltaX) === Math.max(Math.abs(event.deltaX), Math.abs(event.deltaY))) {
        y = this.offset.top;
      } else {
        x = this.offset.left;
      }
    }
    if (x === undefined) { x = event.center.x - hostRect.x - (this.offset.x); }
    if (y === undefined) { y = event.center.y - hostRect.y - (this.offset.y); }

    this._setPositonForImg({
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
    const scale = this.roundNumber(this.scale + .05);
    if (scale > 0 && scale <= 1) {
      this.setScale(scale);
    } else {
      this.setScale(1);
    }
  }
  /**- */
  zoomOut() {
    const scale = this.roundNumber(this.scale - .05);
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
    const newStyles = {
      width: `${img.width}px`,
      height: `${img.height}px`,
      transform: this.customCenter(img.width, img.height)
    };
    this._setPositonForImg(newStyles);
  }
  setImageUrl(src: string) {
    this.src = src;
    if (!src) { return; }
    const img = new Image;
    img.src = src;
    img.addEventListener('error', (err) => {
      this.error.emit({
        name: this._fileName,
        type: null,
        base64: null,
        base64Image: null
      });
    });
    img.addEventListener('load', () => {
      this._imgLoaded(img);
      this.loaded.emit(null);
      this.isLoaded = true;
      this.cd.markForCheck();
    });
  }
  private max(...values: number[]) {
    return Math.max(...values);
  }

  private imageSmoothingQuality(img: HTMLCanvasElement, config, quality: number): HTMLCanvasElement {
    /** Calculate total number of steps needed */
    let  numSteps = Math.ceil(Math.log(this.max(img.width, img.height) / this.max(config.height, config.width)) / Math.log(2)) - 1;
    numSteps = numSteps <= 0 ? 0 : numSteps;

    /**Array steps */
    const steps = Array.from(Array(numSteps).keys());

    /** Context */
    const octx = img.getContext('2d');

    const q = Math.pow(quality * 10, numSteps) / Math.pow(10, numSteps);

    /** If Steps => imageSmoothingQuality */
    if (numSteps) {
      /** Set size */
      const w = img.width * quality;
      const h = img.height * quality;
      /** Only the new img is shown. */
      octx.globalCompositeOperation = 'copy';

      /** Steps */
      (steps as Array<number>).forEach((a, b) => {
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
    const base64 = this.cropp(newConfig);
    return {
      base64,
      base64Image: base64,
      type: this.defaultType || this.config.type,
      name: this._fileName
    };
  }

  /**
   * Deprecated, use crop() instead
   */
  cropp(myConfig: ImgCropperConfig): string {
    const canvasElement: HTMLCanvasElement = document.createElement('canvas');
    const rect = this.croppingContainer.nativeElement.getBoundingClientRect() as ClientRect;
    const img = this.imgContainer.nativeElement.firstElementChild.getBoundingClientRect() as ClientRect;
    const left = rect.left - img.left;
    const top = rect.top - img.top;
    const config = {
      width: myConfig.width,
      height: myConfig.height
    };
    canvasElement.width = config.width / this.scale;
    canvasElement.height = config.height / this.scale;
    const ctx = canvasElement.getContext('2d');
    if (myConfig.fill) {
      ctx.fillStyle = myConfig.fill;
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    }
    ctx.drawImage(this._img,
      -(left / this.scale), -(top / this.scale),
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
      url = result.toDataURL(this.defaultType);
    }
    this.result = (url);
    this.cropped.emit({
      base64Image: url,
      base64: url,
      type: this.defaultType || myConfig.type,
      name: this._fileName
    });
    this.isCropped = true;
    return url;
  }
}

const fixedNum = (num: number) => parseFloat(num.toFixed(0));
