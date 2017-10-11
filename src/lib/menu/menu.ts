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
  AfterViewInit
} from '@angular/core';
import { LyCoreModule } from 'alyle-ui/core';
import { exactPosition } from 'alyle-ui/core';
import { LyRippleModule } from 'alyle-ui/ripple';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export const LY_MENU_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LyMenu),
  multi: true
};
import { coerceBooleanProperty } from 'alyle-ui/core';
export type position = 'left' | 'right' | 'top' | 'bottom' | 'center' | 'middle';
export class Origin {
  horizontal: position;
  vertical: position;
}



@Component({
  // moduleId: module.id.toString(),
  selector: 'ly-menu',
  styleUrls: ['menu.scss'],
  host: {
    '[style.color]': '_color',
  },
  template: `
  <ng-template>
    <div #_menu
      class="ly-menu"
      bg="main"
      color="colorText"
      [style.transform-origin]="targetOrigin"
      [style.top]="rootStyle.top + rootStylePosition.top + rootStylePosition.topTarget + 'px'"
      [style.left]="rootStyle.left + rootStylePosition.left + rootStylePosition.leftTarget + 'px'"

      [class.ly-menu-opened]="opened">
        <ng-content></ng-content>
    </div>
    <div
    class="ly-background-menu"
    [class.ly-background-on]="stateBg"


    (click)="hiddeMenu()"></div>
  </ng-template>
  `,
  providers: [LY_MENU_CONTROL_VALUE_ACCESSOR],
  exportAs: 'lyMenu'
})
export class LyMenu implements AfterViewInit, OnInit {
  isIni = false;
  _color: string;
  stateBg = false;
  widthTarget = 0;
  heightTarget = 0;

  rootMenu: any = {
    top: 0,
    left: 0,
  };
  @Input() opened = false;
  @Input('anchor-origin') _anchorOrigin: Origin = {horizontal: 'left', vertical: 'top'};
  @Input('target-origin') _targetOrigin: Origin = {horizontal: 'left', vertical: 'top'};
  @Input('ly-menu-event') menuEvent: 'hover' | 'click' = 'click';
  @ViewChild('_menu') _menuElement: ElementRef;
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

  _handleMouseenter(): any {
    if (this.menuEvent == 'hover') {
      this.hiddeMenu();
    }
  }

