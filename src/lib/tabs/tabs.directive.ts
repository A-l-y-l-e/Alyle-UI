import {
  Component,
  Directive,
  Input,
  ChangeDetectionStrategy,
  ContentChildren,
  QueryList,
  Output,
  TemplateRef,
  ContentChild,
  ViewChild,
  HostListener,
  forwardRef,
  EventEmitter,
  ChangeDetectorRef,
  Renderer2,
  ElementRef,
  OnInit,
  ViewEncapsulation,
  AfterViewInit
} from '@angular/core';
import { LyTabContent } from './tab-content.directive';
import { LyTabsClassesService } from './tabs.clasess.service';
import { UndefinedValue, Undefined, LyTheme2, Platform } from '@alyle/ui';

@Component({
  selector: 'ly-tabs',
  templateUrl: './tabs.directive.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'lyTabs'
})
export class LyTabs implements OnInit, AfterViewInit {
  _selectedIndex: number | Undefined = UndefinedValue;
  _selectedBeforeIndex: number;
  _selectedRequireCheck: boolean;
  _selectedTab: LyTab;
  _selectedBeforeTab: LyTab;
  private _isViewInitLoaded: boolean;
  private _withColor: string;
  private _withColorClass: string;
  @ViewChild('tabContents') tabContents: ElementRef;
  @ViewChild('tabsIndicator') tabsIndicator: ElementRef;
  @Input()
  set withColor(val: string) {
    if (val !== this.withColor) {
      const newClass = this._createWithColorClass(val);
      this._withColorClass = this.theme.updateClass(this.tabsIndicator.nativeElement, this.renderer, newClass, this._withColorClass);
      if (this._selectedTab) {
        this.theme.updateClass(this._selectedTab.tabIndicator.nativeElement, this.renderer, newClass, this._withColorClass);
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
      this._selectedIndex = val;
      this._selectedBeforeTab = this._selectedTab;
      this.selectedIndexChange.emit(val);
      this._updateIndicator(this._selectedTab, this._selectedBeforeTab);

      if (this._selectedRequireCheck) {
        this.markForCheck();
      }
      this.renderer.setStyle(this.tabContents.nativeElement, 'transform', `translate3d(${val * -100}%,0,0)`);
    }
  }
  get selectedIndex() {
    return this._selectedIndex as number;
  }
  @Output() selectedIndexChange: EventEmitter<any> = new EventEmitter();
  @Input() withBg: string;
  @ContentChildren(forwardRef(() => LyTab)) tabsList: QueryList<LyTab>;

  constructor(
    public classes: LyTabsClassesService,
    private theme: LyTheme2,
    private renderer: Renderer2,
    private el: ElementRef,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.classes.tabs);
    const tabsIndicatorEl = this.tabsIndicator.nativeElement;
    this.renderer.addClass(tabsIndicatorEl, this.classes.tabsIndicator);
    /** Set default Color */
    if (!this.withColor) {
      this.withColor = 'primary';
    }
  }

  ngAfterViewInit() {
    this._isViewInitLoaded = true;
  }

  private _updateIndicator(currentTab: LyTab, beforeTab?: LyTab): void {
    const currentIndex = this.selectedIndex;
    if (currentTab) {
      // currentTab = this.tabsList.find(_ => _.index === currentIndex);
      if (!this._isViewInitLoaded || !Platform.isBrowser) {
        /** for before initialize or for server */
        this.renderer.addClass(currentTab.tabIndicator.nativeElement, this.classes.tabsIndicatorForServer);
        this.renderer.addClass(currentTab.tabIndicator.nativeElement, this._withColorClass);
        /**
         * TODO: tabs: update indicator when change `selectedIndex`
         */
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
    if (tab.loaded) {
      return null;
    }
    tab.index = index;
    if (this.selectedIndex === UndefinedValue) {
      // set 0 if is null
      this._selectedTab = tab;
      this.selectedIndex = 0;
    } else if (!this._isViewInitLoaded && this.selectedIndex === tab.index) {
      this._selectedTab = tab;
      /** Apply style for tabIndicator server */
      this._updateIndicator(tab);
    }
    if (tab.templateRefLazy) {
      if (this.selectedIndex === index) {
        tab.loaded = true;
        return tab.templateRefLazy;
      } else {
        return null;
      }
    } else {
      tab.loaded = true;
      return tab.templateRef;
    }
  }

  private _createWithColorClass(val: string) {
    this._withColor = val;
    return this.theme.setUpStyle(
      `k-tab-with-color:${val}`,
      () => (
        `color:${this.theme.colorOf(val)};`
      )
    );
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
  loaded: boolean;
  @ContentChild(LyTabContent, { read: TemplateRef }) templateRefLazy: TemplateRef<LyTabContent>;
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  @ViewChild('tabIndicator') tabIndicator: ElementRef;
  @HostListener('click') onClick() {
    this.tabs._selectedRequireCheck = !this.loaded;
    this.tabs.selectedIndex = this.index;
  }

  constructor(
    private tabs: LyTabs,
    public _renderer: Renderer2,
    public _el: ElementRef,
  ) { }

  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, this.tabs.classes.tab);
  }

  ngAfterViewInit() {
    this._renderer.addClass(this.tabIndicator.nativeElement, this.tabs.classes.tabsIndicator);
  }
}

@Directive({
  selector: 'ly-tab-label, [ly-tab-label]'
})
export class LyTabLabel implements OnInit {
  @Input() native: boolean;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private classes: LyTabsClassesService
  ) { }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.classes.tabLabel);
  }
}
/**
 * demo basic
 * <ly-tabs withColor="accent">
 *   <ly-tab>
 *     <ly-tab-label>HOME<ly-tab-label>
 *     <button ly-tab-label>HOME<button>
 *     <button ly-tab-label native ly-button>HOME<button>
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
 */
