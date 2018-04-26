import { BehaviorSubject } from 'rxjs';
import {
  Component,
  ElementRef,
  forwardRef,
  NgModule,
  Input,
  Output,
  Directive,
  SimpleChange,
  OnChanges,
  HostBinding,
  OnInit,
  ModuleWithProviders,
  AfterContentInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  Optional,
  QueryList,
  ContentChildren,
  HostListener,
  AfterViewInit,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ComponentRef,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  group
} from '@angular/animations';
import { DomService, LxDomModule, Platform } from '@alyle/ui';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export type position = 'left' | 'right' | 'top' | 'bottom' | 'center' | 'middle';
export class Origin {
  horizontal: position;
  vertical: position;
}

@Component({
  selector: 'ly-template-menu',
  template: `
  <div #container></div>
  `,
  styles: [`
    :host {
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  `]
})
export class LyTemplateMenu implements OnInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef }) _vcr: ViewContainerRef;
  constructor(public _viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
  }
  tmpl(template: TemplateRef<any>) {
    this._vcr.createEmbeddedView(template);
  }
  ngOnDestroy() {
    console.log('desst');
  }
}

@Component({
  selector: 'ly-menu',
  styleUrls: ['menu.scss'],
  animations: [
    trigger('menu', [
      transition(':leave', animate('150ms 50ms linear', style({opacity: 0}))),
      state('in', style({
        opacity: 1
      })),
      transition(':enter', animate('100ms linear'))
    ])
  ],
  template: `
  <ng-template>
    <div #_menu [@menu]="menuAnimationsState"
      class="ly-menu"
      bg="main"
      color="colorText"
      [style.transform-origin]="targetOrigin"
      [style.top.px]="rootStyle.top + rootStylePosition.top"
      [style.left.px]="rootStyle.left + rootStylePosition.left"
      [style.transform]="_targetPosition | async">
      <div class="ly-menu-content">
        <ng-content></ng-content>
      </div>
    </div>
    <div
    class="ly-background-menu ly-background-on"
    (click)="hiddeMenu()"></div>
  </ng-template>
  `,
  exportAs: 'lyMenu',
  preserveWhitespaces: false
})
export class LyMenu implements OnChanges, AfterViewInit, OnInit, OnDestroy {
  isIni = false;
  _color: string;
  stateBg = false;
  widthTarget = 0;
  heightTarget = 0;

