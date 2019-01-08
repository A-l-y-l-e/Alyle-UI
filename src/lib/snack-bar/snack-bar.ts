import { Directive, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { LyTheme2, LyOverlay, ThemeVariables, shadowBuilder, XPosition, YPosition } from '@alyle/ui';
import { LySnackBarService } from './snack-bar.service';
import { LySnackBarRef } from './snack-bar-ref';

const STYLE_PRIORITY = -2;
const DEFAULT_HORIZONTAL_POSITION = XPosition.after;
const DEFAULT_VERTICAL_POSITION = YPosition.below;

/** Event that is emitted when a snack bar is dismissed. */
export interface LySnackBarDismiss {
  /** Whether the snack bar was dismissed using the action fn. */
  dismissedByAction: boolean;
}

@Directive({
  selector: 'ng-template[ly-snack-bar]',
  exportAs: 'lySnackBar'
})
export class LySnackBar {
  @Input() duration: number;
  @Input() horizontalPosition: 'center' | XPosition;
  @Input() verticalPosition: YPosition;
  @Output() afterDismissed = new EventEmitter<LySnackBarDismiss>();
  constructor(
    private _templateRef: TemplateRef<any>,
    private _theme: LyTheme2,
    private _overlay: LyOverlay,
    private _snackBarService: LySnackBarService
  ) { }

  open() {
    // close previous snackBar if exist
    const sbrPrev = this._snackBarService._currentSnackBar;
    if (sbrPrev) {
      sbrPrev.dismiss();
    }

    const duration = this.duration;
    const horizontalPosition = this.horizontalPosition || DEFAULT_HORIZONTAL_POSITION;
    const verticalPosition = this.verticalPosition || DEFAULT_VERTICAL_POSITION;

    const snackBar = this._overlay.create(this._templateRef, undefined, {
      styles: {
        // this remove previous style
        justifyContent: null
      },
      classes: [
        this._theme.addStyle('SnackBar', (theme: ThemeVariables) => ({
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '8px',
          padding: '0 16px',
          minHeight: '48px',
          minWidth: '320px',
          maxWidth: '320px',
          opacity: 0,
          transition: `opacity ${theme.animations.curves.standard} 350ms, transform ${theme.animations.curves.deceleration} 350ms`,
          fontSize: theme.pxToRem(theme.typography.fontSize),
          boxShadow: shadowBuilder(4, theme.snackBar.root.background as string),
          [theme.getBreakpoint('XSmall')]: {
            width: 'calc(100% - 16px)',
            minWidth: 'calc(100% - 16px)'
          },
          ...theme.snackBar.root,
        }), undefined, undefined, STYLE_PRIORITY),
        this._theme.addStyle(`SnackBar.hp:${horizontalPosition}.vp:${verticalPosition}`, (theme: ThemeVariables) => {
          const __styles: {
            marginLeft?: 'auto',
            left?: 0,
            marginRight?: 'auto',
            right?: 0,
            transform?: string,
            top?: number
            bottom?: number
          } = { };
          if (verticalPosition === YPosition.above) {
            __styles.transform = 'translateY(-180%)';
            __styles.top = 0;
          } if (verticalPosition === YPosition.below) {
            __styles.transform = 'translateY(180%)';
            __styles.bottom = 0;
          }
          if (horizontalPosition === 'center') {
            __styles.marginRight = __styles.marginLeft = 'auto';
            __styles.left = __styles.right = 0;
          } else {
            __styles[theme.getDirection(horizontalPosition as any)] = 0;
          }
          return __styles;
        }, undefined, undefined, STYLE_PRIORITY)
      ]
    });

    this._theme.requestAnimationFrame(() => {
      this._theme.addStyle('SnackBar:open', ({
        opacity: 1,
        transform: 'translateY(0)'
      }), snackBar.containerElement, undefined, STYLE_PRIORITY);
    });

    window.getComputedStyle(snackBar.containerElement).getPropertyValue('opacity');

    const sbr = new LySnackBarRef(this._snackBarService, snackBar, this.afterDismissed, duration, this._theme);
    this._snackBarService._currentSnackBar = sbr;
    return sbr;
  }

  /** Dismiss snackBar */
  dismiss() {
    const sbr = this._snackBarService._currentSnackBar;
    if (sbr) {
      sbr.dismissWithAction();
    }
  }
}
