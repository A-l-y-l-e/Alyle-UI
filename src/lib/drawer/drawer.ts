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
  ViewContainerRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
  Inject
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
  YPosition,
  WinResize,
  Platform,
  lyl,
  StyleRenderer,
  LyHostClass,
  ThemeRef,
  StyleCollection,
  StyleTemplate,
  LyClasses
  } from '@alyle/ui';
import { Subscription } from 'rxjs';

export interface LyDrawerTheme {
  /** Styles for Button Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
}

export interface LyDrawerVariables {
  drawer?: LyDrawerTheme;
}

export type LyDrawerPosition = Placement;
export type LyDrawerMode = 'side' | 'over';
const DEFAULT_MODE = 'side';
const DEFAULT_WIDTH = '230px';
const DEFAULT_VALUE = '';
const STYLE_PRIORITY = -2;
const DEFAULT_POSITION = XPosition.before;

export const STYLES = (theme: ThemeVariables & LyDrawerVariables, ref: ThemeRef) => {
  const __ = ref.selectorsOf(STYLES);
  return {
    $name: LyDrawerContent.и,
    $priority: STYLE_PRIORITY + 1.9,
    root: () => (theme.drawer
      && theme.drawer.root
      && (theme.drawer.root instanceof StyleCollection
        ? theme.drawer.root.setTransformer(fn => fn(__)).css
        : theme.drawer.root(__))
    ),
    drawerContainer: lyl `{
      display: block
      position: relative
      overflow: hidden
      -webkit-overflow-scrolling: touch
    }`,
    drawer: lyl `{
      display: block
      position: fixed
      z-index: ${theme.zIndex.drawer}
      overflow: auto
      visibility: hidden
    }`,
    drawerContent: lyl `{
      display: block
    }`,
    drawerOpened: lyl `{
      transform: translate(0px, 0px)
      visibility: visible
    }`,
    drawerClosed: null,
    backdrop: lyl `{
      ...${LY_COMMON_STYLES.fill}
      background-color: ${theme.drawer.backdrop}
    }`,
    transition: lyl `{
      transition: ${theme.animations.durations.complex}ms ${theme.animations.curves.deceleration}
      transition-property: transform, margin, visibility
    }`
  };
};

@Directive({
  selector: 'ly-drawer-content'
})
export class LyDrawerContent {
  static readonly и = 'LyDrawerContent';
  constructor(
    private _renderer: Renderer2,
    private _el: ElementRef,
    @Inject(forwardRef(() => LyDrawerContainer)) drawerContainer
  ) {
    this._renderer.addClass(this._el.nativeElement, (drawerContainer as LyDrawerContainer).classes.drawerContent);
  }
  _getHostElement() {
    return this._el.nativeElement;
  }
}

@Directive({
  selector: 'ly-drawer-container'
})
export class LyDrawerContainer {
  /** @docs-private */
  readonly classes = this._theme.renderStyleSheet(STYLES);
  _openDrawers = 0;
  @ContentChild(forwardRef(() => LyDrawerContent), { static: true }) _drawerContent: LyDrawerContent;
  constructor(
    private _theme: LyTheme2,
    private _renderer: Renderer2,
    private _el: ElementRef
  ) {
    this._renderer.addClass(this._el.nativeElement, this.classes.drawerContainer);
  }

  _getHostElement() {
    return this._el.nativeElement;
  }
}


@Component({
  selector: 'ly-drawer',
  templateUrl: './drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lyDrawer',
  providers: [
    LyHostClass,
    StyleRenderer
  ]
})
export class LyDrawer implements OnChanges, AfterViewInit, OnDestroy {
  static readonly и = 'LyDrawer';
  /**
   * Styles
   * @docs-private
   */
  readonly classes = this._drawerContainer.classes;
  private _forceModeOverOpened: boolean;
  private _fromToggle: boolean;
  private _opened: boolean;
  private _viewRef?: EmbeddedViewRef<any>;
  private _isAnimation: boolean;
  private _hasBackdrop: boolean | null;

  private _position: LyDrawerPosition = DEFAULT_POSITION;

  private _drawerRootClass: string;
  private _drawerClass?: string;
  private _drawerContentClass?: string;
  private _tabResizeSub: Subscription;
  private _isOpen: boolean;

