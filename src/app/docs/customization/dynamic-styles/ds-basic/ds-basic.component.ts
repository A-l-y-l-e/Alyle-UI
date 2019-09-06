import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2, ThemeVariables, lyl, ThemeRef } from '@alyle/ui';

/**
 * Basic style
 */
const styles = (theme: ThemeVariables, ref: ThemeRef) => {
  const classes = ref.getClasses(styles);
  return {
    // Style name, is optional, this is used to add a prefix to all classes,
    // it will only be seen in dev mode
    $name: 'example',
    // This would be like the name of the class
    demo: () => lyl `{
      color: ${theme.primary.default}
      border-${theme.before}: 2px solid
      padding-${theme.before}: .5em
      .${classes.demo}:hover {
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
  selector: 'aui-ds-basic',
  templateUrl: './ds-basic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsBasicComponent {
  readonly classes = this.theme.addStyleSheet(styles);

  constructor(
    private theme: LyTheme2
  ) { }

}
