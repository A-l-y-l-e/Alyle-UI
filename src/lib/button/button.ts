import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Optional,
  Renderer2,
  NgZone,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  Platform,
  toBoolean,
  LyTheme2,
  LyCommon
} from '@alyle/ui';
import { Ripple, LyRippleService } from '@alyle/ui/ripple';
import { styles } from './button.style';
const DEFAULT_SIZE = 'medium';
const STYLE_PRIORITY = -2;

interface Size {
  small: any;
  medium: any;
  large: any;
}

const Size = {
  small: theme => ({
    padding: '0 8px',
    fontSize: theme.pxToRem(theme.typography.button.fontSize - 1),
    minHeight: '32px',
    minWidth: '64px'
  }),
  medium: ({
    padding: '0 14px',
    minHeight: '36px',
    minWidth: '88px'
  }),
  large: (theme) => ({
    padding: '0 21px',
    fontSize: theme.pxToRem(theme.typography.button.fontSize + 1),
    minHeight: '40px',
    minWidth: '112px'
  })
};

@Component({
  selector: '[ly-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <span [className]="classes.content">
    <ng-content></ng-content>
  </span>
  <div #rippleContainer [className]="_rippleService.classes.container"></div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class LyButton implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Style
   * @ignore
   */
  classes = this._theme.addStyleSheet(styles, 'lyButton', STYLE_PRIORITY);
  private _rippleSensitive = false;
  private _ripple: Ripple;
  private _size: Record<keyof Size, string>;
  private _sizeClass: string;

  @ViewChild('rippleContainer') _rippleContainer: ElementRef;

  /** @ignore */
  @Input('sensitive')
  get rippleSensitive(): boolean {
    return this._rippleSensitive;
  }
  set rippleSensitive(value: boolean) {
    this._rippleSensitive = toBoolean(value);
  }

  @Input()
  get size(): Record<keyof Size, string> {
    return this._size;
  }
  set size(val: Record<keyof Size, string>) {
    if (val !== this.size) {
      this._size = val;
      this._sizeClass = this._theme.addStyle(
        `lyButton-size:${this.size}`,
        Size[this.size as any],
        this._elementRef.nativeElement,
        this._sizeClass,
        STYLE_PRIORITY
      );
    }
  }

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _theme: LyTheme2,
    private _ngZone: NgZone,
    public _rippleService: LyRippleService,
    @Optional() bgAndColor: LyCommon
  ) {
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
  }

  ngOnInit() {
    this._renderer.addClass(this._elementRef.nativeElement, this.classes.root);
    if (!this.size) {
      this.size = DEFAULT_SIZE as any;
    }
  }

  ngAfterViewInit() {
    if (Platform.isBrowser) {
      const rippleContainer = this._rippleContainer.nativeElement;
      const triggerElement = this._elementRef.nativeElement;
      this._ripple = new Ripple(this._theme.config, this._ngZone, this._rippleService.classes, rippleContainer, triggerElement);
    }
  }

  public focus() {
    this._elementRef.nativeElement.focus();
  }

  ngOnDestroy() {
    if (Platform.isBrowser) {
      this._ripple.removeEvents();
    }
  }

}