  // get size
  target(_element: any) {
    console.log(_element);
    const element: HTMLElement = _element;
    // console.log(this._menuElement);
    /*if (this._menuElement) {
      element = this._menuElement.nativeElement;
    } else {
      element = 0;
    }*/
    return {
      'width': element.offsetWidth || 0,
      'height': element.offsetHeight || 0,
      'left': element.offsetWidth || 0,
      'top': 0,
    };
  }
  xtemplateRef: any;
  // @HostBinding('style.transform-origin')
  get rootStylePosition() {
    // console.log(this.xtemplateRef);
    let top: any = 0;
    let left: any = 0;
    let topTarget: any = 0;
    let leftTarget: any = 0;

    // for _anchorOrigin
    if (this._anchorOrigin.vertical == 'center') {
      // anchor origin
      top = (this.rootMenu.height / 2);
    } else if (this._anchorOrigin.vertical == 'bottom') {
      top = (this.rootMenu.height);
    }
    if (this._anchorOrigin.horizontal == 'middle') {
      // anchor origin
      left = (this.rootMenu.width / 2);
    } else if (this._anchorOrigin.horizontal == 'right') {
      left = (this.rootMenu.width);
    }

    // for target origing
    if (this._targetOrigin.vertical == 'center') {
      // anchor origin
      topTarget = -(this.heightTarget / 2);
    } else if (this._targetOrigin.vertical == 'bottom') {
      topTarget = -(this.heightTarget);
    }
    if (this._targetOrigin.horizontal == 'middle') {
      // leftTarget = (this.target(this._menuElement).width / 2);
      leftTarget = -(this.widthTarget / 2);
    } else if (this._targetOrigin.horizontal == 'right') {
      // leftTarget = (this.target(this._menuElement).width);
      leftTarget = -(this.widthTarget);
    }
    return {
      top: top,
      left: left,
      topTarget: topTarget,
      leftTarget: leftTarget,
    };
  }
  get rootStyle(): any {
    // console.log(this.rootMenu);
    const menuPosition: any = this.rootMenu;
    const positionFinal: any = menuPosition;
    // console.log(menuPosition);


    if (this._anchorOrigin) {


    }

    return positionFinal;
  }
  get targetOrigin(): string {
    return `${
      this._targetOrigin.horizontal == 'middle' ? 'center' : this._targetOrigin.horizontal
    } ${this._targetOrigin.vertical} 0`;
  }
  toggleMenu() {
    this.opened == !true ? this.showMenu() : this.hiddeMenu();
  }
  template() {
    const tRef: any = this.viewContainerRef.createEmbeddedView(this.templateRef);
    this.xtemplateRef = tRef;
    return tRef;
  }
  showMenu() {
    const body: any = document.querySelector('body');
    let ref: any;
    ref = this.template();
    ref.rootNodes.forEach((root: any) => {
      body.appendChild(root);
      if (root.classList && root.classList[0] == 'ly-menu') {
        this.widthTarget = root.offsetWidth;
        this.heightTarget = root.offsetHeight;
      }
    });
    this.opened = true;
    this.stateBg = true;
    // window.setTimeout(() => this.opened = true, 0);
    // window.setTimeout(() => {this.stateBg = true; }, 0);
    return true;
  }
  hiddeMenu() {
    this.opened = !true;
    this.stateBg = !true;
    // this.template()
    if (this.xtemplateRef != null) {
      this.xtemplateRef.detach();
      this.xtemplateRef.destroy();
    }
    this.xtemplateRef = null;
    return this.opened;
  }

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    // @Optional() lyMenuItem: LyMenuItem,
  ) {
    // this.lyMenuItem = lyMenuItem;

  }
  ngOnInit() {
    /**
     * TODO: set color text
     */
    this._color = '#000';
  }
  // lyMenuItem: LyMenuItem;
  // @ContentChildren(LyMenuItem) items: QueryList<LyMenuItem>;

  ngAfterViewInit() {



    /*if (!this.root && this.lyMenuItem) {
      console.warn(this.lyMenuItem);


      // important continue ...
      // output Open Event similar to sidenav
      // this.lyMenuItem._itemMenu = this.showMenu();
      // this.showMenu();
    }*/

  }


}
@Directive({
  selector: 'ly-menu-text',
})
export class LyMenuText {}

