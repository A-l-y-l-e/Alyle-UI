import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StyleRenderer, ThemeVariables, lyl } from '@alyle/ui';

/**
 * Basic style
 */
const STYLES = (theme: ThemeVariables) => {
  const { before } = theme;
  return {
    // Style name, is optional, this is used to add a prefix to all classes,
    // it will only be seen in dev mode
    $name: 'example',
    // This would be like the name of the class
    demo: lyl `{
      color: ${theme.primary.default}
      border-${before}: 2px solid
      padding-${before}: .5em
      &:hover {
        color: ${theme.accent.default}
      }
    }`,
    buttonLink: lyl `{
      color: ${theme.primary.default}
      text-decoration: inherit
      &:hover {
        text-decoration: underline
      }
    }`
  };
};

@Component({
  selector: 'aui-with-theme-variables',
  templateUrl: './with-theme-variables.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class WithThemeVariablesComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES);

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

}
