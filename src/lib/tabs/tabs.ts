import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  Optional,
  ViewChildren
  } from '@angular/core';
import {
  LyTheme2,
  mixinBg,
  mixinColor,
  mixinDisabled,
  mixinDisableRipple,
  mixinElevation,
  mixinOutlined,
  mixinRaised,
  mixinShadowColor,
  mixinStyleUpdater,
  ThemeVariables,
  AlignAlias,
  YPosition,
  XPosition,
  Dir,
  LyRippleService,
  LyFocusState,
  scrollWithAnimation,
  toBoolean,
  lyl,
  LY_COMMON_STYLES,
  ThemeRef,
  StyleCollection,
  LyClasses,
  StyleTemplate,
  StyleRenderer,
  Style
  } from '@alyle/ui';
import { LyButton } from '@alyle/ui/button';
import { LyTabContent } from './tab-content.directive';
import { Subscription } from 'rxjs';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Platform } from '@angular/cdk/platform';

export interface LyTabTheme {
  /** Styles for Tab Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
}

export interface LyTabVariables {
  tab?: LyTabTheme;
}

const DEFAULT_DISABLE_RIPPLE = false;
const STYLE_PRIORITY = -2;
const DEFAULT_BG = 'primary';
const DEFAULT_INDICATOR_COLOR = 'accent';
const DEFAULT_ELEVATION = 4;
const DEFAULT_HEADER_PLACEMENT = 'above';
export type AlignTabs = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type LyTabsHeaderPlacement = 'before' | 'after' | 'above' | 'below';

export const STYLES = (theme: ThemeVariables & LyTabVariables, ref: ThemeRef) => {
  const __ = ref.selectorsOf(STYLES);
  return {
    $name: LyTabs.и,
    $priority: STYLE_PRIORITY,
    root: () => lyl `{
      display: flex
      {
        ...${
          (theme.tab
            && theme.tab.root
            && (theme.tab.root instanceof StyleCollection
              ? theme.tab.root.setTransformer(fn => fn(__)).css
              : theme.tab.root(__))
          )
        }
      }
    }`,
    tab: lyl `{
      position: relative
      display: inline-flex
    }`,
    /** Tab content */
    contentContainer: lyl `{
      display: flex
      overflow: hidden
      flex-grow: 1
      width: 100%
    }`,
    /** Tab header */
    tabsLabels: lyl `{
      display: flex
      position: relative
      height: 100%
    }`,
    labelsContainer: () => lyl `{
      overflow: hidden
      flex-shrink: 0
      ${__.scrollable} & {
        @media (hover: none) {
          overflow: auto
        }
      }
    }`,
    label: lyl `{
      -webkit-tap-highlight-color: transparent
      -webkit-appearance: none
      background-color: transparent
      user-select: none
      border: 0
      min-width: 72px
      padding: 0 24px
      cursor: pointer
      height: 48px
      display: inline-flex
      justify-content: center
      align-items: center
      position: relative
      overflow: hidden
      font-family: ${theme.typography.fontFamily}
      font-size: ${theme.pxToRem(theme.typography.fontSize)}
      letter-spacing: 0.02857em
      color: currentColor
      outline: none
      width: 100%
      font-weight: 500
      opacity: .7
      @media ${theme.breakpoints['XSmall']} {
        padding: 0 12px
      }
    }`,
    tabLabelActive: lyl `{
      opacity: 1
    }`,
    tabContents: lyl `{
      display: flex
      transition: 450ms cubic-bezier(.1, 1, 0.5, 1)
      will-change: transform
      width: 100%
    }`,
    tabContent: lyl `{
      width: 100%
      height: 100%
      flex-shrink: 0
      position: relative
      overflow: auto
    }`,
    tabContentInner: null,
    tabsIndicator: lyl `{
      position: absolute
      height: 2px
      transition: 450ms cubic-bezier(.1, 1, 0.5, 1)
      background: currentColor
    }`,
    tabsIndicatorForServer: lyl `{
      position: absolute
      background: currentColor
    }`,
    rippleContainer: lyl `{
      ...${LY_COMMON_STYLES.fill}
      overflow: hidden
    }`,
    scrollable: null,
    hiddenContent: () => lyl `{
      visibility: hidden
      transition: visibility linear 1s
      ${__.column} & {
        height: 0
      }
    }`,
    column: null,
    row: null
  };
};

