import { Directive, Input, TemplateRef } from '@angular/core';
import { LyTheme2, LyOverlay, OverlayFromTemplateRef, ThemeVariables, shadowBuilder } from '@alyle/ui';

const STYLE_PRIORITY = -2;
const DEFAULT_DURATION = 6e3;
const DEFAULT_HORIZONTAL_POSITION = 'end';
const DEFAULT_VERTICAL_POSITION = 'bottom';

@Directive({
  selector: 'ng-template[ly-snack-bar]',
  exportAs: 'lySnackBar'
})
export class LySnackBar {
  private _snackBarOverlay: OverlayFromTemplateRef;
  private _timer: any;
  @Input() duration: number;
  @Input() horizontalPosition: 'start' | 'center' | 'end' | 'left' | 'right';
  @Input() verticalPosition: 'top' | 'bottom';
  constructor(
    private _templateRef: TemplateRef<any>,
    private _theme: LyTheme2,
    private _overlay: LyOverlay
  ) { }

  open() {
    // close previous snackBar if exist
    this.close();

    const duration = this.duration;
    const horizontalPosition = this.horizontalPosition || DEFAULT_HORIZONTAL_POSITION;
    const verticalPosition = this.verticalPosition || DEFAULT_VERTICAL_POSITION;

    const snackBar = this._snackBarOverlay = this._overlay.create(this._templateRef, undefined, {
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
    /**
     * TODO: add support for `@keyframes`
     */
    getComputedStyle(snackBar.containerElement).getPropertyValue('opacity');

    this._theme.addStyle('SnackBar:open', ({
      opacity: 1
    }), snackBar.containerElement, undefined, STYLE_PRIORITY);
    this._timer = setTimeout(() => {
      this.close();
    }, duration || DEFAULT_DURATION);
  }

  /** close snackBar */
  close() {
    const snackBar = this._snackBarOverlay;
    const timer = this._timer;
    if (snackBar) {
      if (timer) {
        // clear previous timer
        clearTimeout(timer);
      }
      this._theme.addStyle('SnackBar:close', ({
        opacity: 0
      }), snackBar.containerElement, undefined, STYLE_PRIORITY);
      setTimeout(() => {
        snackBar.destroy();
      }, 350);
      this._snackBarOverlay = null;
    }
  }
}