  @ViewChild(TemplateRef, { static: false }) _backdrop: TemplateRef<any>;

  @Input()
  set opened(val: boolean) {
    if (val !== this.opened) {
      this._opened = toBoolean(val);
      this._isOpen = this._opened;
    }
  }
  get opened() {
    return this._opened;
  }
  @Input() mode: LyDrawerMode = DEFAULT_MODE;

  @Input() spacingAbove: string | number;

  @Input() spacingBelow: string | number;

  @Input() spacingBefore: string | number;

  @Input() spacingAfter: string | number;

  @Input() drawerWidth: number | string;

  @Input() drawerHeight: number | string;

  @Input()
  get hasBackdrop() {
    return this._hasBackdrop;
  }
  set hasBackdrop(val: any) {
    this._hasBackdrop = val == null ? null : toBoolean(val);
  }

  @Input()
  set position(val: LyDrawerPosition) {
    if (val !== this.position) {
      this._position = val;
      this[0x1] = this._styleRenderer.add(`${LyDrawer.и}--position-${val}`,
      (theme: ThemeVariables) => lyl `{
        ${theme.getDirection(val as any)}: 0
      }`, STYLE_PRIORITY, this[0x1]);
    }
  }
  get position(): LyDrawerPosition {
    return this._position;
  }
  [0x1]: string;

  constructor(
    private _theme: LyTheme2,
    private _styleRenderer: StyleRenderer,
    private _renderer: Renderer2,
    private _el: ElementRef,
    private _drawerContainer: LyDrawerContainer,
    private _vcr: ViewContainerRef,
    private _winResize: WinResize,
    private _cd: ChangeDetectorRef,
    private _zone: NgZone
  ) {
    this._renderer.addClass(this._el.nativeElement, _drawerContainer.classes.drawer);
  }

