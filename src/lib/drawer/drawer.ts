import {
  NgModule,
  Component,
  Directive,
  ViewEncapsulation,
  EventEmitter,
  ElementRef,
  Renderer,
  ModuleWithProviders,
  Input,
  AfterContentInit,
  ContentChildren,
  ContentChild,
  QueryList,
  ChangeDetectionStrategy,
  Output,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  ComponentRef,
  forwardRef,
  OnInit,
  HostBinding,
  Optional,
  Renderer2,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor } from '@angular/forms';
import { RandomId, NgTranscludeModule, IsBoolean } from 'alyle-ui/core';
import { AnimationBuilder, trigger, state, animate, transition, style } from '@angular/animations';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export interface StyleMargin {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

@Directive({
  selector: 'ly-drawer-content'
})
export class LyDrawerContent {
  // @HostBinding('style.margin-top') marginTop: string;
  // @HostBinding('style.margin-left') marginLeft: string;
  // @HostBinding('style.margin-right') marginRight: string;
  // @HostBinding('style.margin-bottom') marginBottom = '50px';
  @HostBinding('style.margin') margin = '0 0 0 0';
  _el: HTMLElement;
  @HostBinding('class.ly--animation') _lyAnimation = true;
  constructor(
    public elementRef: ElementRef,
    public renderer: Renderer2,
  ) {
    this._el = elementRef.nativeElement;
  }

  setContentStyle(margin: StyleMargin) {
    const array = this.margin.split(' ');
    if (margin.left) {
      array[3] = `${margin.left}px`;
    }
    if (margin.right) {
      array[1] = `${margin.right}px`;
    }
    if (margin.top) {
      array[0] = `${margin.top}px`;
    }
    if (margin.bottom) {
      array[2] = `${margin.bottom}px`;
    }
    this.margin = array.join(' ');
    // const keys = Object.keys(margin);
    // for (let i = 0; i < keys.length; i++) {
    //   const keyName = keys[i];
    //   this.renderer.setStyle(this._drawerContent.elementRef.nativeElement, `margin-${keyName}`, `${margin[keyName]}px`);
    // }
  }
}

@Component({
  selector: 'ly-drawer-container',
  styleUrls: ['drawer.scss'],
  animations: [
    trigger('in', [
      state('inactive, 0' , style({ opacity: '0', 'display': 'none' })),
      state('active, 1' , style({ opacity: '.6' })),
      transition('* => active', animate('375ms ease-in')),
      transition('* => inactive', animate('375ms ease-out')),
    ])
  ],
  template: `
  <ng-content select="ly-drawer"></ng-content>
  <ng-content select="ly-drawer-content"></ng-content>
  <div
  #bg
  [class.ly-drawer-bg-opened]="isDrawerBg | async"
  [class.ly-drawer-bg-closed]="!(isDrawerBg | async)"
  [@in]="isDrawerBg | async" class="ly-drawer-bg"
  bg="colorText"
  (click)="_closeAllSideAndPush()"
  ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'lyDrawerContainer'
})
export class LyDrawerContainer {
  isDrawerBg = new BehaviorSubject<'active' | 'inactive' | boolean>(false);
  @ContentChildren(forwardRef(() => LyDrawer)) _drawers: QueryList<LyDrawer>;
  @ContentChild(forwardRef(() => LyDrawerContent)) _drawerContent: LyDrawerContent;
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private animationBuilder: AnimationBuilder
  ) {}

  _closeAllSideAndPush() {
    this._drawers.forEach((drawer: LyDrawer) => {
      if (drawer.mode === 'over' || drawer.mode === 'push') {
        drawer.close();
        this.isDrawerBg.next('inactive');
      }
    });
  }

  /** Close all open drawers */
  closeAll() {
    this._drawers.forEach((drawer: LyDrawer) => {
      if (drawer.open) {
        drawer.close();
      }
    });
    this.isDrawerBg.next('inactive');
  }
}

@Component({
  selector: 'ly-nav, ly-drawer',
  styleUrls: ['nav.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('true, open' , style({ transform: 'translate3d(0, 0, 0)' })),
      transition('* => open, * => close', [
        animate('375ms cubic-bezier(.45, 0, .25, 1)')
      ])
    ])
  ],
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'lyDrawer'
})
export class LyDrawer implements OnChanges {
  private _opened = false;
  @Input() config: LyDrawerConfig = {
    width: 200,
    height: 200
  };
  @HostBinding('attr.mode') @Input() mode: 'side' | 'push' | 'over' = 'side';
  @HostBinding('attr.position') @Input() position: 'top' | 'bottom' | 'left' | 'right' | 'rtl' = 'left';
  @HostBinding('class.ly-show-drawer') isShowDrawer: boolean;
  @HostBinding('@visibilityChanged')
  private isOpenDrawer: 'open' | 'close' | boolean = false;
  @HostBinding('class.ly-drawer-hidden') private isDrawerHidden = true;
  @Input()
  @IsBoolean()
  set opened(val: boolean) {
    this.isOpenDrawer = val;
    this._opened = val;
    val ? this.open(true) : this.close(false);
  }
  get opened(): boolean { return this._opened; }

  constructor(
    @Optional() private drawerContainer: LyDrawerContainer,
    private elementRef: ElementRef,
  ) { }

  get _elementRect(): ClientRect {
    return this.elementRef.nativeElement.getBoundingClientRect();
  }

  private updateDrawerMargin() {
    if (this.mode === 'side' || this.mode === 'push') {
      const width = this.config.width;
      const height = this.config.height;
      if (width !== 0 && this.position === 'left' || this.position === 'right') {
        const margin = {};
        margin[this.position] = width;
        this.drawerContainer._drawerContent.setContentStyle(margin);
      }
      if (height !== 0 && this.position === 'top' || this.position === 'bottom') {
        const margin = {};
        margin[this.position] = height;
        this.drawerContainer._drawerContent.setContentStyle(margin);
      }
    }
  }

  toBoolean(drawerState: boolean | 'open' | 'close'): boolean {
    if (drawerState === true || drawerState === 'open') {
      return true;
    } else {
      return false;
    }
  }

  toggle() {
    this.toBoolean(this.isOpenDrawer) ? this.close() : this.open();
  }

  open(is?: true): 'open' | boolean {
    this.toogleDrawer(is);
    this.isDrawerHidden = false;
    this.isOpenDrawer = is || 'open';
    this.drawerContainer._drawerContent._lyAnimation = this.isOpenDrawer === 'open';
    this.updateDrawerMargin();
    this.setBgState(is || 'active');
    return this.isOpenDrawer;
  }
  close(is?: false): 'close' | boolean {
    this.toogleDrawer(is);
    this.resetMargin();
    this.isOpenDrawer = is === false || is === true ? false : 'close';
    this.drawerContainer._drawerContent._lyAnimation = this.isOpenDrawer === 'close';
    this.setBgState(is === false ? false : 'inactive');
    return this.isOpenDrawer;
  }

  private toogleDrawer(status: boolean) {
    this.isShowDrawer = this.toBoolean(status);
  }

  setBgState(bgState: boolean | 'active' | 'inactive') {
    if (this.mode === 'over' || this.mode === 'push') {
      this.drawerContainer.isDrawerBg.next(bgState);
    }
  }

  resetMargin() {
    const margin = {};
    margin[this.position] = '0';
    this.drawerContainer._drawerContent.setContentStyle(margin);
  }

  ngOnChanges(changes: SimpleChanges) {
    Object.keys(changes).forEach((key) => {
      /**for `position` changes */
      if (key === 'position' && changes[key].currentValue === 'rtl') {
        this.position = 'right';
      }
      /**for other changes */
      if (!changes[key].firstChange) {
      }
    });
  }

}

export interface LyDrawerConfig {
  width?: number;
  height?: number;
}
