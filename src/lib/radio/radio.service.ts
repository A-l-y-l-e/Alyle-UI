import { Injectable } from '@angular/core';
import { CoreTheme } from '@alyle/ui';

@Injectable({
  providedIn: 'root'
})
export class LyRadioService {
  classes = {
    root: this.coreTheme.setUpStyle(
      'k-radio-group', {
        '': () => (
          `display: flex;` +
          `flex-wrap: wrap;`
        )
      }
    ),
    labelContent: this.coreTheme.setUpStyle(
      'k-radio-label-content', {
        '': () => (
          `padding: 0 0.5em;`
        )
      }
    )
  };
  constructor(
    private coreTheme: CoreTheme
  ) { }
}