  ngOnChanges() {
    this._updateBackdrop();
    this._updateAnimations();

    const __mode = this.mode;
    const __forceModeOverOpened = this._forceModeOverOpened;
    const __opened = this.opened;
    let __width = this.drawerWidth;
    const __height = this.drawerHeight;
    const __position = this.position;

    const __spacingAbove = this.spacingAbove;
    const __spacingBelow = this.spacingBelow;
    const __spacingBefore = this.spacingBefore;
    const __spacingAfter = this.spacingAfter;

    if (__width && __height) {
      throw new Error(`\`width\` and \`height\` are defined, you can only define one`);
    } else if (!__width) {
      if (!__height) {
        /** set default __width if `width` & `height` is `undefined` */
        __width = DEFAULT_WIDTH;
      }
    }

    if ((this._isOpen && __opened) || (this._isOpen) || __forceModeOverOpened) {
      /** create styles for mode side */
      this._drawerClass = this._theme.updateClass(this._el.nativeElement, this._renderer, this._drawerContainer.classes.drawerOpened, this._drawerClass);
      // styles for <ly-drawer-content>
      if (__mode === 'side') {
        const newKeyDrawerContent = `ly-drawer-content----:${
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
          if (__width) {
            eachMedia(__width, (val, media) => {
              const newStyleWidth = val === 'over' ? '0px' : toPx(val);
              if (media) {
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
      } else if (this._drawerContentClass) {
        /** remove styles for <ly-drawer-content> */
        this._renderer.removeClass(this._drawerContainer._drawerContent._getHostElement(), this._drawerContentClass);
        this._drawerContentClass = undefined;
      }
    } else {
      if (this._drawerContentClass) {
        this._renderer.removeClass(this._drawerContainer._drawerContent._getHostElement(), this._drawerContentClass);
        this._drawerContentClass = undefined;
      }
      if (this._drawerClass) {
        this._renderer.removeClass(this._el.nativeElement, this._drawerClass);
        this._drawerClass = undefined;
      }
    }

    /** default styles */
    this._drawerRootClass = this._theme.addStyle(
      `ly-drawer-root:${__width}·${__height}·${__spacingAbove}·${__spacingBelow}·${__spacingBefore}·${__spacingAfter}·${__position}·${__mode}·${__forceModeOverOpened}`,
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
        eachMedia(__width, (val, media) => {
          if ((__mode === 'over' || __forceModeOverOpened) && (val === 0 || val === 'over')) {
            return;
          }
          const newVal = val === 'over' ? '0px' : toPx(val);
          const newStyleWidth = newVal;
          const newTranslateX = `translateX(${dirXSign + newVal})`;
          if (media) {
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
        eachMedia(__height, (val, media) => {
          const newStyleHeight = toPx(val);
          const newTranslateY = `translateY(${positionSign + toPx(val)})`;
          if (media) {
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
        eachMedia(__spacingAbove, (val, media) => {
          const newStyleSpacingTop = toPx(val || 0);
          if (media) {
            const breakPoint = theme.getBreakpoint(media);
            const styleOfBreakPoint = createEmptyPropOrUseExisting(stylesDrawerRoot, breakPoint);
            styleOfBreakPoint.top = newStyleSpacingTop;
          } else {
            stylesDrawerRoot.top = newStyleSpacingTop;
          }
        });
        eachMedia(__spacingBelow, (val, media) => {
          const newStyleSpacingBottom = toPx(val || 0);
          if (media) {
            const breakPoint = theme.getBreakpoint(media);
            const styleOfBreakPoint = createEmptyPropOrUseExisting(stylesDrawerRoot, breakPoint);
            styleOfBreakPoint.bottom = newStyleSpacingBottom;
          } else {
            stylesDrawerRoot.bottom = newStyleSpacingBottom;
          }
        });
      } else if (__position === YPosition.above || __position === YPosition.below) {
        eachMedia(__spacingBefore, (val, media) => {
          const newStyleSpacingBefore = toPx(val || 0);
          if (media) {
            const breakPoint = theme.getBreakpoint(media);
            const styleOfBreakPoint = createEmptyPropOrUseExisting(stylesDrawerRoot, breakPoint);
            styleOfBreakPoint.before = newStyleSpacingBefore;
          } else {
            stylesDrawerRoot.before = newStyleSpacingBefore;
          }
        });
        eachMedia(__spacingAfter, (val, media) => {
          const newStyleSpacingAfter = toPx(val || 0);
          if (media) {
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

  ngAfterViewInit() {
    if (Platform.isBrowser) {
      this._tabResizeSub = this._winResize.resize$.subscribe(() => {
        this.ngOnChanges();
      });
    }
  }

  ngOnDestroy() {
    if (this._tabResizeSub) {
      this._tabResizeSub.unsubscribe();
    }
  }

  toggle() {
    const width = getComputedStyle(this._el.nativeElement).width;
    this._fromToggle = true;
    if (width === '0px') {
      this._forceModeOverOpened = true;
      this._isOpen = true;
    } else {
      if (this._forceModeOverOpened) {
        this._forceModeOverOpened = false;
        this._isOpen = this.opened;
      } else {
        this._isOpen = !this._isOpen;
      }
    }
    this.ngOnChanges();
  }

  private _contentHasMargin() {
    const content = this._drawerContainer._drawerContent._getHostElement() as HTMLElement;
    const container = this._drawerContainer._getHostElement() as HTMLElement;
    return (content.offsetWidth === container.offsetWidth);
  }

  private _updateBackdrop() {
    if (((this._isOpen && this.opened) || this._isOpen) &&
      (this.hasBackdrop != null
        ? this.hasBackdrop
        : (this.mode === 'over' || (this._forceModeOverOpened && this._contentHasMargin())))) {

      // create only if is necessary
      if (!this._viewRef) {
        this._zone.run(() => {
          this._drawerContainer._openDrawers++;
          this._viewRef = this._vcr.createEmbeddedView(this._backdrop);
          this._cd.markForCheck();
          (this._viewRef.rootNodes[0] as HTMLDivElement).style.zIndex = `${this._drawerContainer._openDrawers}`;
        });
      }
    } else if (this._viewRef) {
      this._zone.run(() => {
        this._drawerContainer._openDrawers--;
        this._vcr.clear();
        this._viewRef = undefined;
        this._cd.markForCheck();
        if (this._forceModeOverOpened) {
          this._forceModeOverOpened = false;
          this._isOpen = this.opened;
        }
      });
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
