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
  ViewEncapsulation
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
  `,
  encapsulation: ViewEncapsulation.None
})
export class LyButton implements OnInit, OnDestroy {
  /**
   * Style
   * @ignore
   */
  classes = this.theme.addStyleSheet(styles, 'lyButton', STYLE_PRIORITY);
  private _rippleSensitive = false;
  private _rippleContainer: Ripple;
  private _size: Record<keyof Size, string>;
  private _sizeClass: string;

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
      this._sizeClass = this.theme.addStyle(
        `lyButton-size:${this.size}`,
        Size[this.size as any],
        this.elementRef.nativeElement,
        this._sizeClass,
        STYLE_PRIORITY
      );
    }
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private theme: LyTheme2,
    rippleService: LyRippleService,
    _ngZone: NgZone,
    @Optional() bgAndColor: LyCommon
  ) {
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
    if (Platform.isBrowser) {
      const el = elementRef.nativeElement;
      this._rippleContainer = new Ripple(_ngZone, rippleService.classes, el);
    }
  }

  ngOnInit() {
    this.renderer.addClass(this.elementRef.nativeElement, this.classes.root);
    if (!this.size) {
      this.size = DEFAULT_SIZE as any;
    }
  }

  public focus() {
    this.elementRef.nativeElement.focus();
  }

  ngOnDestroy() {
    if (Platform.isBrowser) {
      this._rippleContainer.removeEvents();
    }
  }

}
