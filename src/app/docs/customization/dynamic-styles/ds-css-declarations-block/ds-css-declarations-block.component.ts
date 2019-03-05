import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLE_BORDER = ({
  height: '120px',
  width: '120px',
  background: '#ffe259',
  backgroundImage: `linear-gradient(${
    [
      '45deg',
      `${'#ffe259'} 0%`,
      `${'#ffa751'} 100%`
    ].join()
  })`,
  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
});

@Component({
  selector: 'aui-ds-css-declarations-block',
  templateUrl: './ds-css-declarations-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsCssDeclarationsBlockComponent implements OnInit {
  styleWaterDrop = this._theme.style(STYLE_BORDER);
  constructor(
    private _theme: LyTheme2) { }

  ngOnInit() {
  }

}
