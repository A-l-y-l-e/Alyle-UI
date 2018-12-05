import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  forwardRef,
  Input,
  OnChanges,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef
  } from '@angular/core';
import {
  eachMedia,
  LyTheme2,
  ThemeVariables,
  toBoolean,
  LY_COMMON_STYLES,
  Placement,
  XPosition,
  DirPosition,
  YPosition
  } from '@alyle/ui';

const DEFAULT_MODE = 'side';
const DEFAULT_WIDTH = '230px';
const DEFAULT_VALUE = '';
const STYLE_PRIORITY = -2;
const DEFAULT_POSITION = XPosition.before;

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
    transform: 'translate(0px, 0px)',
    visibility: 'visible'
  },
  backdrop: {
    ...LY_COMMON_STYLES.fill,
    backgroundColor: theme.drawer.backdrop
  },
  transition: {
    transition: `${theme.animations.durations.complex}ms ${theme.animations.curves.deceleration}`,
    transitionProperty: 'transform, margin, visibility'
  }
});

export type position = 'start' | 'end' | 'top' | 'bottom' | Placement;
type mode = 'side' | 'over';

@Directive({
  selector: 'ly-drawer-container'
})
export class LyDrawerContainer {
  /** @docs-private */
  readonly classes = this._theme.addStyleSheet(styles, STYLE_PRIORITY + 1.9);
  _openDrawers = 0;
  @ContentChild(forwardRef(() => LyDrawerContent)) _drawerContent: LyDrawerContent;
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

@Component({
  selector: 'ly-drawer',
  templateUrl: './drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lyDrawer'
})
export class LyDrawer implements OnChanges {
  /**
   * Styles
   * @docs-private
   */
  readonly classes = this._drawerContainer.classes;
  private _forceModeOver: boolean;
  private _fromToggle: boolean;
  private _opened: boolean;
  private _viewRef: EmbeddedViewRef<any>;
  private _isAnimation: boolean;
  private _hasBackdrop: boolean | null;

  private _position: position = DEFAULT_POSITION;
  private _positionClass: string;

  private _drawerRootClass: string;
  private _drawerClass: string;
  private _drawerContentClass: string;

  /** @ignore */
  @ViewChild(TemplateRef) _backdrop: TemplateRef<any>;

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

  @Input() spacingAbove: string | number;
  /** @deprecated, use `spacingAbove` instead */
  @Input() spacingTop: string | number;

  @Input() spacingBelow: string | number;
  /** @deprecated, use `spacingBelow` instead */
  @Input() spacingBottom: string | number;

  @Input() spacingBefore: string | number;

  @Input() spacingAfter: string | number;

  @Input() spacingRight: string | number;
  @Input() spacingLeft: string | number;

  @Input() width: number | string;
  @Input() height: number | string;

  @Input()
  get hasBackdrop() {
    return this._hasBackdrop;
  }
  set hasBackdrop(val: any) {
    this._hasBackdrop = val == null ? null : toBoolean(val);
  }

  @Input()
  set position(val: position) {
    if (val !== this.position) {
      if (val === 'start' || val === 'end') {
        console.warn(`LyDrawer: position ${val} is deprecated, use \`before\` or \`after\` instead`);
      }
      this._position = val;
      this._theme.addStyle(`drawer.position:${val}`,
      // the style needs to be a function so that it can be changed dynamically
      () => ({
        [val]: 0
      }), this._el.nativeElement, this._positionClass, STYLE_PRIORITY);
    }
  }
  get position(): position {
    return this._position;
  }

  constructor(
    private _theme: LyTheme2,
    private _renderer: Renderer2,
    private _el: ElementRef,
    private _drawerContainer: LyDrawerContainer,
    private _vcr: ViewContainerRef,
  ) {
    this._renderer.addClass(this._el.nativeElement, _drawerContainer.classes.drawer);
  }

  ngOnChanges() {
    this._updateBackdrop();
    this._updateAnimations();
    if (this._forceModeOver && !this._fromToggle) {
      this._resetForceModeOver();
    }
    const __mode = this.mode;
    const __forceModeOver = this._forceModeOver;
    const __opened = this.opened;
    let __width = this.width;
    const __height = this.height;
    const __position = this.position;
    const __spacingTop = this.spacingTop;
    const __spacingBottom = this.spacingBottom;

    const __spacingAbove = this.spacingAbove;
    const __spacingBelow = this.spacingBelow;
    const __spacingBefore = this.spacingBefore;
    const __spacingAfter = this.spacingAfter;
    const __spacingRight = this.spacingRight;
    const __spacingLeft = this.spacingLeft;

    if (__spacingTop || __spacingBottom) {
      console.warn(`LyDrawer: \`spacingTop\` and spacingBottom is deprecated use \`spacingAbove\` or \`spacingBelow\` instead`);
    }

    if (__width && __height) {
      throw new Error(`\`width\` and \`height\` are defined, you can only define one`);
    } else if (!__width) {
      if (!__height) {
        /** set default __width if `width` & `height` is `undefined` */
        __width = DEFAULT_WIDTH;
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
          const positionVal = `margin-${__position}`;
          // if (__position === 'start' || __position === 'end') {
          //   positionVal += theme.getDirection(__position);
          // } else {
          //   positionVal += __position;
          // }
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
        this._drawerContainer._drawerContent._getHostElement(),
        this._drawerContentClass);
      } else {
        /** remove styles for <ly-drawer-content> */
        this._renderer.removeClass(this._drawerContainer._drawerContent._getHostElement(), this._drawerContentClass);
        this._drawerContentClass = null;
      }
    } else {
      this._renderer.removeClass(this._drawerContainer._drawerContent._getHostElement(), this._drawerContentClass);
      this._drawerContentClass = null;
      this._renderer.removeClass(this._el.nativeElement, this._drawerClass);
      this._drawerClass = null;
    }

