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
  SimpleChanges,
  isDevMode
  } from '@angular/core';
import {
  LyTheme2,
  mixinBg,
  mixinColor,
  mixinDisabled,
  mixinDisableRipple,
  mixinElevation,
  mixinFlat,
  mixinOutlined,
  mixinRaised,
  mixinShadowColor,
  mixinStyleUpdater,
  Platform,
  } from '@alyle/ui';
import { LyTabContent } from './tab-content.directive';
import { LyTabsClassesService } from './tabs.clasess.service';
import { Subscription } from 'rxjs';

const DEFAULT_DISABLE_RIPPLE = false;

/** @docs-private */
export class LyTabsBase {
  constructor(
    public _theme: LyTheme2
  ) { }
}

/** @docs-private */
export const LyTabsMixinBase = mixinBg(mixinFlat(mixinColor(LyTabsBase)));

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
  mixinFlat(
    mixinColor(
      mixinRaised(
        mixinDisabled(
          mixinOutlined(
            mixinElevation(
              mixinShadowColor(
                mixinDisableRipple(LyTabLabelBase))))))))));

@Component({
  selector: 'ly-tabs',
  templateUrl: './tabs.directive.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'lyTabs',
  inputs: [
    'bg', 'flat', 'color'
  ]
})
export class LyTabs extends LyTabsMixinBase implements OnChanges, OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  _selectedIndex = 0;
  _selectedBeforeIndex: number;
  _selectedTab: LyTab;
  _selectedBeforeTab: LyTab;
  private _tabsSubscription = Subscription.EMPTY;
  private _isViewInitLoaded: boolean;
  private _withColor: string;
  private _withColorClass: string;
  readonly classes;
  @ViewChild('tabContents') tabContents: ElementRef;
  @ViewChild('tabsIndicator') tabsIndicator: ElementRef;
  @Input() selectedIndexOnChange: 'auto' | number = 'auto';
  @Input() native: boolean;
  @Input()
  set withColor(val: string) {
    if (val !== this.withColor) {
      this._withColor = val;
      this._withColorClass = this.theme.addStyle(
        `k-tab-with-color:${val}`,
        theme => (
          `color:${theme.colorOf(val)};`
        ),
        this.tabsIndicator.nativeElement, this._withColorClass);
      if (this._selectedTab) {
        this.theme.updateClass(this._selectedTab.tabIndicator.nativeElement, this.renderer, this._withColorClass);
      }
    }
  }
  get withColor() {
    return this._withColor;
  }
  @Input()
  set selectedIndex(val: number) {
    if (val !== this.selectedIndex) {
      this._selectedBeforeIndex = this._selectedIndex as number;
      this._selectedIndex = this._findIndex(val, 'auto');
      this._selectedBeforeTab = this._selectedTab;
      this.selectedIndexChange.emit(this._selectedIndex);
      this._updateIndicator(this._selectedTab, this._selectedBeforeTab);

      this.markForCheck();
      this.renderer.setStyle(this.tabContents.nativeElement, 'transform', `translate3d(${this._selectedIndex * -100}%,0,0)`);
    }
  }
  get selectedIndex() {
    return this._selectedIndex as number;
  }
  @Output() selectedIndexChange: EventEmitter<any> = new EventEmitter();
  @Input() withBg: string;
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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.color) {
      this.withColor = changes.color.currentValue;
    }
    if (changes.bg) {
      this.withBg = changes.bg.currentValue;
    }
    if (isDevMode() && changes.withColor) {
      console.warn(`LyTabs > \`withColor\` is deprecated, instead use \`color\``);
    }
    if (isDevMode() && changes.withBg) {
      console.warn(`LyTabs > \`withColor\` is deprecated, instead use \`bg\``);
    }
  }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.classes.root);
    const tabsIndicatorEl = this.tabsIndicator.nativeElement;
    this.renderer.addClass(tabsIndicatorEl, this.classes.tabsIndicator);
    /** Set default Color */
    if (!this.withColor && !this.color) {
      this.withColor = 'primary';
    }
  }

  ngAfterViewInit() {
    this._isViewInitLoaded = true;
  }
  ngAfterContentInit() {
    this._tabsSubscription = this.tabsList.changes.subscribe(() => {
      if (this._selectedIndex !== this.selectedIndexOnChange) {
        this.selectedIndex = this._findIndex(this.selectedIndex, this.selectedIndexOnChange);
      }
      this.cd.markForCheck();
    });
  }
  ngOnDestroy() {
    this._tabsSubscription.unsubscribe();
  }

  private _getHostElement() {
    return this.el.nativeElement;
  }

  private _findIndex(selectedIndex: number, index: string | number) {
    if (!this.tabsList) {
      return selectedIndex;
    }
    const indexOfLastTab = this.tabsList.length - 1;
    const currentIndex = typeof index === 'number' ? index : selectedIndex;
    return currentIndex < 0 ? 0 : currentIndex > indexOfLastTab ? indexOfLastTab : currentIndex;
  }

  private _updateIndicator(currentTab: LyTab, beforeTab?: LyTab): void {
    const currentIndex = this.selectedIndex;
    if (currentTab) {
      // currentTab = this.tabsList.find(_ => _.index === currentIndex);
      if (!this._isViewInitLoaded || !Platform.isBrowser) {
        /** for before initialize or for server */
        this.renderer.addClass(currentTab.tabIndicator.nativeElement, this.classes.tabsIndicatorForServer);
        this.renderer.addClass(currentTab.tabIndicator.nativeElement, this._withColorClass);
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
        this.renderer.setStyle(this.tabsIndicator.nativeElement, 'width', `${rects.width}px`);
        this.renderer.setStyle(this.tabsIndicator.nativeElement, 'left', `${el.offsetLeft}px`);
      }
    }
  }

  markForCheck() {
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
export class LyTab implements OnInit, AfterViewInit {
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

  ngAfterViewInit() {
    this._renderer.addClass(this.tabIndicator.nativeElement, this.classes.tabsIndicator);
  }
}

@Directive({
  selector: 'ly-tab-label, [ly-tab-label]'
})
export class LyTabLabel extends LyTabLabelMixinBase implements OnChanges, OnInit, OnDestroy {
  constructor(
    private renderer: Renderer2,
    private _el: ElementRef,
    private _tabsService: LyTabsClassesService,
    _ngZone: NgZone,
    _theme: LyTheme2
  ) {
    super(_theme, _ngZone);
    this.setAutoContrast();
    this._triggerElement = _el;
    this._rippleContainer = _el;
  }

  ngOnChanges() {
    this.updateStyle(this._el);
  }

  ngOnInit() {
    this.renderer.addClass(this._el.nativeElement, this._tabsService.classes.label);
    // set default disable ripple
    if (this.disableRipple === null) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }
  }

  ngOnDestroy() {
    this._removeRippleEvents();
  }
}

/**
 * demo basic
 * <ly-tabs withColor="accent">
 *   <ly-tab>
 *     <ly-tab-label>HOME<ly-tab-label>
 *     <button ly-tab-label>HOME<button>
 *     <button ly-tab-label-native ly-button>HOME<button>
 *     <a [routerLink]="['home']" ly-tab-label native ly-button>HOME<a>
 *     Content
 *   </ly-tab>
 *   ...
 * </ly-tabs>
 *
 * demo lazy loading
 * <ly-tabs withBg="primary">
 *   <ly-tab>
 *     <ly-tab-label>HOME<ly-tab-label>
 *     <ng-template ly-tab-content></ng-template>
 *   </ly-tab>
 *   ...
 * </ly-tabs>
 * => withColor: color del label activa, default primary
 * => withBg: color de fondo para la tab, default background:primary
 * => native: no aplica los estilos predeterminados, default undefined
 * => disabled: Disable/enable a tab, default undefined
 * => isActive: Si la pestaña está actualmente activa., default undefined
 * => selectedIndexOnChange, default: auto, opts: number, with auto, the selectedIndex = current o current-1 or latest
 */
