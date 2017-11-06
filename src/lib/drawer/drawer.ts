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
  Directive,
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
import { RandomId, LyTemplate, NgTranscludeModule } from 'alyle-ui/core';
import { AnimationBuilder, trigger, state, animate, transition, style } from '@angular/animations';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export interface StyleMargin {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

@Component({
  selector: 'ly-drawer-content',
  template: `
  <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class LyDrawerContent {
  asd = 'sdasd';
  anim = {value: 'op', params: {'active': [this.asd]}};
  _el: HTMLElement;
  @HostBinding('class.ly--animation') _lyAnimation = true;
  constructor(public elementRef: ElementRef) {
    this._el = elementRef.nativeElement;
  }
}

@Component({
  selector: 'ly-drawer-container',
  styleUrls: ['drawer.scss'],
  animations: [
    trigger('in', [
      state('0' , style({ opacity: '0', 'display': 'none' })),
      state('1' , style({ opacity: '.6' })),
      transition('0 => 1', animate('375ms ease-in')),
      transition('1 => 0', animate('375ms ease-out'))
    ])
  ],
  template: `
  <ng-content select="ly-drawer"></ng-content>
  <ng-content select="ly-drawer-content"></ng-content>
  <div [@in]="isDrawerBg | async" class="ly-drawer-bg"
  bg="colorText"
  (click)="_closeAllSideAndPush()"
  ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class LyDrawerContainer {
  isDrawerBg: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @ContentChildren(forwardRef(() => LyDrawer)) _drawers: QueryList<LyDrawer>;
  @ContentChild(forwardRef(() => LyDrawerContent)) _drawerContent: LyDrawerContent;
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private animationBuilder: AnimationBuilder
  ) {}

  _setStyleMargin(margin: StyleMargin) {
    const keys = Object.keys(margin);
    for (let i = 0; i < keys.length; i++) {
      const keyName = keys[i];
      this.renderer.setStyle(this._drawerContent.elementRef.nativeElement, `margin-${keyName}`, `${margin[keyName]}px`);
    }
  }
  _closeAllSideAndPush() {
    this._drawers.forEach((drawer: LyDrawer) => {
      if (drawer.mode === 'over' || drawer.mode === 'push') {
        drawer.close();
        this.isDrawerBg.next(false);
      }
    });
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
  template: `
  <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'lyDrawer'
})
export class LyDrawer implements OnChanges {
  private _opened = false;
  @HostBinding('attr.mode') @Input() mode: 'side' | 'push' | 'over' = 'side';
  @HostBinding('attr.position') @Input() position: 'top' | 'bottom' | 'left' | 'right' | 'rtl' = 'left';
  @HostBinding('@visibilityChanged') private isOpenDrawer: 'open' | 'close' | boolean = false;
  @HostBinding('class.ly-drawer-hidden') private isDrawerHidden = true;
  @HostListener('@visibilityChanged.done') transitionEnd() {
    const stateDrawer = !this.toBoolean(this.isOpenDrawer);
    Promise.resolve(null).then(() => {
      this.drawerContainer._drawerContent._lyAnimation = false;
      this.isDrawerHidden = stateDrawer;
    });
  }
  @Input() set opened(val: boolean) {
    if (val === this.isOpenDrawer) { return; }
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
      const width = this._elementRect.width;
      const height = this._elementRect.height;
      if (width !== 0 && this.position === 'left' || this.position === 'right') {
        const margin = {};
        margin[this.position] = width;
        this.drawerContainer._setStyleMargin(margin);
      }
      if (height !== 0 && this.position === 'top' || this.position === 'bottom') {
        const margin = {};
        margin[this.position] = height;
        this.drawerContainer._setStyleMargin(margin);
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

  open(is?: boolean): 'open' | boolean {
    this.isDrawerHidden = false;
    this.isOpenDrawer = is || 'open';
    this.drawerContainer._drawerContent._lyAnimation = this.isOpenDrawer === 'open';
    this.updateDrawerMargin();
    this.setBgState(true);
    return this.isOpenDrawer;
  }
  close(is?: boolean): 'close' | boolean {
    this.resetMargin();
    this.isOpenDrawer = is === false || is === true ? false : 'close';
    this.drawerContainer._drawerContent._lyAnimation = this.isOpenDrawer === 'close';
    this.setBgState(false);
    return this.isOpenDrawer;
  }

  setBgState(bgState: boolean) {
    if (this.mode === 'over' || this.mode === 'push') {
      this.drawerContainer.isDrawerBg.next(bgState);
    }
  }

  resetMargin() {
    const margin = {};
    margin[this.position] = 0;
    this.drawerContainer._setStyleMargin(margin);
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
