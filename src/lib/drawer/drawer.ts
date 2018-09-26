import { Directive, Input, ElementRef, Renderer2, OnChanges, forwardRef, ContentChild } from '@angular/core';
import { LyTheme2, ThemeVariables, toBoolean, eachMedia } from '@alyle/ui';

const DEFAULT_MODE = 'side';
const DEFAULT_VALUE = '';
const STYLE_PRIORITY = -2;
const DEFAULT_POSITION = 'start';

const styles = (theme: ThemeVariables) => ({
  drawerContainer: {
    display: 'block',
    position: 'relative',
    overflow: 'hidden',
    '-webkit-overflow-scrolling': 'touch'
  },
  drawer: {
    display: 'block',
    position: 'fixed',
    zIndex: theme.zIndex.drawer,
    overflow: 'auto',
    visibility: 'hidden'
  },
  drawerContent: {
    display: 'block'
  },
  drawerOpened: {
    transform: 'translate3d(0px, 0px, 0)',
    visibility: 'visible'
  }
});

type position = 'start' | 'end' | 'top' | 'bottom';
type mode = 'side' | 'over';

@Directive({
  selector: 'ly-drawer-container'
})
export class LyDrawerContainer {
  classes = this._theme.addStyleSheet(styles, 'ly-drawer-container', STYLE_PRIORITY + 1.9);
  @ContentChild(forwardRef(() => LyDrawerContent)) drawerContent: LyDrawerContent;
  constructor(
    private _theme: LyTheme2,
    private _renderer: Renderer2,
    private _el: ElementRef
  ) {
    this._renderer.addClass(this._el.nativeElement, this.classes.drawerContainer);
  }
}

@Directive({
  selector: 'ly-drawer-content'
})
export class LyDrawerContent {
  constructor(
    private _theme: LyTheme2,
    private _renderer: Renderer2,
    private _el: ElementRef,
    drawerContainer: LyDrawerContainer
  ) {
    this._renderer.addClass(this._el.nativeElement, drawerContainer.classes.drawerContent);
  }
  _getHostElement() {
    return this._el.nativeElement;
  }
}

@Directive({
  selector: 'ly-drawer',
  exportAs: 'lyDrawer'
})
export class LyDrawer implements OnChanges {
  private _initialMode: mode;
  private _opened: boolean;
  private _openedClass: string;

  private _mode: mode;
  private _modeClass: string;

  private _width: number | string;
  private _widthClass: string;

  private _height: number | string;
  private _heightClass: string;

  private _position: position = DEFAULT_POSITION;
  private _positionClass: string;

  private _drawerRootClass: string;
  private _drawerClass: string;
  private _drawerContentClass: string;

  /** @deprecated */
  @Input() config: any;

  @Input()
  set opened(val: boolean) {
    if (val !== this.opened) {
      this._opened = toBoolean(val);
    }
  }
  get opened() {
    return this._opened;
  }
  @Input() mode: mode = DEFAULT_MODE;
  @Input() spacingTop: string | number;
  @Input() spacingBottom: string | number;
  @Input() spacingStart: string | number;
  @Input() spacingRight: string | number;
  @Input() width: number | string;
  @Input() height: number | string;
  @Input()
  set position(val: position) {
    if (val !== this.position) {
      this._position = val;
      this._theme.addStyle(`drawer.position:${val}`, (theme: ThemeVariables) => {
        let positionVal: string;
        if (val === 'start' || val === 'end') {
          positionVal = theme.getDirection(val);
        } else {
          positionVal = val;
        }
        return {
          [positionVal]: 0
        };
      }, this._el.nativeElement, this._positionClass, STYLE_PRIORITY);
    }
  }
  get position() {
    return this._position;
  }

  constructor(
    private _theme: LyTheme2,
    private _renderer: Renderer2,
    private _el: ElementRef,
    private _drawerContainer: LyDrawerContainer
  ) {
    this._renderer.addClass(this._el.nativeElement, _drawerContainer.classes.drawer);
  }

