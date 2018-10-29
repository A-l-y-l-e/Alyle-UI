import { Directive, Input, ElementRef, Optional, Renderer2, OnInit, OnChanges } from '@angular/core';
import { ThemeVariables, LyCommon, LyTheme2, Dir } from '@alyle/ui';

const STYLE_PRIORITY = -2;
const DEFAULT_POSITION = 'end top';
const DEFAULT_BG = 'primary';

const styles = (theme: ThemeVariables) => ({
  root: {
    position: 'absolute',
    width: '22px',
    height: '22px',
    borderRadius: '100%',
    lineHeight: '22px',
    textAlign: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    pointerEvents: 'none',
    zIndex: 1,
    fontSize: theme.pxToRem(12),
    fontFamily: theme.typography.fontFamily
  },
  relative: {
    position: 'relative'
  }
});
@Directive({
  selector: 'ly-badge, [lyBadge]'
})
export class LyBadge implements OnInit {
  /**
   * Styles
   * @ignore
   */
  classes = this._theme.addStyleSheet(styles, STYLE_PRIORITY);
  private _content: string | number;
  private _position: 'start top' | 'start bottom' | 'end top' | 'end bottom';
  private _positionClass: string;
  private _elContainer: any;
  private _badgeElementRef: any;
  private _bgClass: string;

  /** The content for the badge */
  @Input('lyBadge')
  set content(val: string | number) {
    if (val !== this.content) {
      this._content = val;
      this._createBadge();
    }
  }
  get content(): string | number {
    return this._content;
  }

  /** The position for the badge */
  @Input('lyBadgePosition')
  set position(val: 'start top' | 'start bottom' | 'end top' | 'end bottom') {
    if (val !== this.position) {
      this._position = val;
      this._positionClass = this._theme.addStyle(`ly-badge.position:${val}`, (theme: ThemeVariables) => {
        const positionStyles: {
          top?: number
          left?: number
          right?: number
          bottom?: number
          transform?: string
        } = {};
        const dir = theme.getDirection(val.indexOf(Dir.start) !== -1 ? Dir.start : Dir.end);
        positionStyles[dir] = 0;
        if (dir === 'left') {
          positionStyles.transform = 'translateX(-50%)';
        } else {
          positionStyles.transform = 'translateX(50%)';
        }
        if (val.indexOf('top') !== -1) {
          positionStyles.top = 0;
          positionStyles.transform += 'translateY(-50%)';
        } else if (val.indexOf('bottom') !== -1) {
          positionStyles.bottom = 0;
          positionStyles.transform += 'translateY(50%)';
        }
        return positionStyles;
      },
      this._badgeElementRef, this._positionClass, STYLE_PRIORITY);
    }

  }
  get position() {
    return this._position;
  }

  /** The color of the badge  */
  @Input('lyBadgeBg')
  get bg() {
    return this._bg;
  }
  set bg(val: string) {
    if (val !== this.bg) {
      this._bg = val;
      this._bgClass = this._theme.addStyle(`ly-badge.bg:${val}`, (theme: ThemeVariables) => ({
        backgroundColor: theme.colorOf(val),
        color: theme.colorOf(`${val}:contrast`)
      }),
      this._badgeElementRef, this._bgClass, STYLE_PRIORITY);
    }
  }
  private _bg: string;

  constructor(
    private _el: ElementRef,
    private _theme: LyTheme2,
    private _renderer: Renderer2,
    @Optional() _common: LyCommon
  ) {
    this._badgeElementRef = this._el.nativeElement;
    if (_common) {
      _common.setAutoContrast();
    }
  }

  ngOnInit() {

    /** Add root styles */
    this._renderer.addClass(this._badgeElementRef, this.classes.root);

    /** Set default position */
    if (!this.position) {
      this.position = DEFAULT_POSITION;
    }

    /** Set default bg */
    if (this.content && !this.bg) {
      this.bg = DEFAULT_BG;
    }
  }

  private _createBadge() {
    if (!this._elContainer) {
      const container = this._elContainer = this._renderer.createElement('div');
      this._renderer.appendChild(this._el.nativeElement, container);
      this._badgeElementRef = container;

      /** Add position relative */
      this._renderer.addClass(this._el.nativeElement, this.classes.relative);
    }
    this._elContainer.textContent = `${this.content}`;
  }

}
