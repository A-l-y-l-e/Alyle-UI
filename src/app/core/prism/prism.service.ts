import { Injectable } from '@angular/core';
import { LyTheme, ProvidedInTheme } from '@alyle/ui';

@Injectable(ProvidedInTheme)
export class PrismService {
  classes = {
    root: this.theme.setStyle(
      'prism',
      () => (
        `color: ${this.theme.palette.codeColor};` +
        `background-color: ${this.theme.palette.codeBg};`
      )
    )
  };
  constructor(
    private theme: LyTheme
  ) { }
}