/** @docs-private */
export class LyTabsBase {
  constructor(
    public _theme: LyTheme2
  ) { }
}

/** @docs-private */
export const LyTabsMixinBase = mixinStyleUpdater(mixinBg(mixinElevation(mixinShadowColor(LyTabsBase))));

/** @docs-private */
export class LyTabLabelBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone,
    public _platform: Platform
  ) { }
}

/** @docs-private */
export const LyTabLabelMixinBase = mixinStyleUpdater(
mixinBg(
  mixinColor(
    mixinRaised(
      mixinDisabled(
        mixinOutlined(
          mixinElevation(
            mixinShadowColor(
              mixinDisableRipple(LyTabLabelBase)))))))));

/**
 * @dynamic
 */
@Component({
  selector: 'ly-tabs',
  templateUrl: './tabs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'lyTabs',
  inputs: [
    'bg', 'elevation', 'shadowColor'
  ],
  providers: [
    StyleRenderer
  ]
})
export class LyTabs extends LyTabsMixinBase implements OnChanges, OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  /** @docs-private */
  static и = 'LyTabs';
  /** @docs-private */
  $priority = STYLE_PRIORITY;
  /** @docs-private */
  readonly classes = this.sRenderer.renderSheet(STYLES, true);
  _selectedIndex: number;
  _selectedBeforeIndex: number;
  _selectedTab: LyTab | null;
  _selectedBeforeTab: LyTab | null;
  _isViewInitLoaded: boolean;
  private _tabsSubscription = Subscription.EMPTY;
  private _headerPlacement: LyTabsHeaderPlacement;
  private _headerPlacementClass: string;
  private _alignTabs: AlignTabs;
  private _alignTabsClass: string;
  private _textColor: string;
  private _textColorClass: string;
  private _selectedIndexClass: string;
  private _tabResizeSub: Subscription;
  private _scrollable: boolean;
  private _timeoutIds: { [index: number]: number } = {};

  @ViewChild('tabs', { static: true }) tabsRef: ElementRef;
  @ViewChild('tabContents', { static: true }) tabContents: ElementRef;
  @ViewChild('tabsIndicator', { static: true, read: ElementRef }) tabsIndicator?: ElementRef;
  @Input() selectedIndexOnChange: 'auto' | number = 'auto';
  /**
   * Keep the content.
   * By default, when changing a tab, the previous one is created and deleted.
   * With this, the content will only be hidden instead of deleting it.
   */
  @Input()
  set keepContent(val: boolean) {
    const newVal = toBoolean(val);
    this._keepContent = newVal;
  }
  get keepContent() {
    return this._keepContent;
  }
  private _keepContent: boolean;

  /**
   * Whether the tab group should grow to the size of the active tab.
   */
  @Input()
  set dynamicHeight(val: boolean) {
    const newVal = toBoolean(val);
    this._dynamicHeight = newVal;
  }
  get dynamicHeight() {
    return this._dynamicHeight;
  }
  private _dynamicHeight: boolean;

  @Input()
  set scrollable(val: any) {
    const newVal = toBoolean(val);
    if (newVal) {
      this.renderer.addClass(this.el.nativeElement, this.classes.scrollable);
    } else if (this._scrollable != null) {
      this.renderer.removeClass(this.el.nativeElement, this.classes.scrollable);
    }
    this._scrollable = newVal;
  }
  get scrollable() {
    return this._scrollable;
  }

  @Input()
  @Style<string | null>(
    val => (theme, ref) => {
      const __ = ref.selectorsOf(STYLES);
      return lyl `{
        ${__.tabsIndicator} {
          color:${theme.colorOf(val)}
        }
      }`;
    }
  ) indicatorColor: string;

  @Input()
  set headerPlacement(val: LyTabsHeaderPlacement) {
    if (val !== this.headerPlacement) {
      this._headerPlacement = val;
      this.sRenderer.toggleClass(this.classes.column, val === 'above' || val === 'below');
      this.sRenderer.toggleClass(this.classes.row, val === 'before' || val === 'after');
      this._headerPlacementClass = this.theme.addStyle(`lyTabs.headerPlacement:${val}`,
      () => {
        let flexDirectionContainer: string;
        let flexDirection = this._getFlexDirection(val);
        let position: string;
        let height: string | null = null;
        let width: string | null = null;
        let heightServer: string | null = null;
        let widthServer: string | null = null;
        switch (val) {
          case YPosition.above:
            flexDirectionContainer = 'column';
            position = YPosition.below;
            height = '2px';
            widthServer = '100%';
            break;
          case YPosition.below:
            flexDirectionContainer = 'column-reverse';
            position = YPosition.above;
            height = '2px';
            widthServer = '100%';
            break;
          case XPosition.before:
            flexDirectionContainer = 'row';
            position = XPosition.after;
            width = '2px';
            heightServer = '100%';
            break;
          case XPosition.after:
            flexDirectionContainer = 'row-reverse';
            position = XPosition.before;
            width = '2px';
            heightServer = '100%';
            break;

          default:
            throw new Error(`LyTabs: value:${val} do not is valid for \`headerPlacement\``);
        }
        if (val === YPosition.above || val === YPosition.below) {
          flexDirection = 'row';
        } else {
          flexDirection = 'column';
        }
        return {
          [`&`]: {
            flexDirection: flexDirectionContainer
          },
          [`& .${this.classes.tabsIndicator},& .${this.classes.tabsIndicatorForServer}`]: {
            [position]: 0,
            height,
            width
          },
          [`.${this.classes.tabsIndicatorForServer}`]: {
            width: widthServer,
            height: heightServer
          },
          [`& .${this.classes.tabsLabels},& .${this.classes.tabContents}`]: { flexDirection },
          [`.${this.classes.tabContents}`]: { flexDirection }
        };
      },
      this.el.nativeElement,
      this._headerPlacementClass,
      STYLE_PRIORITY);
      this._updateStylesOfSelectedTab();
    }
  }
  get headerPlacement() {
    return this._headerPlacement;
  }

  @Input()
  set alignTabs(val: AlignTabs) {
    this._alignTabs = val;
    this._alignTabsClass = this.theme.addStyle(`lyAlignTabs: ${val}`,
    (
      val === 'stretch' ? {
        [`& .${this.classes.tabsLabels} .${this.classes.tab}`]: {
          flexBasis: 0,
          flexGrow: 1
        }
      } : {
        [`& .${this.classes.tabsLabels}`]: {
          justifyContent: val in AlignAlias ? AlignAlias[val] : val
        }
      }
    ),
    this.el.nativeElement,
    this._alignTabsClass,
    STYLE_PRIORITY);
  }
  get alignTabs() {
    return this._alignTabs;
  }

  @Input()
  set textColor(val: string) {
    this._textColor = val;
    this._textColorClass = this.theme.addStyle(`lyTabs.textColor:${val}`,
    (theme: ThemeVariables) => ({
      [`& .${this.classes.tabLabelActive}`]: {
        color: theme.colorOf(val)
      }
    }),
    this.el.nativeElement,
    this._textColorClass,
    STYLE_PRIORITY);
  }
  get textColor() {
    return this._textColor;
  }

  @Input()
  set selectedIndex(val: number) {
    if (val !== this.selectedIndex) {
      this._selectedBeforeIndex = this._selectedIndex as number;
      this._selectedIndex = this._findIndex(val, 'auto');
      this._selectedBeforeTab = this._selectedTab!;
      this.selectedIndexChange.emit(this._selectedIndex);
      this._markForCheck();
      Promise.resolve(null).then(() => {
        this._updateStylesOfSelectedTab();
      });
    }
  }
  get selectedIndex() {
    return this._selectedIndex;
  }

  @Output() selectedIndexChange: EventEmitter<any> = new EventEmitter();
  @ContentChildren(forwardRef(() => LyTab)) tabsList: QueryList<LyTab>;
  @ViewChildren('tabContent') tabContentList: QueryList<ElementRef<HTMLDivElement>>;

  constructor(
    private theme: LyTheme2,
    private renderer: Renderer2,
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    private _viewportRuler: ViewportRuler,
    readonly sRenderer: StyleRenderer,
    private _platform: Platform
  ) {
    super(theme);
    this.setAutoContrast();
  }

  ngOnChanges() {
    if (this._isViewInitLoaded) {
      this.updateStyle(this.tabsRef.nativeElement);
    }
  }

  ngOnInit() {
    if (this.selectedIndex == null) {
      this.selectedIndex = 0;
    }
    this.renderer.addClass(this.el.nativeElement, this.classes.root);
    const tabsIndicatorEl = this.tabsIndicator!.nativeElement;
    this.renderer.addClass(tabsIndicatorEl, this.classes.tabsIndicator);
    /** Set default Color */
    if (!this.indicatorColor && !this.bg && !this.textColor && !this.elevation) {
      this.indicatorColor = DEFAULT_INDICATOR_COLOR;
      this.bg = DEFAULT_BG;
      this.elevation = DEFAULT_ELEVATION;
    }
    if (!this.headerPlacement) {
      this.headerPlacement = DEFAULT_HEADER_PLACEMENT;
    }
  }

  ngAfterContentInit() {
    this._tabsSubscription = this.tabsList.changes.subscribe(() => {
      if (this._selectedIndex !== this.selectedIndexOnChange) {
        this.selectedIndex = this._findIndex(this.selectedIndex, this.selectedIndexOnChange);
      }
      this.cd.markForCheck();
    });
  }

  ngAfterViewInit() {
    this.updateStyle(this.tabsRef.nativeElement);
    this._isViewInitLoaded = true;
    if (this._platform.isBrowser) {
      this._tabResizeSub = this._viewportRuler.change().subscribe(() => {
        if (this._selectedTab) {
          this._updateIndicator(this._selectedTab);
          this._selectedTab._tabLabel._updateTabScroll();
        }
      });
    }
  }

  ngOnDestroy() {
    this._tabsSubscription.unsubscribe();
    if (this._tabResizeSub) {
      this._tabResizeSub.unsubscribe();
    }
    Object.keys(this._timeoutIds)
      .forEach((key) => clearTimeout(this._timeoutIds[key]));
  }

  private _findIndex(selectedIndex: number, index: string | number) {
    if (!this.tabsList) {
      return selectedIndex;
    }
    const indexOfLastTab = this.tabsList.length - 1;
    const currentIndex = typeof index === 'number' ? index : selectedIndex;
    return currentIndex < 0 ? 0 : currentIndex > indexOfLastTab ? indexOfLastTab : currentIndex;
  }

  _updateIndicator(currentTab: LyTab, beforeTab?: LyTab): void {
    if (currentTab) {
      if (beforeTab) {
        beforeTab._renderer.removeAttribute(beforeTab._tabIndicator.nativeElement, 'class');
      }
      const el = currentTab._el.nativeElement as HTMLElement;
      const rects = el.getBoundingClientRect();

      if (this.headerPlacement === XPosition.after || this.headerPlacement === XPosition.before) {
        this.renderer.setStyle(this.tabsIndicator!.nativeElement, 'height', `${rects.height}px`);
        this.renderer.setStyle(this.tabsIndicator!.nativeElement, 'top', `${el.offsetTop}px`);
        this.renderer.removeStyle(this.tabsIndicator!.nativeElement, 'width');
        this.renderer.removeStyle(this.tabsIndicator!.nativeElement, 'left');
      } else {
        this.renderer.setStyle(this.tabsIndicator!.nativeElement, 'width', `${rects.width}px`);
        this.renderer.setStyle(this.tabsIndicator!.nativeElement, 'left', `${el.offsetLeft}px`);
        this.renderer.removeStyle(this.tabsIndicator!.nativeElement, 'height');
        this.renderer.removeStyle(this.tabsIndicator!.nativeElement, 'top');
      }
    }
  }

  private _updateStylesOfSelectedTab() {
    const index = this._selectedIndex;
    const placement = this.headerPlacement;
    this._selectedIndexClass = this._theme.addStyle(`lyTabs.selectedIndex:${index}+${placement}`, (theme: ThemeVariables) => {
      let sign = 1;
      const position = this._getFlexDirection(placement) === 'column' ? 'Y' : 'X';
      if (theme.direction === Dir.ltr || position === 'Y') {
        sign = -1;
      }
      return {
        transform: `translate${position}(${index * 100 * sign}%)`
      };
    }, this.tabContents.nativeElement, this._selectedIndexClass, STYLE_PRIORITY);
    this.renderer.addClass(this.tabContents.nativeElement, this._selectedIndexClass);
  }

  private _updateDynamicHeight(container: HTMLDivElement, tabIndex: number) {
    if (this._timeoutIds[tabIndex] != null) {
      window.clearTimeout(this._timeoutIds[tabIndex]);
    }
    // Update currently selected tab
    if (this.selectedIndex === tabIndex) {
      const contentInnerHeightBefore = this._platform.isBrowser
        ? (this.tabContents.nativeElement as HTMLElement)
          .getBoundingClientRect().height
        : null;
      this.renderer.removeClass(container, this.classes.hiddenContent);

      if (this._platform.isBrowser && this.dynamicHeight) {
        if (this._timeoutIds[tabIndex] != null) {
          window.clearTimeout(this._timeoutIds[tabIndex]);
        }
        const { headerPlacement: placement } = this;
        const {
          height: contentInnerHeight,
        } = (container.firstElementChild! as HTMLElement)
          .getBoundingClientRect();
        const { curves, durations } = this._theme.variables.animations;
        // row
        if (placement === 'above' || placement === 'below') {
          container.style.height = `${contentInnerHeightBefore}px`;
          window.getComputedStyle(container).getPropertyValue('opacity');
          container.style.transition = `height ${curves.standard} ${durations.complex}ms`;
          container.style.height = `${contentInnerHeight}px`;
        }
        this._timeoutIds[`_${tabIndex}`] = setTimeout(() => {
          container.style.height = '';
          container.style.transition = '';
          delete this._timeoutIds[`_${tabIndex}`];
        }, 450);
      }

    } else { // Update previous selected tab
      if (this._platform.isBrowser && this._selectedBeforeIndex === tabIndex) {
        if (this.dynamicHeight) {
          const { nativeElement: contentAfter } = this.tabContentList
            .find((_, index) => index === this._selectedIndex)!;
          const { nativeElement: contentBefore } = this.tabContentList
            .find((_, index) => index === tabIndex)!;
          const {
            height: contentInnerHeightBefore,
          } = (this.tabContents.nativeElement as HTMLElement)
            .getBoundingClientRect();
          const {
            height: contentInnerHeightAfter,
          } = (contentAfter.firstElementChild! as HTMLElement)
            .getBoundingClientRect();

          const { curves, durations } = this._theme.variables.animations;
          contentBefore.style.height = `${contentInnerHeightBefore}px`;
          window.getComputedStyle(contentBefore).getPropertyValue('opacity');
          contentBefore.style.transition = `height ${curves.standard} ${durations.complex}ms`;
          contentBefore.style.height = `${contentInnerHeightAfter}px`;
          contentBefore.style.overflowY = 'hidden';
          contentAfter.style.overflowY = 'hidden';
          this._timeoutIds[`__${tabIndex}`] = window.setTimeout(() => {
            contentBefore.style.height = '';
            contentBefore.style.transition = '';
            contentBefore.style.overflowY = '';
            contentAfter.style.overflowY = '';
            delete this._timeoutIds[`_${tabIndex}`];
          }, 450);
        }
        this._timeoutIds[tabIndex] = window.setTimeout(() => {
          this.renderer.addClass(container, this.classes.hiddenContent);
          delete this._timeoutIds[tabIndex];
        }, 450);
      } else {
        this.renderer.addClass(container, this.classes.hiddenContent);
      }
    }
  }

  _markForCheck() {
    this.cd.markForCheck();
  }

  loadTemplate(tab: LyTab, index: number, tabContent: HTMLDivElement): TemplateRef<LyTabContent> | null {
    tab.index = index;
    if (this.selectedIndex === tab.index) {
      // set 0 if is null
      this._selectedTab = tab;
      Promise.resolve(null).then(() => {
        this._updateDynamicHeight(tabContent, index);
        if (this._platform.isBrowser) {
          this._updateIndicator(tab);
        } else {
          // for server
          const selectedBeforeTab = this._selectedBeforeTab;
          if (selectedBeforeTab) {
            this.renderer.removeClass(selectedBeforeTab._tabIndicator.nativeElement, this.classes.tabsIndicatorForServer);
          }
          this.renderer.addClass(this._selectedTab!._tabIndicator.nativeElement, this.classes.tabsIndicatorForServer);
        }
      });
    } else {
      Promise.resolve(null).then(() => this._updateDynamicHeight(tabContent, index));
    }
    tab._tabLabel._updateTabState();
    if (this.keepContent) {
      return tab._templateRefLazy || tab._templateRef;
    }
    if (this.selectedIndex === tab.index) {
      return tab._templateRefLazy || tab._templateRef;
    }
    return null;
  }

  private _getFlexDirection(val: LyTabsHeaderPlacement) {
    let flexDirection: string;
    if (val === YPosition.above || val === YPosition.below) {
      flexDirection = 'row';
    } else {
      flexDirection = 'column';
    }
    return flexDirection;
  }
}

