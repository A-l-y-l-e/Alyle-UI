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
  TemplateRef,
  ViewChild,
  Output,
  EventEmitter,
  OnChanges
  } from '@angular/core';
import {
  LyOverlay,
  LyTheme2,
  OverlayFactory,
  Placement,
  Positioning,
  shadowBuilder,
  ThemeVariables,
  XPosition,
  YPosition,
  StyleCollection,
  LyClasses,
  StyleTemplate,
  lyl,
  ThemeRef,
  LyOverlayPosition
  } from '@alyle/ui';
import {
  trigger,
  style,
  animate,
  transition,
  keyframes,
  AnimationEvent
} from '@angular/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { ViewportRuler } from '@angular/cdk/scrolling';

export interface LyMenuTheme {
  /** Styles for Menu Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
}

export interface LyMenuVariables {
  menu?: LyMenuTheme;
}

const STYLE_PRIORITY = -1;

export const STYLES = (theme: ThemeVariables & LyMenuVariables, ref: ThemeRef) => {
  const menu = ref.selectorsOf(STYLES);
  return {
    $priority: STYLE_PRIORITY,
    root: () => (
      theme.menu?.root
        && (theme.menu.root instanceof StyleCollection
          ? theme.menu.root.setTransformer(fn => fn(menu)).css
          : theme.menu.root(menu))
    ),
    container: lyl `{
      background: ${theme.background.primary.default}
      border-radius: 2px
      box-shadow: ${shadowBuilder(4)}
      display: block
      padding-top: 8px
      padding-bottom: 8px
      transform-origin: inherit
      pointer-events: all
      overflow: auto
      max-height: inherit
      max-width: inherit
      box-sizing: border-box
    }`,
    item: lyl `{
      display: flex
      min-height: 48px
      border-radius: 0
      width: 100%
      justify-content: flex-start
    }`
  };
};

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
export class LyMenu implements OnChanges, OnInit, AfterViewInit {
  /**
   * styles
   * @docs-private
   */
  readonly classes = this._theme.renderStyleSheet(STYLES);
  /**
   * Destroy menu
   * @docs-private
   */
  destroy: () => void;
  @ViewChild('container') _container?: ElementRef<HTMLDivElement>;

  @Input() ref: LyMenuTriggerFor;

  /** The point in the anchor where the menu `xAxis` will be attached. */
  @Input() xAnchor: XPosition;

  /** The point in the anchor where the menu `yAxis` will be attached. */
  @Input() yAnchor: YPosition;

  /** The x-axis position of the menu. */
  @Input() xAxis: XPosition;

  /** The y-axis position of the menu. */
  @Input() yAxis: YPosition;

  /**
   * Position where the menu will be placed.
   * @deprecated Use `xAxis` and` yAxis` together instead.
   */
  @Input() placement: Placement;


  /**
   * The x-axis position of the menu.
   * @deprecated Use `xAxis` instead.
   */
  @Input() xPosition: XPosition;

  /**
   * The y-axis position of the menu.
   * @deprecated Use `yAxis` instead.
   */
  @Input() yPosition: YPosition;

  /** Whether the menu has a backdrop. */
  @Input()
  get hasBackdrop(): boolean {
    return this._hasBackdrop;
  }
  set hasBackdrop(value: boolean) {
    this._hasBackdrop = coerceBooleanProperty(value);
  }
  private _hasBackdrop: boolean = true;

  @HostBinding('@menuLeave') menuLeave2;
  @HostListener('@menuLeave.done', ['$event']) endAnimation(e: AnimationEvent) {
    if (e.toState === 'void') {
      this.ref.destroy();
    }
  }

  constructor(
    private _theme: LyTheme2,
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _viewportRuler: ViewportRuler
  ) {
    this._renderer.addClass(this._el.nativeElement, this.classes.root);
  }

  ngOnChanges() {
    if (this.ref?._menuRef && this._container) {
      this.ref._menuRef.updateBackdrop(this.hasBackdrop);
      this._updatePlacement();
    }
  }

  ngOnInit() {
    if (!this.ref) {
      throw new Error('LyMenu: require @Input() ref');
    }
    // if (!this.placement && !this.xPosition && !this.yPosition) {
    //   this.xPosition = DEFAULT_XPOSITION;
    //   this.placement = DEFAULT_PLACEMENT;
    // }
  }

  ngAfterViewInit() {
    if (this.ref._menuRef) {
      this.ref._menuRef.onResizeScroll = this._updatePlacement.bind(this);
      this.ref._menuRef.updateBackdrop(this.hasBackdrop);
    }
    this._updatePlacement();
    this.ref.menuOpened.emit();
    Promise.resolve(null).then(() => {
      this.ref._setMenuOpenToTrue();
    });
  }

