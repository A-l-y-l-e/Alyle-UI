import { Directive, Input, TemplateRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { LyTheme2, LyOverlay, ThemeVariables, XPosition, YPosition, lyl, StyleTemplate, StyleCollection } from '@alyle/ui';
import { LySnackBarService } from './snack-bar.service';
import { LySnackBarRef } from './snack-bar-ref';

export interface LySnackBarTheme {
  /** Styles for SnackBar Component */
  root?: StyleTemplate | StyleCollection;
}


export interface LySnackBarVariables {
  snackBar?: LySnackBarTheme;
}

/** Possible values for horizontalPosition on LySnackBarConfig. */
export type LySnackBarHorizontalPosition = 'center' | 'before' | 'after' | 'left' | 'right';

/** Possible values for verticalPosition on LySnackBarConfig. */
export type LySnackBarVerticalPosition = 'above' | 'below';

const STYLE_PRIORITY = -2;
const DEFAULT_HORIZONTAL_POSITION = XPosition.after;
const DEFAULT_VERTICAL_POSITION = YPosition.below;
export const STYLES = (theme: ThemeVariables & LySnackBarVariables) => ({
  $priority: STYLE_PRIORITY,
  root: lyl `{
    border-radius: 4px
    display: flex
    justify-content: space-between
    align-items: center
    margin: 8px
    padding: 0 16px
    min-height: 48px
    min-width: 320px
    max-width: 320px
    opacity: 0
    transition: opacity ${theme.animations.curves.standard} 350ms, transform ${theme.animations.curves.deceleration} 350ms
    font-size: ${theme.pxToRem(theme.typography.fontSize)}
    box-sizing: border-box
    pointer-events: all !important
    @media ${theme.breakpoints['XSmall']} {
      width: calc(100% - 16px)
      min-width: calc(100% - 16px)
    }
    {
      ...${
        (theme.snackBar
          && theme.snackBar.root) || null
      }
    }
  }`
});

/** Event that is emitted when a snack bar is dismissed. */
export interface LySnackBarDismiss {
  /** Whether the snack bar was dismissed using the action fn. */
  dismissedByAction: boolean;
}

@Directive({
  selector: 'ng-template[ly-snack-bar]',
  exportAs: 'lySnackBar'
})
export class LySnackBar implements OnDestroy {

  readonly classes = this._theme.renderStyleSheet(STYLES);
  @Input() duration: number | 'Infinity';
  @Input() horizontalPosition: 'center' | XPosition | LySnackBarHorizontalPosition;
  @Input() verticalPosition: YPosition | LySnackBarVerticalPosition;
  @Output() afterDismissed = new EventEmitter<LySnackBarDismiss>();

  constructor(
    private _templateRef: TemplateRef<any>,
    private _theme: LyTheme2,
    private _overlay: LyOverlay,
    private _snackBarService: LySnackBarService
  ) { }

  ngOnDestroy() {
    this.dismiss();
  }
  /**
   * Open a LySnackBar template
   * @param snackBarData Data to be passed to the snack-bark.
   */
  open(snackBarData?: any) {
    // close previous snackBar if exist
    const sbrPrev = this._snackBarService._currentSnackBar;
    if (sbrPrev) {
      sbrPrev.dismiss();
    }

    const duration = this.duration;
    const horizontalPosition = this.horizontalPosition || DEFAULT_HORIZONTAL_POSITION;
    const verticalPosition = this.verticalPosition || DEFAULT_VERTICAL_POSITION;

    const snackBar = this._overlay.create(this._templateRef, snackBarData, {
      styles: {
        // this remove previous style
        justifyContent: null
      },
      hasBackdrop: false,
      classes: [
        this.classes.root,
        this._theme.renderStyle(`SnackBar.hp:${horizontalPosition}.vp:${verticalPosition}`, (theme: ThemeVariables) => {
          let marginLeft: 'auto' | undefined;
          let left: 0 | undefined;
          let marginRight: 'auto' | undefined;
          let right: 0 | undefined;
          let transform: string | undefined;
          let top: number | undefined;
          let bottom: number | undefined;
          let hp: string | undefined;

          if (verticalPosition === YPosition.above) {
            transform = 'translateY(-180%)';
            top = 0;
          } else if (verticalPosition === YPosition.below) {
            transform = 'translateY(180%)';
            bottom = 0;
          }
          if (horizontalPosition === 'center') {
            marginRight = marginLeft = 'auto';
            left = right = 0;
          } else {
            hp = theme.getDirection(horizontalPosition as any);
          }

          return lyl `{
            margin-left: ${marginLeft}
            left: ${left}
            margin-right: ${marginRight}
            right: ${right}
            transform: ${transform}
            top: ${top}
            bottom: ${bottom}
            ${hp}: 0
          }`;
        }, STYLE_PRIORITY)
      ]
    });

    this._theme.requestAnimationFrame(() => {
      const newClass = this._theme.renderStyle('SnackBar:open', () => (
        lyl `{
          opacity: 1
          transform: translateY(0)
        }`
      ), STYLE_PRIORITY + 1);
      snackBar.containerElement.classList.add(newClass);
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
