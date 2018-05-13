import {
  Component,
  Directive,
  Renderer,
  ElementRef,
  ViewEncapsulation,
  NgModule,
  ModuleWithProviders,
  Input,
  ContentChildren,
  ContentChild,
  QueryList,
  ViewContainerRef,
  ViewChild,
  TemplateRef,
  OnInit,
  forwardRef,
  OnChanges,
  HostBinding,
  Output,
  EventEmitter,
  Optional,
  SimpleChanges,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { LyTheme, BgAndColorStyle, LyStyleTheme, themeProperty, ThemeVariables } from '@alyle/ui';
import { CommonModule } from '@angular/common';
import { getParents } from '@alyle/ui';
import { Subscription } from 'rxjs';
import { LyButton } from '@alyle/ui/button';

let idTab = 0;

@Component({
  selector: 'ly-tab-group, ly-tabs',
  styleUrls: ['tabs.scss'],
  templateUrl: './tabs.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LyTabGroupComponent implements OnInit, OnChanges {

  private _bg = 'rgba(0, 0, 0, 0)'; // private
  private _color = 'primary'; // private
  private _subscription: Subscription;
  timeout: any;
  xtemplateRef: any;
  tabRows = 0;
  _selectedIndex = 0;
  _margin: number;
  tabWidth = 0;
  tabLeft = 0;
  @ContentChildren(forwardRef(() => LyTab)) tabs: QueryList<LyTab>;
  @ContentChild(LyButton) lyButton: LyButton;
  _isInitialized = false;
  @ViewChild('tabsContent') _tabsContent: ElementRef;
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

  @Input()
  set selectedIndex(value: number) {

    if (this.tabs) {
      if (this.tabs.toArray()[value]) {
        this.tabs.toArray()[value].setIndex(value);
      }
    } else {
      // this.updateTabsHeader();
      this._selectedIndex = value;
    }
    // if (value) {
    // }
    // if (this._isInitialized == true) {
    //   if (this.tabRows != this.tabs.length) {
    //     this.tabRows = this.tabs.length;
    //   }
    // }
  }
  get selectedIndex(): number { return this._selectedIndex; }

  @Output() selectedIndexChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public elementRef: ElementRef,
    private renderer: Renderer,
    private viewContainerRef: ViewContainerRef,
    public theme: LyTheme,
    public styleTheme: LyStyleTheme,
  ) {
  }
  ngAfterContentInit() {

    this.updateTabsHeader();
    this.tabRows = this.tabs.length;
  }
  ngOnInit() { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedIndex']) {
      if (!changes['selectedIndex'].firstChange) {
        const index = changes['selectedIndex'].currentValue;
        const tabRef = this._tabsContent.nativeElement;
      }
    }
  }
  setTab() {

  }
  updateTab() {
    // this.updateTabsHeader();
  }


  updateTabsHeader() {
    if (!this.tabs) {
      return;
    }
  }
  ngAfterContentChecked() {
    if (this.tabRows != this.tabs.length && this._isInitialized == true) {
      this.tabRows = this.tabs.length;
      // this.updateTabsHeader();
    }
  }
  ngAfterViewChecked() {
    this._isInitialized = true;

  }
  updateTabIndicator(tab: HTMLElement) {
    if (!tab) {
      return;
    }
    Promise.resolve(null).then(() => {
      this.tabWidth = tab.offsetWidth;
      this.tabLeft = tab.offsetLeft;
    });
  }
  private sMargin(tab: HTMLElement, index: number) {
    if (index === 0) {
      this._margin = tab.offsetLeft * 2;
    }
  }
  ngAfterViewInit() {
    /**
     * TODO: fix--> recibir el enevto del boton, crear evento del boton y actualizar line
     */

    this.tabs.forEach((item: LyTab, index: number) => {
      this.sMargin(item.elementRef.nativeElement, index);
      item._index = index;
      const tabRef = item.elementRef.nativeElement;
      if (this._selectedIndex == index && !!tabRef) {
        if (!!item.lyButton) {
          // Promise.resolve(null).then(() => {
          //   item.lyButton.buttonPadding.subscribe((val) => {
          //     this.updateTabIndicator(tabRef);
          //   });
          // });
        } else {
          this.updateTabIndicator(tabRef);
        }
      }
    });
    this.tabs.changes.subscribe((tabs: LyTab[]) => {
      idTab = 0;
      tabs.forEach((item: LyTab, index: number) => {
        const tabRef = item.elementRef.nativeElement;
        this.sMargin(tabRef, index);
        item._index = index;
        if (this._selectedIndex == index && !!tabRef) {
          this.updateTabIndicator(tabRef);
        }
      });
    });

  }

}
@Directive({
  selector: '[ly-tab-content]',
})
export class LyTabContent {
  // @ViewChild(TemplateRef) content: TemplateRef<any>;
  // constructor() {}
}
@Component({
  selector: 'ly-tab',
  styleUrls: ['tab.scss'],
  templateUrl: './tab.html',
})
export class LyTab {
  _index = 0;
  _indexGroup = 0;
  stateTab: boolean;
  private timeout: any;
  public tabRef: TemplateRef<any>;
  @ContentChild(LyButton) lyButton: LyButton;
  get tabStyles() {
    return {color: 'currentColor'};
  }
  @HostBinding('style.color') hostStyle: string;
  llOorr(...arg: any[]): string {
    return arg[0] < arg[1] ? 'r' : 'l';
  }
  solt() {
  }
  emitChange(index: number) {
    this.lyTabGroup.selectedIndexChange.emit(index);
  }
  widthExacta(elem: HTMLElement): number {
    return elem.offsetWidth;
    // if (typeof elem.getBoundingClientRect !== typeof undefined) {
    //   return elem.getBoundingClientRect().width;
    // } else {
    //   return elem.offsetWidth;
    // }
  }
  floor(num: number): number {
    // return Math.round(num);
    return (num);
  }
  setIndex(index: number) {
    const ev = this.elementRef.nativeElement as HTMLElement;
    let restWi = 0;
    const tabLabel = this.elementRef.nativeElement as HTMLElement;
    restWi = this.widthExacta(ev) - this.widthExacta(tabLabel);
    // ev = tabLabel as HTMLElement;
    const w: number = this.floor(this.lyTabGroup._tabsContent.nativeElement.offsetWidth);

    const llOorr = this.llOorr(this.lyTabGroup._selectedIndex, index);
    let prevIndex: number = this.lyTabGroup._selectedIndex;
    let eve: any;
    this.lyTabGroup._selectedIndex = index;
    // this.lyTabGroup.updateTabsHeader();
    let dW: number;
    let dL: number;
    // let outEf: any = setTimeout(() => {});
    // clearTimeout(outEf);
    if (this.lyTabGroup.timeout) {
      // this.lyTabGroup.timeout.callback();
      clearTimeout(this.lyTabGroup.timeout);
      this.lyTabGroup.timeout = null;
    }
    // if (tabLabel.className != 'ly-tab-label-item') {
    //   eve = getParents(tabLabel, '.ly-tab-label-item');
    //   dW = getParents(tabLabel, '.ly-tab-label-item').offsetWidth;
    //   dL = getParents(tabLabel, '.ly-tab-label-item').offsetLeft;
    // } else {
    eve = ev;
    dW = this.floor(tabLabel.offsetWidth);
    dL = this.floor(tabLabel.offsetLeft);
    // }
    if (llOorr === 'r') {
      // this.lyTabGroup.tabWidth = dW;
      // this.lyTabGroup.tabLeft  = dL;
      // this.lyTabGroup.tabWidth = w - dL;
      // this.lyTabGroup.tabLeft  = dL;
      let sibsW: any = 0;
      const sibsID: any = [];
      const thisW = eve.previousSibling.offsetWidth;
      // clearTimeout(outEf);
      this.lyTabGroup.timeout = setTimeout(() => {
        this.lyTabGroup.tabWidth = dW;
        this.lyTabGroup.tabLeft  = dL;
        this.lyTabGroup.timeout = null;
        this.lyTabGroup.selectedIndexChange.emit(index);
      }, 475);
      while (eve = eve.previousSibling) {
        if (eve.nodeName === 'LY-TAB') {
          sibsID.push(eve);
        }

      }
      sibsID.reverse();
      for (let i = 0; i < sibsID.length; i++) {
        if (prevIndex <= i) {
          sibsW = sibsID[i].offsetWidth + sibsW + (this.lyTabGroup._margin || 0);
        }

      }
      this.lyTabGroup.tabWidth = sibsW + dW;

    } else if (llOorr === 'l') {
      let sibsW: any = 0;
      const sibsID: any = [];
      // let thisW = eve.previousSibling.offsetWidth;
      prevIndex = (this.lyTabGroup.tabRows - 1) - prevIndex;
      this.lyTabGroup.timeout = setTimeout(() => {
        this.lyTabGroup.tabLeft  = dL;
        this.lyTabGroup.tabWidth = dW;
        this.lyTabGroup.timeout = null;
        this.lyTabGroup.selectedIndexChange.emit(index);
      }, 475);
      while (eve = eve.nextSibling) {
        if (eve.nodeName === 'LY-TAB') {
          sibsID.push(eve);
        }
      }
      sibsID.reverse();
      for (let i = 0; i < sibsID.length; i++) {
        if (i >= prevIndex) {
          sibsW = sibsID[i].offsetWidth + sibsW + (this.lyTabGroup._margin || 0);
        }

      }
      this.lyTabGroup.tabWidth = sibsW + dW;
      this.lyTabGroup.tabLeft  = dL;

      // this.lyTabGroup.tabWidth = dW;
      // this.lyTabGroup.tabLeft  = dL;
    }
  }
  public updateTabLine() {
    // this.lyTabGroup._selectedIndex = index;
    // this.lyTabGroup.tabWidth = ev.offsetWidth;
    // this.lyTabGroup.tabLeft = ev.offsetLeft;
  }
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  lyTabGroup: LyTabGroupComponent;
  get indexGroup() {
    this._indexGroup = this.lyTabGroup._selectedIndex;
    return this._indexGroup;
  }
  constructor(
    @Optional() lyTabGroup: LyTabGroupComponent,
    public elementRef: ElementRef,
  ) {
    this.lyTabGroup = lyTabGroup;
    this._indexGroup = this.lyTabGroup._selectedIndex;
  }
  ngAfterViewInit() {
    this.stateTab = !(this._index == this.indexGroup);
    if (this.stateTab) {
      // this.lyTabGroup.tabWidth = this.elementRef.nativeElement.offsetWidth;
      // this.lyTabGroup.tabLeft = this.elementRef.nativeElement.offsetLeft;
    }
  }
  ngAfterContentInit() {
    // this.lyTabGroup.updateTabsHeader();
    this.hostStyle = this.lyTabGroup.theme.palette.primary.text;
  }
}
