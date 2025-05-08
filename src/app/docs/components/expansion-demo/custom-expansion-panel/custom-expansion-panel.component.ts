import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2, ThemeVariables, ThemeRef, lyl } from '@alyle/ui';
import { STYLES as EXPANSION_STYLES } from '@alyle/ui/expansion';


const STYLES = (theme: ThemeVariables, ref: ThemeRef) => {
  // The classes for `expansion` are not yet created, therefore,
  // we will create them to use them.
  const expansion = ref.selectorsOf(EXPANSION_STYLES);

  const { before } = theme;

  return ({
    expansion: ( ) => lyl `{
      ${expansion.panel} {
        &::after {
          transition: border ${
            theme.animations.durations.entering}ms ${
            theme.animations.curves.standard
          }
          content: ''
          position: absolute
          top: 0
          bottom: 0
          ${before}: 0
          border-${before}: 2px solid transparent
        }
      }
      ${expansion.panelHeader} {
        height: 54px
      }
      ${expansion.panelTitle} {
        font-weight: 500
      }

      ${expansion.expanded} {
        ${expansion.panelHeader} {
          height: 64px
        }
        &${expansion.panel} {
          background: ${theme.background.secondary}
          &::after {
            border-${before}: 2px solid ${theme.primary.default}
          }
        }
        ${expansion.panelHeader} ${expansion.panelTitle} {
          color: ${theme.primary.default}
        }
      }
    }`
  });
};

@Component({
  selector: 'aui-custom-expansion-panel',
  templateUrl: './custom-expansion-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CustomExpansionPanelComponent {
  readonly classes = this._theme.addStyleSheet(STYLES);

  panelStates = [
    { state: false },
    { state: true },
    { state: false }
  ];

  constructor(private _theme: LyTheme2) { }

}