@Component({
  selector: 'ly-tab',
  templateUrl: './tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    StyleRenderer
  ]
})
export class LyTab implements OnInit {
  /** Current tab index */
  index: number;
  _isBrowser = this._platform.isBrowser;
  @ContentChild(LyTabContent, { read: TemplateRef, static: true }) _templateRefLazy: TemplateRef<LyTabContent>;
  @ViewChild('_templateNgContent', { static: true }) _templateRef: TemplateRef<any>;
  @ViewChild('tabIndicator') _tabIndicator: ElementRef;
  @ContentChild(forwardRef(() => LyTabLabel), { static: true }) _tabLabel: LyTabLabel & { };

  constructor(
    private _tabs: LyTabs,
    public _renderer: Renderer2,
    public _el: ElementRef,
    readonly sRenderer: StyleRenderer,
    private _platform: Platform
  ) { }

  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, this._tabs.classes.tab);
  }
}

@Component({
  selector: 'button[ly-tab-label], a[ly-tab-label]',
  templateUrl: 'tab-label.html',
  inputs: [
    'bg',
    'color',
    'raised',
    'disabled',
    'outlined',
    'elevation',
    'shadowColor',
    'disableRipple'
  ],
  providers: [
    StyleRenderer
  ]
})
export class LyTabLabel extends LyButton implements OnInit, AfterViewInit {
  private _activeTabStyle: boolean;
  private _active: boolean;
  disableRipple: boolean;
  _isBrowser = this._platform.isBrowser;

