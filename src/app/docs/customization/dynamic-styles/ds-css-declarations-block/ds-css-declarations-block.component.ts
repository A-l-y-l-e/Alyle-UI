import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2, lyl } from '@alyle/ui';

const STYLE_BORDER = () => lyl `{
  height: 120px
  width: 120px
  background: #ffe259
  background-image: linear-gradient(${
    [
      '45deg',
      '#ffe259 0%',
      '#ffa751 100%'
    ].join()
  })
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%
}`;

@Component({
  selector: 'aui-ds-css-declarations-block',
  templateUrl: './ds-css-declarations-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsCssDeclarationsBlockComponent implements OnInit {
  styleBorder = this._theme.renderStyle(STYLE_BORDER);
  constructor(
    private _theme: LyTheme2) { }

  ngOnInit() {
  }

}