    /** default styles */
    this._drawerRootClass = this._theme.addStyle(
      `ly-drawer-root:${__width}·${__height}·${__spacingAbove}·${__spacingBelow}·${__spacingBefore}·${__spacingAfter}·${__position}·${__mode}·${__forceModeOver}`,
      (theme: ThemeVariables) => {
      const stylesDrawerRoot: {
        width?: string
        height?: string
        top?: string
        bottom?: string
        left?: number
        right?: number
        before?: string
        after?: string
        transform?: string
      } = { };
      const pos = theme.getDirection(__position as any);
      const positionSign = __position === 'above' ? '-' : '+';
      if (__width) {
        const dirXSign = pos === DirPosition.left ? '-' : '+';
        eachMedia(__width, (val, media, isMedia) => {
          if ((__mode === 'over' || __forceModeOver) && val === '0') {
            return;
          }
          const newStyleWidth = toPx(val);
          const newTranslateX = `translateX(${dirXSign + toPx(val)})`;
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
      if (__position === 'before' || __position === 'after') {
        eachMedia(__spacingAbove, (val, media, isMedia) => {
          const newStyleSpacingTop = toPx(val || 0);
          if (isMedia) {
            const breakPoint = theme.getBreakpoint(media);
            const styleOfBreakPoint = createEmptyPropOrUseExisting(stylesDrawerRoot, breakPoint);
            styleOfBreakPoint.top = newStyleSpacingTop;
          } else {
            stylesDrawerRoot.top = newStyleSpacingTop;
          }
        });
        eachMedia(__spacingBelow, (val, media, isMedia) => {
          const newStyleSpacingBottom = toPx(val || 0);
          if (isMedia) {
            const breakPoint = theme.getBreakpoint(media);
            const styleOfBreakPoint = createEmptyPropOrUseExisting(stylesDrawerRoot, breakPoint);
            styleOfBreakPoint.bottom = newStyleSpacingBottom;
          } else {
            stylesDrawerRoot.bottom = newStyleSpacingBottom;
          }
        });
      } else if (__position === YPosition.above || __position === YPosition.below) {
        eachMedia(__spacingBefore, (val, media, isMedia) => {
          const newStyleSpacingBefore = toPx(val || 0);
          if (isMedia) {
            const breakPoint = theme.getBreakpoint(media);
            const styleOfBreakPoint = createEmptyPropOrUseExisting(stylesDrawerRoot, breakPoint);
            styleOfBreakPoint.before = newStyleSpacingBefore;
          } else {
            stylesDrawerRoot.before = newStyleSpacingBefore;
          }
        });
        eachMedia(__spacingAfter, (val, media, isMedia) => {
          const newStyleSpacingAfter = toPx(val || 0);
          if (isMedia) {
            const breakPoint = theme.getBreakpoint(media);
            const styleOfBreakPoint = createEmptyPropOrUseExisting(stylesDrawerRoot, breakPoint);
            styleOfBreakPoint.after = newStyleSpacingAfter;
          } else {
            stylesDrawerRoot.after = newStyleSpacingAfter;
          }
        });
      }
      return stylesDrawerRoot;
    }, this._el.nativeElement, this._drawerRootClass, __mode === 'side' ? STYLE_PRIORITY : STYLE_PRIORITY + 1);
    this._fromToggle = false;
  }

  toggle() {
    const width = getComputedStyle(this._el.nativeElement).width;
    this._fromToggle = true;
    if (width === '0px') {
      this._forceModeOver = true;
      this.opened = true;
    } else {
      if (this._forceModeOver && this.opened) {
        this._resetForceModeOver();
      } else {
        this.opened = !this.opened;
      }
    }
    this.ngOnChanges();
  }

  private _resetForceModeOver() {
    this._forceModeOver = false;
    this.opened = false;
  }

  private _updateBackdrop() {
    if (this.opened && (this.hasBackdrop != null ? this.hasBackdrop : (this.mode === 'over' || this._forceModeOver))) {
      if (!this._viewRef) {
        this._drawerContainer._openDrawers++;
        this._viewRef = this._vcr.createEmbeddedView(this._backdrop);
        (this._viewRef.rootNodes[0] as HTMLDivElement).style.zIndex = `${this._drawerContainer._openDrawers}`;
      }
    } else if (this._viewRef) {
      this._drawerContainer._openDrawers--;
      this._vcr.clear();
      this._viewRef = null;
    }
  }

  private _updateAnimations() {
    if (this._fromToggle && !this._isAnimation) {
      this._renderer.addClass(this._el.nativeElement, this.classes.transition);
      this._renderer.addClass(this._drawerContainer._drawerContent._getHostElement(), this.classes.transition);
      this._isAnimation = true;
    } else if (!this._fromToggle && this._isAnimation) {
      this._renderer.removeClass(this._el.nativeElement, this.classes.transition);
      this._renderer.removeClass(this._drawerContainer._drawerContent._getHostElement(), this.classes.transition);
      this._isAnimation = false;
    }
  }
}

/**
 * convert number to px
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
