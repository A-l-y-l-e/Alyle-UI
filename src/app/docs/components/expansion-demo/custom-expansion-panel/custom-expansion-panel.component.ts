import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const STYLES = (theme: ThemeVariables) => ({
  anim: {
    transition: `margin ${theme.animations.durations.entering}ms ${theme.animations.curves.standard}`
  }
});

@Component({
  selector: 'aui-custom-expansion-panel',
  templateUrl: './custom-expansion-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomExpansionPanelComponent implements OnInit {
  readonly classes = this._theme.addStyleSheet(STYLES);

  panelStates = [
    { state: false },
    { state: true },
    { state: false }
  ];

  constructor(private _theme: LyTheme2) { }

  ngOnInit() {
  }

}
