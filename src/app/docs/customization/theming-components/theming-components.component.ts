import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const STYLES = (_theme: ThemeVariables) => ({ });

@Component({
  selector: 'aui-theming-components',
  templateUrl: './theming-components.component.md',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemingComponentsComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);

  codeRoundedButton = `export class GlobalVariables implements PartialThemeVariables {
  ...
  button = {
    root: {
      borderRadius: '2em'
    }
  };
}`;

  constructor(private theme: LyTheme2) { }

  ngOnInit() {
  }

}
