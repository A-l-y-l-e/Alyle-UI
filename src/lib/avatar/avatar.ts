import { Directive, Input, ElementRef, OnInit, OnChanges, Renderer2 } from '@angular/core';
import {
  LyTheme2,
  mixinBg,
  mixinColor,
  mixinElevation,
  mixinOutlined,
  mixinRaised,
  mixinShadowColor,
  mixinStyleUpdater
  } from '@alyle/ui';

const STYLE_PRIORITY = -2;
const DEFAULT_SIZE = 40;
const DEFAULT_BG = 'action';
const STYLES = ({
  $priority: STYLE_PRIORITY,
  root: {
    display: 'inline-flex',
    position: 'relative',
    fontSize: '1.25em',
    flexShrink: 0,
    alignItems: 'center',
    userSelect: 'none',
    borderRadius: '50%',
    textAlign: 'center',
    justifyContent: 'center',
    '&>img': {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      display: 'block',
      objectFit: 'cover',
      '-webkit-background-clip': 'padding-box'
    }
  }
});

/** @docs-private */
export class LyAvatarBase {
  constructor(
    public _theme: LyTheme2
  ) { }
}

/** @docs-private */
export const LyAvatarMixinBase = mixinStyleUpdater(
  mixinBg(
    mixinColor(
      mixinRaised(
        mixinOutlined(
          mixinElevation(
            mixinShadowColor(LyAvatarBase)))))));

@Directive({
  selector: 'ly-avatar',
  inputs: [
    'bg',
    'color',
    'raised',
    'outlined',
    'elevation',
    'shadowColor',
  ]
})
export class LyAvatar extends LyAvatarMixinBase implements OnChanges, OnInit {
  /** @docs-private */
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  private _size: number;
  private _sizeClass: string;
  @Input()
  set size(val: number) {
    if (val !== this.size) {
      this._size = val;
      this._sizeClass = this._theme.addStyle(`lyAvatar.size:${val}`, {
        width: `${val}px`,
        height: `${val}px`,
      }, this._elementRef.nativeElement, this._sizeClass, STYLE_PRIORITY);
    }
  }
  get size() {
    return this._size;
  }
  constructor(
    theme: LyTheme2,
    renderer: Renderer2,
    private _elementRef: ElementRef
  ) {
    super(theme);
    const { avatar } = this._theme.variables;
    this.setAutoContrast();
    renderer.addClass(_elementRef.nativeElement, this.classes.root);
    if (avatar) {
      if (avatar.root) {
        renderer.addClass(
          this._elementRef.nativeElement,
          this._theme.style(avatar.root, STYLE_PRIORITY, STYLES));
      }
    }
  }

  ngOnChanges() {
    this.updateStyle(this._elementRef.nativeElement);
  }

  ngOnInit() {
    if (!this.bg) {
      this.bg = DEFAULT_BG;
      this.ngOnChanges();
    }
    if (!this.size) {
      this.size = DEFAULT_SIZE;
    }
  }
}
