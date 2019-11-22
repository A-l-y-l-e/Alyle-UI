import { Component } from '@angular/core';
import { LyTheme2, lyl } from '@alyle/ui';

const STYLES = {
  paper: {
    margin: '.5em',
    padding: '1em'
  }
};

@Component({
  selector: 'aui-basic-paper',
  templateUrl: './basic-paper.component.html'
})
export class BasicPaperComponent {
  readonly classes = this._theme.addStyleSheet(STYLES);
  readonly lyl = lyl;
  constructor(
    private _theme: LyTheme2
  ) { }
}
