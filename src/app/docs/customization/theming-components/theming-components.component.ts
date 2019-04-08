import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const STYLES = (_theme: ThemeVariables) => ({ });

@Component({
  selector: 'aui-theming-components',
  templateUrl: './theming-components.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemingComponentsComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);


  constructor(private theme: LyTheme2) { }

  ngOnInit() {
  }

}
