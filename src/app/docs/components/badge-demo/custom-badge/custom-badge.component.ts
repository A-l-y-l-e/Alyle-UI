import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  LyTheme2,
  ThemeVariables,
  ThemeRef } from '@alyle/ui';
import { STYLES as BUTTON_STYLES } from '@alyle/ui/button';

const STYLES = (theme: ThemeVariables, ref: ThemeRef) => {
  const button = ref.selectorsOf(BUTTON_STYLES);
  const { after } = theme;
  return {
    container: (className: string) => `${className}{display:flex;justify-content:center;}${className} ${button.root}{margin-${after}:1em;}`,
    badge1: (className: string) => `${className}{border:2px solid ${theme.background.tertiary};min-width:20px;height:20px;padding:0 4px;}`,
    badge2: (className: string) => `${className}{border:2px solid ${theme.background.tertiary};min-width:12px;height:12px;padding:0;}`
  };
};

@Component({
  selector: 'aui-custom-badge',
  templateUrl: './custom-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomBadgeComponent implements OnInit {
  readonly classes = this._theme.renderStyleSheet(STYLES);
  constructor(
    private _theme: LyTheme2
  ) { }

  ngOnInit() {
  }

}
