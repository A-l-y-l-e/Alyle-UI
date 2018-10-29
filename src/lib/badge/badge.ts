import { Directive, Input, ElementRef, Optional, Renderer2, OnInit } from '@angular/core';
import { ThemeVariables, LyCommon, LyTheme2 } from '@alyle/ui';

const STYLE_PRIORITY = -2;
const DEFAULT_POSITION = 'startTop';
const DEFAULT_BG = 'primary';
const DEFAULT_POSITION_VALUE = {
  end: '-11px',
  top: '-11px'
};
const styles = (theme: ThemeVariables) => ({
  root: {
    position: 'absolute',
    display: 'flex',
    width: '22px',
    height: '22px',
    borderRadius: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    pointerEvents: 'none',
    zIndex: 1,
    fontSize: theme.pxToRem(12),
    fontFamily: theme.typography.fontFamily,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.badge.root
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
  private _position: string;
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
  set position(val: string) {
    if (val !== this.position) {
      this._position = val;
      this._positionClass = this._theme.addStyle(`ly-badge.position:${val}`, (theme: ThemeVariables) => {
        const sty = theme.badge.position && theme.badge.position[val] || val === DEFAULT_POSITION ? DEFAULT_POSITION_VALUE : null;
        if (sty) {
          return sty;
        } else {
          throw new Error(`LyBadge.position \`${val}\` not found in \`ThemeVariables\``);
        }
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
