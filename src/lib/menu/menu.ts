import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  TemplateRef
  } from '@angular/core';
import {
  LyOverlay,
  LyTheme2,
  OverlayFromTemplateRef,
  Placement,
  Positioning,
  shadowBuilder,
  ThemeVariables,
  XPosition,
  YPosition
  } from '@alyle/ui';
import {
  trigger,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';

const STYLE_PRIORITY = -1;
const DEFAULT_PLACEMENT = YPosition.below;
const DEFAULT_XPOSITION = XPosition.after;

const STYLES = (theme: ThemeVariables) => ({
  container: {
    background: theme.background.primary.default,
    borderRadius: '2px',
    boxShadow: shadowBuilder(4),
    display: 'inline-block',
    paddingTop: '8px',
    paddingBottom: '8px',
    transformOrigin: 'inherit',
    pointerEvents: 'all',
    ...theme.menu.root
  }
});

const ANIMATIONS = [
  trigger('menuEnter', [
    transition('void => in', [
      animate('125ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
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
    transition('* => void', animate('150ms linear', style({ opacity: 0 })))
  ])
];

/** Menu container */
@Component({
  selector: 'ly-menu',
  animations: [...ANIMATIONS],
  templateUrl: 'menu.html',
  exportAs: 'lyMenu'
})
export class LyMenu implements OnInit, AfterViewInit {
  /**
   * styles
   * @docs-private
   */
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  /**
   * Destroy menu
   * @docs-private
   */
  destroy: () => void;
  @Input() ref: LyMenuTriggerFor;

  /** Position where the menu will be placed. */
  @Input() placement: Placement;

  /** The x-axis position of the menu. */
  @Input() xPosition: XPosition;

  /** The y-axis position of the menu. */
  @Input() yPosition: YPosition;

  @HostBinding('@menuLeave') menuLeave2;
  @HostListener('@menuLeave.done', ['$event']) endAnimation(e) {
    if (e.toState === 'void') {
      this.ref.destroy();
    }
  }
  constructor(
    private _theme: LyTheme2,
    private _el: ElementRef,
    private _renderer: Renderer2
  ) { }

  ngOnInit() {
    if (!this.placement && !this.xPosition && !this.yPosition) {
      this.xPosition = DEFAULT_XPOSITION;
      this.placement = DEFAULT_PLACEMENT;
    }
  }

  ngAfterViewInit() {
    this._updatePlacement();
  }

  private _updatePlacement () {
    const el = this._el.nativeElement as HTMLElement;
    const position = new Positioning(this.placement, this.xPosition, this.yPosition, this.ref._getHostElement(), el, this._theme.config);
    this._renderer.setStyle(el, 'transform', `translate3d(${position.x}px, ${position.y}px, 0)`);
    this._renderer.setStyle(el, 'transform-origin', `${position.ox} ${position.oy} 0`);
  }
}

/** @docs-private */
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
  ) { }

  /** @docs-private */
  _targetPosition() {
    const element: HTMLElement = this.elementRef.nativeElement;
    const rect: ClientRect = element.getBoundingClientRect();
    return rect;
  }

  _handleClick() {
    if (this._menuRef) {
      this._menuRef.detach();
    } else {
      const rect = this._targetPosition();
      this._menuRef = this.overlay.create(this.lyMenuTriggerFor, {
        $implicit: this
      }, {
        styles: {
          top: rect.top,
          left: rect.left,
          right: null,
          bottom: null,
          pointerEvents: null
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

  _getHostElement() {
    return this.elementRef.nativeElement;
  }

}
