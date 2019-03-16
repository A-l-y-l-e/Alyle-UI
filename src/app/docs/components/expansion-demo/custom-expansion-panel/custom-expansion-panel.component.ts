import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2, ThemeVariables, ThemeRef, shadowBuilder } from '@alyle/ui';
import { STYLES as STYLES_EXPANSION } from '@alyle/ui/expansion';


const STYLES = (theme: ThemeVariables, themeRef: ThemeRef) => {
  // The classes for `expansion` are not yet created, therefore,
  // we will create them to use them.
  const expansion = themeRef.addStyleSheet(STYLES_EXPANSION);
  return ({
    expansion: {
      [`.${expansion.panel}`]: {
        // this add animations to the `box-shadow`,
        // since by default it is only added to 'margin'
        transitionProperty: 'margin, box-shadow'
      },
      [`.${expansion.expanded}`]: {
        [`&.${expansion.panel}`]: {
          boxShadow: shadowBuilder(8)
        },
        [`.${expansion.panelHeader}`]: {
          color: theme.primary.default
        }
      }
    }
  });
};

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