  @Input()
  get active() {
    return this._active;
  }
  set active(val: boolean) {
    const newVal = toBoolean(val);
    if (newVal && val !== this.active) {
      Promise.resolve(null).then(() => this._tabs.selectedIndex = this._tab.index);
    }
  }

  @ViewChild('rippleContainer') _rippleContainer: ElementRef;
  @HostListener('click') _onClickTab() {
    if (!this.disabled) {
      this._tabs.selectedIndex = this._tab.index;
    }
  }


  constructor(
    _el: ElementRef,
    _renderer: Renderer2,
    _theme: LyTheme2,
    _ngZone: NgZone,
    _rippleService: LyRippleService,
    _focusState: LyFocusState,
    readonly sRenderer: StyleRenderer,
    @Optional() private _tab: LyTab,
    @Optional() private _tabs: LyTabs,
    platform: Platform
  ) {
    super(_el, _renderer, _theme, _ngZone, _rippleService, _focusState, sRenderer, platform, null as any);
  }

  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, this._tabs.classes.label);
    // set default disable ripple
    if (this.disableRipple == null) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }
  }

  _updateTabState() {
    // update styles for active tab
    if (this._tabs._selectedIndex === this._tab.index) {
      if (!this._activeTabStyle) {
        this._activeTabStyle = true;
        this._renderer.addClass(this._el.nativeElement, this._tabs.classes.tabLabelActive);
        this._updateTabScroll();
      }
    } else if (this._activeTabStyle) {
      this._activeTabStyle = false;
      this._renderer.removeClass(this._el.nativeElement, this._tabs.classes.tabLabelActive);
    }
  }

  _updateTabScroll() {
    if (this._platform.isBrowser && this._tabs.scrollable) {
      const tab = this._tab._el.nativeElement as HTMLElement;
      const tabContainer = this._tabs.tabsRef.nativeElement as HTMLElement;
      if (tabContainer.scrollWidth !== tabContainer.offsetWidth) {
        const dir = this._theme.variables.direction;
        const max = tabContainer.scrollWidth - tabContainer.offsetWidth;
        const offsetBefore = dir === Dir.rtl
        ? max + tab.offsetLeft
        : tab.offsetLeft;
        const l = offsetBefore + tab.offsetWidth / 2 - tabContainer.offsetWidth / 2;
        const newVal = l >= max ? max : l <= 0 ? 0 : l;
        scrollWithAnimation(this._tabs.tabsRef.nativeElement, newVal, 350, 'x');
      }
    }
  }

  ngAfterViewInit() { }
}