@Component({
  // moduleId: module.id.toString(),
  selector: 'ly-menu-items',
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      position: absolute;
      padding: 8px 0px;
      display: inline-table;
      user-select: none;
      top: 0px;
      right: 0px;
      transform-origin: right top 0;
      opacity: 1;
      width: 84px;
      transform: scale(0, 0);
      box-shadow: rgba(0, 0, 0, 0.15) 0 2px 6px, rgba(0, 0, 0, 0.15) 0 1px 4px;
      border-radius: 2px;
      background: #fff;
      transition: all 375ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    }
    :host.menu-opened-of-items {
      transform: scale(1, 1) !important;
    }
  `],
  host: {
    '[style.top]': 'targetPosition.top + "px"',
    '[style.left]': 'targetPosition.left + "px"',
    '[class.menu-opened-of-items]': 'state',
  }
})
export class LyMenuItems {
  state = false;
  get targetPosition() {
    // inject position SCREEN
    let element: HTMLElement;
    const _offset: any = exactPosition(this.elementRef.nativeElement);
    let scale = 'scale3d(0, 0, 0)';
    element = this.elementRef.nativeElement;
    if (this.elementRef.nativeElement.offsetParent) {
      element = this.elementRef.nativeElement.offsetParent;
      scale = 'scale(1, 1, 1)';
    }
    return {
      'width': element.offsetWidth,
      'height': element.offsetHeight,
      'left': element.offsetWidth,
      'top': 0,
      'scale': scale,
    };
  }
  _showMenu() {
    this.state = !false;
  }
  _hiddeMenu() {
    this.state = false;
  }
  _toggleMenu() {
    this.state == !true ? this._showMenu() : this._hiddeMenu();
  }
  constructor(private elementRef: ElementRef) {

  }
}
@Directive({
  selector: '[ly-menu-trigger-for]',
  host: {
    '(click)': '_handleClick($event)',
    '(mouseenter)': '_handleMouseenter($event)',
    // '(mouseleave)': '_handleMouseleave()',
    // '(mouseout)': '_handleMouseleave()',
    // '(mouseup)': '_handleMouseleave()',
  }
})
export class LyMenuTriggerFor {
  @Input('ly-menu-trigger-for') menu: LyMenu;
  constructor(private elementRef: ElementRef) {

  }

  targetPosition() {
    const element: HTMLElement = this.elementRef.nativeElement;
    const _offset: any = exactPosition(element);
    return {
      'width': element.offsetWidth,
      'height': element.offsetHeight,
      'left': _offset.left,
      'top': _offset.top,
    };

  }

  _handleClick(e: Event) {
    // console.log(this.targetPosition);
    this.targetPosition();
    this.menu.rootMenu = this.targetPosition();
    this.menu.toggleMenu();
  }
  _handleMouseenter(event: any) {
    event.preventDefault();
    this.menu.rootMenu = this.targetPosition();
    if (this.menu.menuEvent == 'hover') {
      this.menu.showMenu();
    }
  }
  private _handleMouseleave(event: any) {
    this.menu.rootMenu = this.targetPosition();
    if (this.menu.menuEvent == 'hover') {
      this.menu.hiddeMenu();
    }
  }

}

@Component({
  // moduleId: module.id.toString(),
  selector: 'ly-menu-item',
  styleUrls: ['menu-item.css'],
  host: {
    // '(click)': '_handleClick($event)'
  },
  template: `
  <span
    #_ripple
    ly-ripple
    tabindex="0"
    type="button"
    class="ly-menu-content"
    (click)="_handleClick($event)"
    >
      <ng-content select="ly-menu-text"></ng-content>
  </span>
  <ng-content></ng-content>
  `,
})
export class LyMenuItem {
  _itemMenu: any;

  get targetPosition() {
    const element: HTMLElement = this.elementRef.nativeElement;
    const _offset: any = exactPosition(element);
    return {
      'width': element.offsetWidth,
      'height': element.offsetHeight,
      'left': `${_offset.left}px`,
      'top': `${_offset.top}px`,
    };
  }
  _handleClick(event: any) {
    // console.warn('clicked', event);
    const el: HTMLElement = event.target.offsetParent;
    // console.log(el.offsetParent.localName);
    // this._itemMenu;
    // this.lyMenu.showMenu();
    if (this.items.first && el.offsetParent.localName == 'div') {
      this.items.first._toggleMenu();
    } else {
      if (this.items.first) {
        this.items.first._toggleMenu();
        // console.log('elemasd');
      } else {
        this.lyMenu.hiddeMenu();
        // if (!this.lyMenu.list) {
        //   window.setTimeout(() => this.lyMenu.hiddeMenu(), 200);
        // }
      }
    }
  }
  lyMenu: LyMenu;
  @ContentChildren(LyMenuItems) items: QueryList<LyMenuItems>;
  constructor(
    @Optional() lyMenu: LyMenu,
    private elementRef: ElementRef,
  ) {
    this.lyMenu = lyMenu;
    // console.log(this.items);
  }
  ngOnInit() {
  }

}

@NgModule({
  imports: [CommonModule, FormsModule, LyRippleModule, LyCoreModule],
  exports: [LyMenuItem, LyMenu, LyMenuText, LyMenuTriggerFor, LyMenuItems],
  declarations: [LyMenuItem, LyMenu, LyMenuText, LyMenuTriggerFor, LyMenuItems],
})
export class LyMenuModule {
  static forRoot(): ModuleWithProviders {
    return {ngModule: LyMenuModule};
  }
}
