import {
  Component,
  ElementRef,
  Input,
  Directive,
  TemplateRef,
  OnDestroy,
  Optional,
  HostListener,
  HostBinding
} from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';
import { LyOverlay, OverlayFromTemplateRef, LyTheme2, shadowBuilder, ThemeVariables } from '@alyle/ui';

const STYLE_PRIORITY = -1;

const STYLES = (theme: ThemeVariables) => ({
  root: {
    background: theme.background.primary.default,
    borderRadius: '2px',
    boxShadow: shadowBuilder(4),
    display: 'inline-block',
    paddingTop: '8px',
    paddingBottom: '8px',
    transformOrigin: 'left top 0px',
    ...theme.menu.root
  }
});

/** Menu container */
@Component({
  selector: 'ly-menu',
  animations: [
    trigger('menuEnter', [
      transition(':enter', [
        animate('120ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
          style({
            opacity: 0,
            transform: 'scale(0.8)'
          }),
          style({
            opacity: 1,
            transform: 'scale(1)'
          })
        ]))
      ]),
    ]),
    trigger('menuLeave', [
      transition('* => void', animate('100ms 25ms linear', style({ opacity: 0 })))
    ])
  ],
  template: '<ng-content></ng-content>',
  exportAs: 'lyMenu'
})
export class LyMenu {
  /**
   * styles
   * @ignore
   */
  classes = this.theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  /**
   * Destroy menu
   * @ignore
   */
  destroy: () => void;
  @Input() ref: LyMenuTriggerFor;
  @HostBinding('@menuEnter') menuEnter;
  @HostBinding('@menuLeave') menuLeave2;
  @HostListener('@menuLeave.done', ['$event']) endAnimation(e) {
    if (e.toState === 'void') {
      this.ref.destroy();
    }
  }
  constructor(
    private theme: LyTheme2,
    private _el: ElementRef
  ) {
    this._el.nativeElement.classList.add(this.classes.root);
  }

}

const menuItemStyles = ({
  display: 'block',
  minHeight: '48px',
  borderRadius: 0,
  width: '100%'
});

@Directive({
  selector: '[ly-menu-item]'
})
export class LyMenuItem {
  @HostListener('click') _click() {
    if (this._menu.ref) {
      this._menu.ref._menuRef.detach();
    }
  }
  constructor(
    @Optional() private _menu: LyMenu,
    el: ElementRef,
    theme: LyTheme2
  ) {
    theme.addStyle('lyMenuItem', menuItemStyles, el.nativeElement, undefined, STYLE_PRIORITY);
  }
}

@Directive({
  selector: '[lyMenuTriggerFor]',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(click)': '_handleClick($event)'
  }
})
export class LyMenuTriggerFor implements OnDestroy {
  /** Current menuRef */
  _menuRef: OverlayFromTemplateRef;
  @Input() lyMenuTriggerFor: TemplateRef<any>;
  constructor(
    private elementRef: ElementRef,
    private overlay: LyOverlay
  ) {}

  targetPosition() {
    const element: HTMLElement = this.elementRef.nativeElement;
    const rect: ClientRect = element.getBoundingClientRect();
    return rect;
  }

  _handleClick() {
    if (this._menuRef) {
      this._menuRef.detach();
    } else {
      const rect = this.targetPosition();
      this._menuRef = this.overlay.create(this.lyMenuTriggerFor, {
        $implicit: this
      }, {
        styles: {
          top: rect.top,
          left: rect.left,
          right: null,
          bottom: null,
        },
        fnDestroy: this.detach.bind(this),
        host: this.elementRef.nativeElement,
        backdrop: true
      });
    }
  }

  detach() {
    this._menuRef.detach();
  }

  destroy() {
    if (this._menuRef) {
      this._menuRef.remove();
      this._menuRef = null;
    }
  }

  ngOnDestroy() {
    if (this._menuRef) {
      this._menuRef.detach();
    }
  }

}
