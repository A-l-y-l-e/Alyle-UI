import { Directive, Input, ElementRef, Optional, Renderer2, OnInit } from '@angular/core';
import { ThemeVariables, LyCommon, LyTheme2 } from '@alyle/ui';

const DEFAULT_POSITION = 'end top';

const styles = (theme: ThemeVariables) => {
  return {
    root: {
      position: 'absolute',
      width: '22px',
      height: '22px',
      borderRadius: '100%',
      lineHeight: '22px',
      textAlign: 'center'
    },
    sdasdasd: {
      color: 'red'
    }
  };
};
@Directive({
  selector: 'ly-badge, [LyBadge]'
})
export class LyBadge implements OnInit {
  classes = this._theme.addStyleSheet(styles, 'lyBadge');
  private _badge: string | number;
  private _position: string | number;
  private _positionClass: string;

  /** The content for the badge */
  @Input()
  set LyBadge(val: string | number) {
    if (val !== this.content) {
      this._badge = val;
      this._el.nativeElement.innerText = val;
    }
  }
  get content() {
    return this._badge;
  }

  /** The position for the badge */
  @Input()
  set LyBadgePosition(val: 'start top' | 'start bottom' | 'end top' | 'end bottom') {
    if (val !== this.position) {
      this._positionClass = this._theme.addStyle(`ly-badge.position:${val}`, (theme: ThemeVariables) => {
        const positionStyles: {
          top?: number
          left?: number
          right?: number
          bottom?: number
        } = {};
        if (val === 'start top') {
          positionStyles.left = 0;
          positionStyles.top = 0;
        } else if (val === 'start bottom') {
          positionStyles.left = 0;
          positionStyles.bottom = 0;
        } else if (val === 'end top') {
          positionStyles.right = 0;
          positionStyles.top = 0;
        }
        return positionStyles;
      },
      this._el.nativeElement, this._positionClass);
    }

  }
  get position() {
    return this._position;
  }

  /** The color of the badge  */
  @Input() LyBadgeBg: string;

  constructor(
    private _el: ElementRef,
    private _theme: LyTheme2,
    private _renderer: Renderer2,
    @Optional() _common: LyCommon
  ) {
    if (_common) {
      _common.setAutoContrast();
    }
    this._renderer.addClass(this._el.nativeElement, this.classes.root);
  }

  ngOnInit() {
    if (!this.LyBadgePosition) {
      this.LyBadgePosition = DEFAULT_POSITION;
    }
  }

}

/**
 * demo 1:
 * <button badgeRef="badge">button</button>
 * <ly-badge class="hhjk" #badge bg="background:primary" color="primary">8</ly-badge>
 *
 * demo 2:
 * <button LyBadge="8" LyBadgePosition="start top" LyBadgeBg="primary">button</button>
 */
