import {
  NgModule,
  Component,
  ViewEncapsulation,
  EventEmitter,
  ElementRef,
  Renderer,
  ModuleWithProviders,
  Input,
  AfterContentInit,
  ContentChildren,
  QueryList,
  ChangeDetectionStrategy,
  Output,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  ComponentRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor } from '@angular/forms';
import { RandomId, LyTemplate } from 'alyle-ui/core';

@Component({
  // moduleId: module.id.toString(),
  selector: 'ly-nav',
  host: {
    // '[class._open]': 'state',
    // '[class._left]': '_align === "left"',
    // '[class._right]': '_align === "right"',
    // '[class._top]': '_align === "top"',
    // '[class._bottom]': '_align === "bottom"',
    // '[class._side]': '_mode=="side"',
  },
  styleUrls: ['nav.scss'],
  template: `
  <div #_ref
  class="sidenav-inj"></div>
  <ng-template>
  <div class="ly-nav-item"
  [class._open]="state"
  [class._left]="_align === 'left'"
  [class._right]="_align === 'right'"
  [class._top]="_align === 'top'"
  [class._bottom]="_align === 'bottom'"
  [class._side]="_mode=='side'">
    <div [class]="_mode" nv>
      <div [ngStyle]="_getStyles()" class="ly-nav">
        <div tabindex="0"></div>
        <div><ng-content></ng-content></div>
        <div tabindex="0"></div>
      </div>
    </div>
    <div *ngIf="state && _full"
    (click)="close();"
    class="ly-sidenav-backdrop-open"></div>
  </div>
  </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LyNav implements AfterContentInit, ControlValueAccessor {
  _mode: string = 'over';
  _align: string = 'left';
  state: boolean = false;
  _full: boolean = false;
  _media: string;
  _isInitialized: boolean = false;
  private width: number = 0;
  private height: number = 0;
  @ViewChild('_ref') _navInjElement: ElementRef;
  @Output() onSelect = new EventEmitter();
  @Output() onMode = new EventEmitter();

  @Output('open') onOpen = new EventEmitter<void>();
  @Output('close') onClose = new EventEmitter<void>();


  @Input()
  get full(): boolean {
    return this._full;
  }

  set full(value: boolean) {
    // this.onOpen.emit();
    this._full = value;
  }

  @Input()
  get mode(): string {
    return this._mode;
  }

  set mode(value: string) {
    this._updateMode(value);
  }

  @Input()
  get align(): string {
    return this._align;
  }

  set align(value: string) {
    this._updateAlign(value);
  }

  @Input()
  get opened(): boolean {
    return this.state;
  }
  set opened(value: boolean) {
    if (this.pxOfMedia(this._media) <= this.lyViewDocument().width) {
      this.state = value;
    }
    if (!value) {
      this.close();
    } else if (value && this._isInitialized) {
      this.open();
    }
    // console.log('this is openend');
    /*setTimeout(() => {
      console.log('_media', this.pxOfMedia(this._media));
      if (this.pxOfMedia(this._media) <= this.lyViewDocument().width) {
        this.toggle();
      }
    }, 1000);*/
  }
  pxOfMedia(str$: any = 'width: 700px') {
    let str: any = str$;
    str = str.split(':');
    str = str[1].trim();
    str = str.replace('px', '');
    str = str.replace('em', '');
    str = str.replace('rem', '');
    return str;
  }
  /** Callback registered via registerOnTouched (ControlValueAccessor) */
  private _onTouchedCallback: () => void;

  /** Callback registered via registerOnChange (ControlValueAccessor) */
  private _onChangeCallback: (_: any) => void;
  @ViewChild(TemplateRef) templateRoot: TemplateRef<any>;
  templateRootView: any;
  constructor(
    private elementRef: ElementRef,
    private lyTemplate: LyTemplate,
    private viewContainerRef: ViewContainerRef,
  ) {

  }
  setMedia(val: string) {
    this._media = val;
  }
  _width() {
    if (this.elementRef.nativeElement.querySelector('.ly-nav')) {
      return this.elementRef.nativeElement.querySelector('.ly-nav').offsetWidth;
    }
    return 0;
  }
  _height() {
    if (this.elementRef.nativeElement.querySelector('.ly-nav')) {
      return this.elementRef.nativeElement.querySelector('.ly-nav').offsetHeight;
    }
    return 0;
  }
  _getStyles() {
    return {
      left: `-${this.width}px`,
      right: `-${this.width}px`,
      top: `-${this.height}px`,
      bottom: `-${this.height}px`,
    };
  }

  lyViewDocument() {
    let _document: any, body$: any, aW: any, aH: any, bW: any, bH: any, cW: any, cH: any, maxW: any, maxH: any;
    _document = document.documentElement;
    body$ = document.body;
    aW = _document.offsetWidth;
    aH = _document.offsetHeight;
    bW = body$.offsetWidth;
    bH = body$.offsetHeight;
    cW = body$.firstElementChild.offsetWidth;
    cH = body$.firstElementChild.offsetHeight;
    maxW = Math.max(aW, bW, cW);
    maxH = Math.max(aH, bH, cH);
    /*console.log(
      // '_document.offsetWidth', _document.offsetWidth,
      // '_document.offsetHeight', _document.offsetHeight,
      // 'body$.offsetWidth', body$.offsetWidth,
      // 'body$.offsetHeight', body$.offsetHeight,
      // 'body$.firstElementChild.offsetWidth', body$.firstElementChild.offsetWidth,
      // 'body$.firstElementChild.offsetHeight', body$.firstElementChild.offsetHeight,
      'maxW', Math.max(aW, bW, cW),
      'maxH', Math.max(aH, bH, cH),
    );*/

    return {
      width: maxW,
      height: maxH,
    };
  }

  _updateMode(val: string) {
    this._mode = val;
    this.onMode.emit();
  }
  _updateAlign(align: string) {
    this._align = align;
  }
  close(): void {
    this.state = false;
    this.onClose.emit();
  }
  open(): void {
    this.state = true;
    this.onOpen.emit();
  }
  closeAll(): void {
    // console.log('closing');
    this.state = false;
    this.close();
  }
  toggle(): void {
    this.state ? this.close() : this.open();
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }
  ngAfterContentInit() {
    // console.log('_media ngAfterContentInit', this.pxOfMedia(this._media));

  }
  ngAfterViewInit() {
    // console.log('ehh', this._width());
  }
  ngOnInit() {
    // console.log('init');
    setTimeout(() => {
      // console.log('this.templateRoot', this.templateRoot);
      let nodes: any;
      if (this._full != true) {
        // console.warn(this.lyTemplate.nodes(this.templateRootView));
        this.templateRootView = this.lyTemplate.setTemplate(this.viewContainerRef.createEmbeddedView(this.templateRoot));
        // console.log(this._navInjElement.nativeElement);
        nodes = this._navInjElement.nativeElement.appendChild(this.lyTemplate.nodes(this.templateRootView));
      } else {
        this.templateRootView = this.lyTemplate.setTemplate(this.viewContainerRef.createEmbeddedView(this.templateRoot));
        nodes = document.body.appendChild(this.lyTemplate.nodes(this.templateRootView));
        nodes.querySelector('.ly-nav').setAttribute('x_ly-nav', '');
      }

      // console.log('_media', this.pxOfMedia(this._media), 'width', nodes.querySelector('.ly-nav').offsetWidth);
      this.width = nodes.querySelector('.ly-nav').offsetWidth;
      this.height = nodes.querySelector('.ly-nav').offsetHeight;
      if (this.pxOfMedia(this._media) <= this.lyViewDocument().width && this.state) {
        this.open();
      }
      this._isInitialized = true;
    }, 0);
  }
  writeValue(value: any) {

  }


}

@Component({
  // moduleId: module.id.toString(),
  selector: 'ly-drawer',
  styleUrls: ['drawer.scss'],
  template: `
  <div [class._display]="_mode.mode === 'over' ||
  _mode.mode === 'push'"
  (click)="closeBackdrop();"
  class="ly-sidenav-backdrop"
  [class._open]="sidenavState"></div>
  <ng-content select="ly-nav"></ng-content>
  <div class="ly-sidenav-content">
    <ng-content></ng-content>
  </div>
  `,
})
export class LySidenav implements AfterContentInit {
  @ContentChildren(LyNav) panes: QueryList<LyNav>;
  sidenavState: boolean;
  sidenav: any;
  nums: any = 0;
  _mode: any;
  _w: any;
  _h: any;
  _mediaState: boolean;
  _media: string = 'max-width: 720px';
  navIndex: any = [];
  @Input()
  get media(): string {
    return this._media;
  }
  set media(value: string) {
    this._media = value;
  }
  a() {
    alert('a');
  }
  get mediaStyles() {
    return `
      @media screen and (${this._media}) {
        .ly-sidenav-content {
        }
        .ly-sidenav-backdrop {
          display: block !important;
        }
        ly-nav._open {
          visibility: visible !important;
        }
        ly-nav._open._side > .side > .ly-nav {
          z-index: 111 !important;
        }
      }
    `;
  }
  ngOnInit() {
    let _El: any = document.createElement('style');
    _El.innerHTML = `${this.mediaStyles}`;
    _El.setAttribute('skncnj', this.randomId.generate);
    this.elementRef.nativeElement.appendChild(_El);
    let e: any = document.body;
    e.onresize = (event: any) => {
      // console.log('this.elementRef.nativeElement', this.elementRef.nativeElement, event);
      // console.warn(e.offsetWidth);
      if (e.offsetWidth <= 700) {
        // console.warn('is min');
        // console.log(this.randomId.generate);
      }
    };
  }
  StylesContent(restart: boolean = false) {
    let nv = this.elementRef.nativeElement.querySelector('.ly-sidenav-content');
    let margin: any;
    if (this._mode.mode === 'side' && this._mode.align === 'left') {
      nv.style.marginLeft = `${this._w}px`;
    } else if (this._mode.mode === 'side' && this._mode.align === 'right') {
        nv.style.marginRight = `${this._w}px`;
    } else if (this._mode.mode === 'push' && this._mode.align === 'left') {
      nv.style.marginLeft = `${this._w}px`;
      nv.style.transition = '375ms cubic-bezier(0.23, 1, 0.32, 1)';
    } else if (this._mode.mode === 'push' && this._mode.align === 'right') {
      nv.style.marginRight = `${this._w}px`;
      nv.style.transition = '375ms cubic-bezier(0.23, 1, 0.32, 1)';
    } else if (this._mode.mode === 'over' && this._mode.align === 'left') {
      nv.style.marginLeft = `${this._w}px`;
      nv.style.transition = '375ms cubic-bezier(0.23, 1, 0.32, 1)';
    } else if (this._mode.mode === 'over' && this._mode.align === 'right') {
      nv.style.marginLeft = `${this._w}px`;
      nv.style.transition = '375ms cubic-bezier(0.23, 1, 0.32, 1)';
    } else {
      nv.style.marginLeft = `0px`;
      nv.style.marginRight = `0px`;
      nv.style.transition = '375ms cubic-bezier(0.23, 1, 0.32, 1)';
    }
    if (restart) {
      this._w = 0;
      nv.setAttribute('style', `
        transition: 375ms cubic-bezier(0.23, 1, 0.32, 1);
      `);
      // nv.style.marginLeft = `0px`;
      // nv.style.marginRight = `0px`;
      // nv.style.transition = '375ms cubic-bezier(0.23, 1, 0.32, 1)';
    }
    // console.log('margin', margin, this._mode, this._w, this.sidenavState);

  }
  constructor(
    private elementRef: ElementRef,
    public randomId: RandomId,
  ) { }

  ngAfterContentInit() {
    this.panes.changes.subscribe(() => {
      // console.log('srasdsdf');
    });
    this.panes.forEach((sidenav: LyNav, _index: any) => {
      // console.warn('pxdffdg', sidenav);
      sidenav.setMedia(this._media);
      this._mode = {
        mode: sidenav._mode,
        align: sidenav._align,
      };
      this.sidenav = sidenav;
      this.nums = 0;

      sidenav.onOpen.subscribe(() => {
        this.sidenavState = sidenav.state;
        this.navIndex.push({
          key$: _index,
          mode$: sidenav._mode,
        });

        // console.warn('this.navIndex', this.navIndex);
        let index: any = String((Date.now()));
        index = Number(index.slice(7, -2));
        this._mode = this._mode = {
          mode: sidenav._mode,
          align: sidenav._align,
        };
        if (sidenav._mode === 'over') {
          this.nums++;
        } else {
          this._w = sidenav._width();
          // console.log('this._w', this._w);
        }

        this.sidenav = sidenav;
        this.StylesContent();
        // console.log(this.sidenav, this.nums);
      });
      sidenav.onClose.subscribe(() => {
        // this.navIndex = this.navIndex.slice(0, -(this.navIndex.length - 1));
        this._mode = this._mode = {
          mode: sidenav._mode,
          align: sidenav._align,
        };
        if (this.navIndex.filter((_: any) => _.mode$ !== 'side').length <= 1) {
          this.sidenavState = false;
        }
        this.StylesContent();
        if (sidenav._mode === 'side' || sidenav._mode === 'push') {
          this.StylesContent(true);
          // console.log('sdsdf');
        }
        let ins = this.navIndex.find((dadfcxv: any) => dadfcxv.key$ === _index);
        this.navIndex = this.navIndex.filter((_: any) => _.key$ !== ins.key$);
        // console.log('A', this.sidenav);
        // console.log('index', this.navIndex);
        // this._w = 0;
        // this.close();
        // this.sidenav = sidenav;
        // console.log('B', this.sidenav);
      });
      sidenav.onMode.subscribe(() => {
        this.sidenav = sidenav;
        this._mode = {
          mode: sidenav._mode,
          align: sidenav._align,
        };
        if (sidenav._mode === 'over') {
          this.StylesContent(true);
        }else {
          this._w = sidenav._width();
          this.StylesContent();
        }
        // console.log('event mode', this._mode, sidenav._mode, sidenav.mode, sidenav);
      });
    });
  }
  closeBackdrop() {

    // console.log('all navs', this.navIndex);
    if (this.navIndex.filter((_: any) => _.mode$ !== 'side').length <= 1) {
      this.sidenavState = false;
      this.panes.forEach((_nave, _dex) => {
        if (this.navIndex.slice((this.navIndex.length - 1))[0].key$ === _dex) {
          _nave.state = false;
          // console.log('nav closed', _dex);
          // style for  push
          this.StylesContent();
          if (_nave._mode === 'side' || _nave._mode === 'push') {
            this.StylesContent(true);
            // console.log('sdsdf');
          }
        }
      });
      // console.log('init for one', this.navIndex);
    } else {
      // console.log('init for each');

      this.panes.forEach((_nave, _dex) => {
        if (this.navIndex.slice((this.navIndex.length - 1))[0].key$ === _dex) {
          _nave.state = false;
          // console.log('nav closed', _dex);
        }
      });
      // console.warn(this.panes);
    }
    this.navIndex = this.navIndex.slice(0, (this.navIndex.length - 1));
    // console.log('index', this.navIndex);
  }
  _closeBackdrop() {
    // disable this
    // console.log('this.panes', this.panes);
    let stateNAV = 0;
    if (this.panes.length > 1) {
      this.sidenav.state = false;
      this.panes.forEach((navItem) => {
        if (navItem.state) {
          stateNAV++;
        }
      });
      if (stateNAV === 0) {
        this.sidenavState = false;
      }
    } else {
      this.sidenavState = false;
      this.panes.first.state = false;
    }


  }

}