  ngOnChanges() {
    const __mode = this.mode;
    const __opened = this.opened;
    let __width = this.width;
    const __height = this.height;
    const __position = this.position;
    const __spacingTop = this.spacingTop;
    const __spacingBottom = this.spacingBottom;
    if (__width && __height) {
      throw new Error(`\`width\` and \`height\` are defined, you can only define one`);
    } else if (!__width) {
      if (!__height) {
        __width = '230px';
      }
    }

    if (__opened) {
      /** create styles for mode side */
      this._drawerClass = this._theme.updateClass(this._el.nativeElement, this._renderer, this._drawerContainer.classes.drawerOpened, this._drawerClass);
      if (__mode === 'side') {
        const newKeyDrawerContent = `ly-drawer-content----:${
          __opened || DEFAULT_VALUE}·${
            __width || DEFAULT_VALUE}·${
              __position || DEFAULT_VALUE}`;
        this._drawerContentClass = this._theme.addStyle(newKeyDrawerContent, (theme: ThemeVariables) => {
          const drawerContentStyles: {
            marginLeft?: string
            marginRight?: string
            marginTop?: string
            marginBottom?: string
          } = {};
          let positionVal = 'margin-';
          if (__position === 'start' || __position === 'end') {
            positionVal += theme.getDirection(__position);
          } else {
            positionVal += __position;
          }
          eachMedia(__opened as any, () => {});
          if (__width) {
            eachMedia(__width, (val, media, isMedia) => {
              const newStyleWidth = toPx(val);
              if (isMedia) {
                const breakPoint = theme.getBreakpoint(media);
                const styleOfBreakPoint = createEmptyPropOrUseExisting(drawerContentStyles, breakPoint);
                styleOfBreakPoint[positionVal] = newStyleWidth;
              } else {
                drawerContentStyles[positionVal] = newStyleWidth;
              }
            });
          }
          return drawerContentStyles;
        },
        this._drawerContainer.drawerContent._getHostElement(),
        this._drawerContentClass);
      } else {
        /** remove styles for <ly-drawer-content> */
        this._renderer.removeClass(this._drawerContainer.drawerContent._getHostElement(), this._drawerContentClass);
        this._drawerContentClass = null;
      }
    } else {
      this._renderer.removeClass(this._drawerContainer.drawerContent._getHostElement(), this._drawerContentClass);
      this._drawerContentClass = null;
      this._renderer.removeClass(this._el.nativeElement, this._drawerClass);
      this._drawerClass = null;
    }

    /** default styles */
    // tslint:disable-next-line:max-line-length
    this._drawerRootClass = this._theme.addStyle(`ly-drawer-root:${__width}·${__height}·${__spacingTop}·${__spacingBottom}·${__spacingBottom}·${__position}·${__mode}`, (theme: ThemeVariables) => {
      const stylesDrawerRoot: {
        width?: string
        height?: string
        top?: string
        bottom?: string
        left?: number
        right?: number
        transform?: string
      } = { };
      const positionSign = __position === 'start' || __position === 'top' ? '-' : '+';
      if (__width) {
        eachMedia(__width, (val, media, isMedia) => {
          console.log({val});
          if (__mode === 'over' && val === '0') {
            return;
          }
          const newStyleWidth = toPx(val);
          const newTranslateX = `translateX(${positionSign + toPx(val)})`;
          if (isMedia) {
            const breakPoint = theme.getBreakpoint(media);
            const styleOfBreakPoint = createEmptyPropOrUseExisting(stylesDrawerRoot, breakPoint);
            styleOfBreakPoint.width = newStyleWidth;
            styleOfBreakPoint.transform = newTranslateX;
          } else {
            stylesDrawerRoot.width = newStyleWidth;
            stylesDrawerRoot.transform = newTranslateX;
          }
        });
      } else if (__height) {
        eachMedia(__height, (val, media, isMedia) => {
          const newStyleHeight = toPx(val);
          const newTranslateY = `translateY(${positionSign + toPx(val)})`;
          if (isMedia) {
            const breakPoint = theme.getBreakpoint(media);
            const styleOfBreakPoint = createEmptyPropOrUseExisting(stylesDrawerRoot, breakPoint);
            styleOfBreakPoint.height = newStyleHeight;
            styleOfBreakPoint.transform = newTranslateY;
          } else {
            stylesDrawerRoot.height = newStyleHeight;
            stylesDrawerRoot.transform = newTranslateY;
          }
        });
      }
      if (__position === 'start' || __position === 'end') {
        eachMedia(__spacingTop, (val, media, isMedia) => {
          const newStyleSpacingTop = toPx(val || 0);
          if (isMedia) {
            const breakPoint = theme.getBreakpoint(media);
            const styleOfBreakPoint = createEmptyPropOrUseExisting(stylesDrawerRoot, breakPoint);
            styleOfBreakPoint.top = newStyleSpacingTop;
          } else {
            stylesDrawerRoot.top = newStyleSpacingTop;
          }
        });
        eachMedia(__spacingBottom, (val, media, isMedia) => {
          const newStyleSpacingBottom = toPx(val || 0);
          if (isMedia) {
            const breakPoint = theme.getBreakpoint(media);
            const styleOfBreakPoint = createEmptyPropOrUseExisting(stylesDrawerRoot, breakPoint);
            styleOfBreakPoint.bottom = newStyleSpacingBottom;
          } else {
            stylesDrawerRoot.bottom = newStyleSpacingBottom;
          }
        });
      } else {
        stylesDrawerRoot.left = 0;
        stylesDrawerRoot.right = 0;
      }
      return stylesDrawerRoot;
    }, this._el.nativeElement, this._drawerRootClass, __mode === 'side' ? STYLE_PRIORITY : STYLE_PRIORITY + 1);
  }

  toggle() {
    const width = getComputedStyle(this._el.nativeElement).width;
    console.log({width});
    if (this.mode === 'side' && width === '0px') {
      this._initialMode = this.mode;
      this.mode = 'over';
      this.opened = true;
    } else {
      if (this._initialMode) {
        this.mode = this._initialMode;
      }
      this.opened = !this.opened;
    }
    this.ngOnChanges();
  }
}

/**
 * @dddd
 */
function toPx(val: string | number) {
  if (typeof val === 'number') {
    return `${val}px`;
  } else {
    return val;
  }
}

function createEmptyPropOrUseExisting(object: object, key: string, _new?: any) {
  return key in object
  ? object[key]
  : object[key] = _new || {};
}
