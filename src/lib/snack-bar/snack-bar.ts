import { Directive, Input, TemplateRef, Output, EventEmitter, NgZone } from '@angular/core';
import { LyTheme2, LyOverlay, ThemeVariables, shadowBuilder } from '@alyle/ui';
import { LySnackBarService } from './snack-bar.service';
import { LySnackBarRef } from './snack-bar-ref';

const STYLE_PRIORITY = -2;
const DEFAULT_HORIZONTAL_POSITION = 'end';
const DEFAULT_VERTICAL_POSITION = 'bottom';

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
  @Input() horizontalPosition: 'start' | 'center' | 'end' | 'left' | 'right';
  @Input() verticalPosition: 'top' | 'bottom';
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
          minWidth: '256px',
          opacity: 0,
          transition: `opacity ${theme.animations.curves.standard} 350ms`,
          fontSize: theme.pxToRem(theme.typography.fontSize),
          boxShadow: shadowBuilder(4, theme.snackBar.root.background as string),
          [theme.getBreakpoint('XSmall')]: {
            width: 'calc(100% - 16px)'
          },
          ...theme.snackBar.root,
        }), undefined, undefined, STYLE_PRIORITY),
        this._theme.addStyle(`SnackBar.hp:${horizontalPosition}.vp:${verticalPosition}`, () => {
          const __styles: {
            marginLeft?: 'auto',
            left?: 0,
            marginRight?: 'auto',
            right?: 0,
          } = {
            [verticalPosition]: 0
          };
          if (horizontalPosition === 'center') {
            __styles.marginRight = __styles.marginLeft = 'auto';
            __styles.left = __styles.right = 0;
          } else {
            __styles[horizontalPosition] = 0;
          }
          return __styles;
        }, undefined, undefined, STYLE_PRIORITY)
      ]
    });

    this._theme.requestAnimationFrame(() => {
      this._theme.addStyle('SnackBar:open', ({
        opacity: 1
      }), snackBar.containerElement, undefined, STYLE_PRIORITY);
    });

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