  private _updatePlacement () {
    const el = this.ref._menuRef!.containerElement as HTMLElement;
    const container = this._container!.nativeElement;

    // reset height & width
    this._renderer.setStyle(container, 'height', 'initial');
    this._renderer.setStyle(container, 'width', 'initial');

    const position = this.placement
      ? new Positioning(this.placement, this.xPosition, this.yPosition, this.ref._getHostElement(), el, this._theme.variables)
      : new LyOverlayPosition(this._theme, this._viewportRuler, this.ref._getHostElement(), el)
        .setXAnchor(this.xAnchor)
        .setYAnchor(this.yAnchor)
        .setXAxis(this.xAxis)
        .setYAxis(this.yAxis)
        .setFlip(true)
        .build();

    if (position instanceof Positioning) {
      // set position deprecated
      this._renderer.setStyle(el, 'transform', `translate3d(${position.x}px, ${position.y}px, 0)`);
      this._renderer.setStyle(this._el.nativeElement, 'transform-origin', `${position.ox} ${position.oy} 0`);

      // set height & width deprecated
      this._renderer.setStyle(container, 'height', position.height === 'initial' ? '100%' : position.height);
      this._renderer.setStyle(container, 'width', position.width === 'initial' ? '100%' : position.width);
    } else {
      // set position
      this._renderer.setStyle(el, 'left', `${position.x}px`);
      this._renderer.setStyle(el, 'top', `${position.y}px`);
      this._renderer.setStyle(container, 'width', position.width ? `${position.width}px` : '100%');
      this._renderer.setStyle(container, 'height', position.height ? `${position.height}px` : '100%');
      this._renderer.setStyle(this._el.nativeElement, 'transform-origin', `${position.xo}px ${position.yo}px 0`);
    }

  }

  static ngAcceptInputType_hasBackdrop: BooleanInput;
}

@Directive({
  selector: '[ly-menu-item]'
})
export class LyMenuItem {
  @HostListener('click') _click() {
    if (this._menu.ref && this._menu.ref._menuRef) {
      this._menu.ref.closeMenu();
    }
  }
  constructor(
    @Optional() private _menu: LyMenu,
    el: ElementRef,
    renderer: Renderer2
  ) {
    renderer.addClass(el.nativeElement, _menu.classes.item);
  }
}

@Directive({
  selector: '[lyMenuTriggerFor]',
  host: {
    '(click)': '_handleClick()',
    '(mouseenter)': '_handleMouseEnter()',
    '(mouseleave)': '_handleMouseLeave()'
  },
  exportAs: 'lyMenuTriggerFor'
})
export class LyMenuTriggerFor implements OnDestroy {
  /** Current menuRef */
  _menuRef?: OverlayFactory | null;
  private _menuOpen = false;
  private _destroying: boolean;

  /** Stream that emits when the menu item is hovered. */
  readonly _hovered: Subject<boolean> = new Subject<boolean>();

  /** Whether the menu is open. */
  get menuOpen() {
    return this._menuOpen;
  }

  @Input() lyMenuTriggerFor: TemplateRef<any>;

  /** Whether menu should open on hover. */
  @Input()
  get openOnHover(): boolean {
    return this._openOnHover;
  }
  set openOnHover(value: boolean) {
    this._openOnHover = coerceBooleanProperty(value);
  }
  private _openOnHover: boolean = true;

  @Output() readonly menuOpened = new EventEmitter<void>();
  @Output() readonly menuClosed = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef,
    private overlay: LyOverlay
  ) { }

  ngOnDestroy() {
    // Not force destruction if it is already being destroyed
    if (!this._destroying) {
      this.closeMenu();
    }
  }

  _handleClick() {
    this.toggleMenu();
  }

  _handleMouseEnter() {
    this._hovered.next(true);
  }

  _handleMouseLeave() {
    this._hovered.next(false);
  }

  /** Opens the menu */
  openMenu() {
    if (!this._menuRef) {
      this._menuRef = this.overlay.create(this.lyMenuTriggerFor, {
        $implicit: this
      }, {
        styles: {
          top: 0,
          left: 0,
          pointerEvents: null
        },
        fnDestroy: this.detach.bind(this),
        hasBackdrop: false
      });
    }
  }

  /** Closes the menu */
  closeMenu() {
    this.detach();
  }

  /** Toggle menu */
  toggleMenu() {
    if (this._menuRef) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /** @docs-private */
  detach() {
    if (this._menuRef) {
      this._destroying = true;
      this._menuRef.detach();
    }
  }

  /** @docs-private */
  destroy() {
    if (this._menuRef) {
      this.menuClosed.emit(null!);
      this._menuRef.remove();
      this._menuRef = null;
      this._destroying = false;
      Promise.resolve(null).then(() => this._menuOpen = false);
    }
  }

  _getHostElement() {
    return this.elementRef.nativeElement;
  }

  _setMenuOpenToTrue() {
    this._menuOpen = true;
  }

}
