import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
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
  DoCheck
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
  Platform,
  ThemeVariables,
  AlignAlias,
  YPosition,
  XPosition,
  Dir,
  LyRippleService,
  LyFocusState
  } from '@alyle/ui';
import { LyButton } from '@alyle/ui/button';
import { LyTabContent } from './tab-content.directive';
import { LyTabsClassesService } from './tabs.clasess.service';
import { Subscription } from 'rxjs';

const DEFAULT_DISABLE_RIPPLE = false;
const STYLE_PRIORITY = -2;
const DEFAULT_BG = 'primary';
const DEFAULT_INDICATOR_COLOR = 'accent';
const DEFAULT_ELEVATION = 4;
const DEFAULT_HEADER_PLACEMENT = 'above';
export type AlignTabs = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type LyTabsHeaderPlacement = 'before' | 'after' | 'above' | 'below';
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
    public _ngZone: NgZone
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

@Component({
  selector: 'ly-tabs',
  templateUrl: './tabs.directive.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'lyTabs',
  inputs: [
    'bg', 'elevation', 'shadowColor'
  ]
})
export class LyTabs extends LyTabsMixinBase implements OnChanges, OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  _selectedIndex = 0;
  _selectedBeforeIndex: number;
  _selectedTab: LyTab;
  _selectedBeforeTab: LyTab;
  private _tabsSubscription = Subscription.EMPTY;
  private _isViewInitLoaded: boolean;
  private _color: string;
  private _colorClass: string;
  private _headerPlacement: LyTabsHeaderPlacement;
  private _headerPlacementClass: string;
  private _alignTabs: AlignTabs;
  private _alignTabsClass: string;
  private _textColor: string;
  private _textColorClass: string;
  private _selectedIndexClass: string;

  private _flexDirection: string;
  readonly classes;
  @ViewChild('tabs') tabsRef: ElementRef;
  @ViewChild('tabContents') tabContents: ElementRef;
  @ViewChild('tabsIndicator') tabsIndicator: ElementRef;
  @Input() selectedIndexOnChange: 'auto' | number = 'auto';
  @Input() native: boolean;
  @Input()
  set indicatorColor(val: string) {
    if (val !== this.indicatorColor) {
      this._color = val;
      this._colorClass = this.theme.addStyle(
        `k-tab-indicator-color:${val}`,
        theme => (
          `color:${theme.colorOf(val)};`
        ),
        this.tabsIndicator.nativeElement, this._colorClass);
      if (this._selectedTab) {
        this.theme.updateClass(this._selectedTab.tabIndicator.nativeElement, this.renderer, this._colorClass);
      }
    }
  }
  get indicatorColor() {
    return this._color;
  }

  @Input()
  set headerPlacement(val: LyTabsHeaderPlacement) {
    this._headerPlacement = val;
    let flexDirection: string;
    if (val === YPosition.above || val === YPosition.above) {
      flexDirection = 'row';
    } else {
      flexDirection = 'column';
    }
    this._flexDirection = flexDirection;
    this._headerPlacementClass = this.theme.addStyle(`lyTabs.headerPlacement:${val}`,
    () => {
      let flexDirectionContainer: string;
      let position: string;
      let height: string = null;
      let width: string = null;
      let heightServer: string = null;
      let widthServer: string = null;
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
      if (val === YPosition.above || val === YPosition.above) {
        flexDirection = 'row';
      } else {
        flexDirection = 'column';
      }
      return {
        [`.${this.classes.container}`]: {
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
        [`&>.${this.classes.tabsLabels} .${this.classes.tab}`]: {
          flexBasis: 0,
          flexGrow: 1
        }
      } : {
        [`&>.${this.classes.tabsLabels}`]: {
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
      const index = this._selectedIndex = this._findIndex(val, 'auto');
      this._selectedBeforeTab = this._selectedTab;
      this.selectedIndexChange.emit(this._selectedIndex);
      this._updateIndicator(this._selectedTab, this._selectedBeforeTab);

      this._markForCheck();
      const position = this._flexDirection === 'column' ? 'Y' : 'X';
      this._selectedIndexClass = this._theme.addStyle(`lyTabs.selectedIndex:${index}·${position}`, (theme: ThemeVariables) => {
        let sign = 1;
        if (theme.direction === Dir.ltr || position === 'Y') {
          sign = -1;
        }
        return {
          transform: `translate${position}(${index * 100 * sign}%)`
        };
      }, this.tabContents.nativeElement, this._selectedIndexClass, STYLE_PRIORITY);
      Promise.resolve(null).then(() => {
        this.renderer.addClass(this.tabContents.nativeElement, this._selectedIndexClass);
      });
    }
  }
  get selectedIndex() {
    return this._selectedIndex as number;
  }

  @Output() selectedIndexChange: EventEmitter<any> = new EventEmitter();
  @ContentChildren(forwardRef(() => LyTab)) tabsList: QueryList<LyTab>;

  constructor(
    tabsService: LyTabsClassesService,
    private theme: LyTheme2,
    private renderer: Renderer2,
    private el: ElementRef,
    private cd: ChangeDetectorRef
  ) {
    super(theme);
    this.classes = tabsService.classes;
    this.setAutoContrast();
  }

  ngOnChanges() {
    if (this._isViewInitLoaded) {
      this.updateStyle(this.tabsRef.nativeElement);
    }
  }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.classes.root);
    const tabsIndicatorEl = this.tabsIndicator.nativeElement;
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
  }

  ngOnDestroy() {
    this._tabsSubscription.unsubscribe();
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
    const currentIndex = this.selectedIndex;
    if (currentTab) {
      if (!this._isViewInitLoaded || !Platform.isBrowser) {
        /** for before initialize or for server */
        this.renderer.addClass(currentTab.tabIndicator.nativeElement, this.classes.tabsIndicatorForServer);
        this.renderer.addClass(currentTab.tabIndicator.nativeElement, this._colorClass);
      } else {
        // for after initialize && for browser
        // Clean before tab
        if (beforeTab) {
          beforeTab._renderer.removeAttribute(beforeTab.tabIndicator.nativeElement, 'class');
        }
        if (currentTab.index !== currentIndex) {
          // this fixed undefined selected tab
          currentTab = this.tabsList.toArray()[currentIndex];
        }
        const el = currentTab._el.nativeElement as HTMLElement;
        const rects = el.getBoundingClientRect();

        if (this.headerPlacement === XPosition.after || this.headerPlacement === XPosition.before) {
          this.renderer.setStyle(this.tabsIndicator.nativeElement, 'height', `${rects.height}px`);
          this.renderer.setStyle(this.tabsIndicator.nativeElement, 'top', `${el.offsetTop}px`);
        } else {
          this.renderer.setStyle(this.tabsIndicator.nativeElement, 'width', `${rects.width}px`);
          this.renderer.setStyle(this.tabsIndicator.nativeElement, 'left', `${el.offsetLeft}px`);
        }
      }
    }
  }

  _markForCheck() {
    this.cd.markForCheck();
  }

  loadTemplate(tab: LyTab, index: number): TemplateRef<LyTabContent> | null {
    tab.index = index;
    if (this.selectedIndex === tab.index) {
      // set 0 if is null
      this._selectedTab = tab;
      this._updateIndicator(tab);
    }
    if (this.selectedIndex === tab.index) {
      return tab.templateRefLazy || tab.templateRef;
    } else {
      return null;
    }
  }
}

@Component({
  selector: 'ly-tab',
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LyTab implements OnInit {
  index: number;
  protected readonly classes;
  @ContentChild(LyTabContent, { read: TemplateRef }) templateRefLazy: TemplateRef<LyTabContent>;
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  @ViewChild('tabIndicator') tabIndicator: ElementRef;
  @HostListener('click') onClick() {
    this.tabs.selectedIndex = this.index;
  }

  constructor(
    private tabsService: LyTabsClassesService,
    private tabs: LyTabs,
    public _renderer: Renderer2,
    public _el: ElementRef
  ) {
    this.classes = this.tabsService.classes;
  }

  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, this.classes.tab);
  }
}

@Component({
  selector: 'button[ly-tab-label]',
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
  host: {
    '[disabled]': 'disabled'
  }
})
export class LyTabLabel extends LyButton implements OnInit, DoCheck {
  private _active: boolean;
  protected _isBrowser = Platform.isBrowser;
  @ViewChild('rippleContainer') _rippleContainer: ElementRef;
  constructor(
    _el: ElementRef,
    _renderer: Renderer2,
    _theme: LyTheme2,
    _ngZone: NgZone,
    _rippleService: LyRippleService,
    _focusState: LyFocusState,
    private _tabsService: LyTabsClassesService,
    private _tab: LyTab,
    private _tabs: LyTabs
  ) {
    super(_el, _renderer, _theme, _ngZone, _rippleService, _focusState);
  }

  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, this._tabsService.classes.label);
    // set default disable ripple
    if (this.disableRipple === null) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }
  }

  ngDoCheck() {
    Promise.resolve(null).then(() => {
      if (this._tabs._selectedIndex === this._tab.index) {
        if (!this._active) {
          this._active = true;
          this._renderer.addClass(this._el.nativeElement, this._tabsService.classes.tabLabelActive);
          /** Update tab indicator */
          if (Platform.isBrowser) {
            this._tabs._updateIndicator(this._tab);
          }
        }
      } else if (this._active) {
        this._active = false;
        this._renderer.removeClass(this._el.nativeElement, this._tabsService.classes.tabLabelActive);
      }
    });
  }
}

/**
 * demo basic
 * <ly-tabs withColor="accent">
 *   <ly-tab>
 *     <button ly-tab-label>HOME</button>
 *     Content
 *   </ly-tab>
 *   <ly-tab>
 *     <button ly-tab-label>HOME</button>
 *     Content
 *   </ly-tab>
 *   ...
 * </ly-tabs>
 *
 * demo lazy loading
 * <ly-tabs withBg="primary">
 *   <ly-tab>
 *     <button ly-tab-label>HOME</button>
 *     <ng-template ly-tab-content></ng-template>
 *   </ly-tab>
 *   ...
 * </ly-tabs>
 * => selectedIndexOnChange, default: auto, opts: number, with auto, the selectedIndex = current o current-1 or latest
 */
