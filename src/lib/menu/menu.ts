import {
  Component,
  ElementRef,
  Input,
  Directive,
  TemplateRef,
  OnDestroy,
  Optional,
  HostListener,
  HostBinding,
  AfterViewInit,
  Renderer2,
  OnInit
} from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';
import { LyOverlay, OverlayFromTemplateRef, LyTheme2, shadowBuilder, ThemeVariables, Placement, XPosition, YPosition, DirPosition } from '@alyle/ui';

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
    const rects = el.getBoundingClientRect() as ClientRect;
    const targetRects = this.ref._targetPosition();
    const placement = this.placement;
    const xPosition = this.xPosition;
    const yPosition = this.yPosition;
    if (xPosition && yPosition) {
      throw new Error(`You can not use \`xPosition\` and \`yPosition\` together, use only one of them.`);
    }
    if ((xPosition || yPosition) && !placement) {
      throw new Error(`\`placement\` is required.`);
    }
    let x = 0,
        y = 0,
        ox = 'center',
        oy = 'center';
    if (placement || xPosition || yPosition) {
      if (placement) {
        if (placement === YPosition.above) {
          x = (targetRects.width - rects.width) / 2;
          y = -rects.height;
          oy = 'bottom';
        } else if (placement === YPosition.below) {
          x = (targetRects.width - rects.width) / 2;
          y = targetRects.height;
          oy = 'top';
        } else {
          const dir = this._theme.config.getDirection(placement as any);
          if (dir === DirPosition.left) {
            ox = '100%';
            x = -rects.width;
            y = (targetRects.height - rects.height) / 2;
          } else if (dir === DirPosition.right) {
            ox = '0%';
            x = targetRects.width;
            y = (targetRects.height - rects.height) / 2;
          }
        }
      }

      if (xPosition) {
        const dir = this._theme.config.getDirection(xPosition as any);
        if (dir === DirPosition.right) {
          ox = '0%';
          x = 0;
        } else if (dir === DirPosition.left) {
          ox = '100%';
          x = targetRects.width - rects.width;
        }
      } else if (yPosition) {
        if (yPosition === YPosition.above) {
          y = 0;
          oy = '0%';
        } else if (yPosition === YPosition.below) {
          y = targetRects.height - rects.height;
          oy = '100%';
        }
      }
    }
    this._setTransform(`translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`);
    this._renderer.setStyle(this._el.nativeElement, 'transform-origin', `${ox} ${oy} 0`);
  }

  private _setTransform(val: string) {
    this._renderer.setStyle(this._el.nativeElement, 'transform', val);
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

}
