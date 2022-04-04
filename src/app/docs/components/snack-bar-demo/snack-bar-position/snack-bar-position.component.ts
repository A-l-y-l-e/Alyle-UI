import { Component, ChangeDetectionStrategy } from '@angular/core';
import { lyl, StyleRenderer, ThemeRef, ThemeVariables } from '@alyle/ui';
import { STYLES as FIELD_STYLES } from '@alyle/ui/field';
import { LySnackBarHorizontalPosition, LySnackBarVerticalPosition } from '@alyle/ui/snack-bar';

export const STYLES = (theme: ThemeVariables, ref: ThemeRef) => {
  ref.renderStyleSheet(FIELD_STYLES);
  const field = ref.selectorsOf(FIELD_STYLES);
  const { after } = theme;
  return {
    root: lyl `{
      ${field.root} {
        margin-${after}: 8px
      }
    }`
  };
};

@Component({
  selector: 'aui-snack-bar-position',
  templateUrl: './snack-bar-position.component.html',
  providers: [
    StyleRenderer
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackBarPositionComponent {
  horizontalPosition: LySnackBarHorizontalPosition = 'before';
  verticalPosition: LySnackBarVerticalPosition = 'below';
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

}