  rootMenu: any = {
    top: 0,
    left: 0,
  };
  xtemplateRef: any;
  menuAnimationsState;
  @Input() opened = false;
  @Input('anchor-origin') _anchorOrigin: Origin = {horizontal: 'left', vertical: 'top'};
  @Input('target-origin') _targetOrigin: Origin = {horizontal: 'left', vertical: 'top'};
  @ViewChild('_menu') _menuElement: ElementRef;
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  _targetPosition: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  @Output() open: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  private menuContentElement: HTMLElement;
  private menuContentRef;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['_targetOrigin']) {
      Promise.resolve(null).then(() => {
        if (true) {
          // console.log('changes[target-origin]', changes['_targetOrigin']);
        }
      });
    }
  }

  updateTargetPosition() {
    let vertical = '0%',
    horizontal = '0%';
    if (this._targetOrigin.horizontal === 'middle') {
      horizontal = '-50%';
    } else if (this._targetOrigin.horizontal === 'right') {
      horizontal = '-100%';
    }
    if (this._targetOrigin.vertical === 'center') {
      vertical = '-50%';
    } else if (this._targetOrigin.vertical === 'bottom') {
      vertical = '-100%';
    }
    const menuStyle = this.sanitizer.bypassSecurityTrustStyle(`translate3d(${horizontal}, ${vertical}, 0) scale3d(1, 1, 1)`);
    this._targetPosition.next(menuStyle as string);
  }
  // get size
  target(_element: any) {
    const element: HTMLElement = _element;
    return {
      'width': element.offsetWidth || 0,
      'height': element.offsetHeight || 0,
      'left': element.offsetWidth || 0,
      'top': 0,
    };
  }
  get rootStylePosition() {
    let top: any = 0;
    let left: any = 0;
    // let topTarget: any = 0;
    // let leftTarget: any = 0;

    // for _anchorOrigin
    if (this._anchorOrigin.vertical === 'center') {
      // anchor origin
      top = (this.rootMenu.height / 2);
    } else if (this._anchorOrigin.vertical === 'bottom') {
      top = (this.rootMenu.height);
    }
    if (this._anchorOrigin.horizontal === 'middle') {
      // anchor origin
      left = (this.rootMenu.width / 2);
    } else if (this._anchorOrigin.horizontal === 'right') {
      left = (this.rootMenu.width);
    }

    // // for target origing
    // if (this._targetOrigin.vertical == 'center') {
    //   // anchor origin
    //   topTarget = -(this.heightTarget / 2);
    // } else if (this._targetOrigin.vertical == 'bottom') {
    //   topTarget = -(this.heightTarget);
    // }
    // if (this._targetOrigin.horizontal == 'middle') {
    //   // leftTarget = (this.target(this._menuElement).width / 2);
    //   leftTarget = -(this.widthTarget / 2);
    // } else if (this._targetOrigin.horizontal == 'right') {
    //   // leftTarget = (this.target(this._menuElement).width);
    //   leftTarget = -(this.widthTarget);
    // }
    return {
      top: top,
      left: left,
      // topTarget: topTarget,
      // leftTarget: leftTarget,
    };
  }
  get rootStyle(): any {
    const menuPosition: any = this.rootMenu;
    const positionFinal: any = menuPosition;

    if (this._anchorOrigin) {


    }

    return positionFinal;
  }
  get targetOrigin(): string {
    return `${
      this._targetOrigin.horizontal === 'middle' ? 'center' : this._targetOrigin.horizontal
    } ${this._targetOrigin.vertical} 0`;
  }
  toggleMenu() {
    this.opened === false ? this.showMenu() : this.hiddeMenu();
  }
  showMenu() {
    this.menuAnimationsState = 'in';
    this.menuContentRef = this.domService.attach<LyTemplateMenu>(this._viewContainerRef, LyTemplateMenu, this.templateRef);
    // this.menuContentElement = this.domService.getDomElementFromComponentRef(this.menuContentRef);
    // this.domService.addChild(this.menuContentElement);
    this.updateTargetPosition();
    this.opened = true;
    this.stateBg = true;
    this.open.emit(null);
  }
  hiddeMenu() {
    this.close.emit(null);
    this.opened = false;
    this.stateBg = false;
    // this.menuAnimationsState = 'end';
    this._destroyMenu();
  }

  private _destroyMenu(): void {
    // if (this.menuContentRef) {
      this.domService.destroyRef(this.menuContentRef, 0);
    // }
  }

  constructor(
    private elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private domService: DomService,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit() {

  }

  ngAfterViewInit() {

  }
  ngOnDestroy() {
    if (Platform.isBrowser) {
      this._destroyMenu();
    }
  }

}
@Directive({
  selector: '[lyMenuTriggerFor]',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(click)': '_handleClick($event)'
  }
})
export class LyMenuTriggerFor {
  @Input('lyMenuTriggerFor') lyMenuTriggerFor: LyMenu;
  constructor(private elementRef: ElementRef) {}

  targetPosition() {
    const element: HTMLElement = this.elementRef.nativeElement;
    const rect: ClientRect = element.getBoundingClientRect();
    const result = {
      'width': rect.width,
      'height': rect.height,
      'left': rect.left,
      'top': rect.top,
    };
    return result;
  }

  _handleClick(e: Event) {
    this.lyMenuTriggerFor.rootMenu = this.targetPosition();
    this.lyMenuTriggerFor.toggleMenu();
  }

}
