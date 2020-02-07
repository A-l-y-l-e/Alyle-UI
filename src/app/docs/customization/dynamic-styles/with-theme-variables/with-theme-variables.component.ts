import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  StyleRenderer,
  ThemeVariables } from '@alyle/ui';

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
    demo: (className: string) => `${className}{color:${theme.primary.default};border-${before}:2px solid;padding-${before}:.5em;}${className}:hover{color:${theme.accent.default};}`,
    buttonLink: (className: string) => `${className}{color:${theme.primary.default};text-decoration:inherit;}${className}:hover{text-decoration:underline;}`
  };
};

@Component({
  selector: 'aui-with-theme-variables',
  templateUrl: './with-theme-variables.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WithThemeVariablesComponent {
  readonly classes = this.sRenderer.renderSheet(STYLES);

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

}
