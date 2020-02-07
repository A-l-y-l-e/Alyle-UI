import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  LyTheme2 } from '@alyle/ui';

const STYLES = () => ({
  menu: (className: string) => `${className}{color:red;}`
});

@Component({
  selector: 'aui-ds-reusable-styles',
  templateUrl: './ds-reusable-styles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsReusableStylesComponent implements OnInit {

  readonly classes = this._theme.renderStyleSheet(STYLES);

  constructor(
    private _theme: LyTheme2
  ) { }

  ngOnInit() {
  }

}
