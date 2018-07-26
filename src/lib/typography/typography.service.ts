import { Injectable } from '@angular/core';
import { CoreTheme } from '@alyle/ui';

@Injectable({
  providedIn: 'root'
})
export class LyTypographyClasses {
  root: string;
  constructor(
    styleCore: CoreTheme
  ) {
    this.root = styleCore.setUpStyleSecondary(
      'k-typ',
      () => (
        `margin: 1em 0 0.65em 0;` +
        `display: block;`
      )
    );
  }
}
